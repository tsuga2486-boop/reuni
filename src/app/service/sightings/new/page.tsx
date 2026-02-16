'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import styles from './page.module.css';
import { supabase, createSighting } from '@/lib/supabase';

// 地図コンポーネント（Google Maps版・クライアントサイドのみ）
const MapComponent = dynamic(() => import('@/components/map/GoogleMapView'), {
    ssr: false,
    loading: () => (
        <div className={styles.mapLoading}>
            <p>地図を読み込み中...</p>
        </div>
    ),
});

// サーバーサイドAPI経由の逆ジオコーディング
async function reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
        const response = await fetch(`/api/geocode?lat=${lat}&lng=${lng}`);
        const data = await response.json();

        if (response.ok && data.address) {
            return data.address;
        }

        console.warn('Geocoding API error:', data.error);
        return `緯度: ${lat.toFixed(6)}, 経度: ${lng.toFixed(6)}`;
    } catch (error) {
        console.error('Geocoding API エラー:', error);
        return `緯度: ${lat.toFixed(6)}, 経度: ${lng.toFixed(6)}`;
    }
}

export default function NewSightingPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isGeocodingLoading, setIsGeocodingLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        type: 'sighting',
        species: '犬',
        description: '',
        location: '',
        lat: null as number | null,
        lng: null as number | null,
        sightedAt: new Date().toISOString().slice(0, 16),
    });

    // 地図表示モード
    const [showMap, setShowMap] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setUserId(user.id);
        };
        checkAuth();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 地図クリックで位置を設定（住所も自動取得）
    const handleMapClick = async (lat: number, lng: number) => {
        setFormData({
            ...formData,
            lat,
            lng,
        });

        // 逆ジオコーディングで住所を取得
        setIsGeocodingLoading(true);
        const address = await reverseGeocode(lat, lng);
        setFormData(prev => ({
            ...prev,
            lat,
            lng,
            location: address,
        }));
        setIsGeocodingLoading(false);
    };

    // 現在地を取得
    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    setFormData({
                        ...formData,
                        lat,
                        lng,
                    });

                    // 逆ジオコーディングで住所を取得
                    setIsGeocodingLoading(true);
                    const address = await reverseGeocode(lat, lng);
                    setFormData(prev => ({
                        ...prev,
                        lat,
                        lng,
                        location: address,
                    }));
                    setIsGeocodingLoading(false);
                },
                (error) => {
                    console.error('位置情報の取得に失敗しました:', error);
                    alert('位置情報の取得に失敗しました');
                }
            );
        } else {
            alert('このブラウザは位置情報をサポートしていません');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await createSighting({
                reporter_id: userId || undefined,
                type: formData.type as 'sighting' | 'protected',
                species: formData.species as '犬' | '猫' | 'その他',
                description: formData.description,
                location: formData.location,
                lat: formData.lat || undefined,
                lng: formData.lng || undefined,
                sighted_at: formData.sightedAt,
            });

            router.push('/service/sightings');
        } catch (err: any) {
            console.error('投稿エラー:', err);
            setError('投稿に失敗しました。もう一度お試しください。');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.newSightingPage}>
            <div className="container">
                <div className={styles.pageHeader}>
                    <Link href="/service" className={styles.backLink}>
                        ← サービスに戻る
                    </Link>
                    <h1>目撃・保護情報を投稿</h1>
                    <p>迷子のペットを見かけた、または保護した情報を共有してください</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Type Selection */}
                    <div className={styles.formSection}>
                        <h2>情報の種類</h2>
                        <div className={styles.typeSelection}>
                            <label className={`${styles.typeOption} ${formData.type === 'sighting' ? styles.selected : ''}`}>
                                <input
                                    type="radio"
                                    name="type"
                                    value="sighting"
                                    checked={formData.type === 'sighting'}
                                    onChange={handleChange}
                                />
                                <span className={styles.typeIcon}>👀</span>
                                <span className={styles.typeLabel}>目撃情報</span>
                                <span className={styles.typeDesc}>迷子のペットを見かけた</span>
                            </label>
                            <label className={`${styles.typeOption} ${formData.type === 'protected' ? styles.selected : ''}`}>
                                <input
                                    type="radio"
                                    name="type"
                                    value="protected"
                                    checked={formData.type === 'protected'}
                                    onChange={handleChange}
                                />
                                <span className={styles.typeIcon}>🏠</span>
                                <span className={styles.typeLabel}>保護情報</span>
                                <span className={styles.typeDesc}>迷子のペットを保護した</span>
                            </label>
                        </div>
                    </div>

                    {/* Pet Info */}
                    <div className={styles.formSection}>
                        <h2>ペットの情報</h2>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label htmlFor="species">種類 *</label>
                                <select
                                    id="species"
                                    name="species"
                                    className="input"
                                    value={formData.species}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="犬">犬</option>
                                    <option value="猫">猫</option>
                                    <option value="その他">その他</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="sightedAt">発見日時 *</label>
                                <input
                                    type="datetime-local"
                                    id="sightedAt"
                                    name="sightedAt"
                                    className="input"
                                    value={formData.sightedAt}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="description">詳細説明 *</label>
                            <textarea
                                id="description"
                                name="description"
                                className={`input ${styles.textarea}`}
                                placeholder="ペットの特徴（色、サイズ、首輪の有無など）、状況を詳しく記入してください"
                                value={formData.description}
                                onChange={handleChange}
                                rows={5}
                                required
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div className={styles.formSection}>
                        <h2>場所</h2>
                        <div className={styles.formGroup}>
                            <label htmlFor="location">発見場所（住所） *</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                className="input"
                                placeholder="例: 東京都渋谷区代々木公園付近"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                            <p className={styles.hint}>
                                できるだけ詳しい住所や目印を入力してください
                            </p>
                        </div>

                        {/* Map Location Selector */}
                        <div className={styles.locationSection}>
                            <div className={styles.locationHeader}>
                                <label>📍 地図で正確な位置を指定（任意）</label>
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => setShowMap(!showMap)}
                                >
                                    {showMap ? '地図を閉じる' : '地図を開く'}
                                </button>
                            </div>

                            {isGeocodingLoading && (
                                <div className={styles.selectedLocation} style={{ background: 'var(--primary-50)', borderColor: 'var(--primary-300)' }}>
                                    <span style={{ color: 'var(--primary-600)' }}>⏳ 住所を取得中...</span>
                                </div>
                            )}

                            {!isGeocodingLoading && formData.lat && formData.lng && (
                                <div className={styles.selectedLocation}>
                                    <span>✅ 位置が選択されました</span>
                                    <span className={styles.addressDisplay}>
                                        {formData.location || '住所を取得中...'}
                                    </span>
                                </div>
                            )}

                            {showMap && (
                                <div className={styles.mapContainer}>
                                    <div className={styles.mapButtons}>
                                        <button
                                            type="button"
                                            className="btn btn-outline"
                                            onClick={handleGetCurrentLocation}
                                        >
                                            📍 現在地を使用
                                        </button>
                                    </div>
                                    <p className={styles.mapHint}>
                                        💡 地図上をクリックして発見場所を指定できます
                                    </p>
                                    <div className={styles.mapWrapper}>
                                        <MapComponent
                                            markers={formData.lat && formData.lng ? [{
                                                id: 'selected-location',
                                                type: 'sighting',
                                                name: '選択した位置',
                                                species: '',
                                                lat: formData.lat,
                                                lng: formData.lng,
                                                location: formData.location || '',
                                                date: new Date().toISOString(),
                                            }] : []}
                                            center={formData.lat && formData.lng
                                                ? [formData.lat, formData.lng]
                                                : [35.6812, 139.7671]
                                            }
                                            onMapClick={handleMapClick}
                                            isSelectingLocation={true}
                                        />
                                    </div>
                                    {formData.lat && formData.lng && (
                                        <div className={styles.markerPreview}>
                                            <p>選択した位置にマーカーが表示されます</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Photo Upload */}
                    <div className={styles.formSection}>
                        <h2>写真（任意）</h2>
                        <div className={styles.photoUpload}>
                            <div className={styles.uploadArea}>
                                <span className={styles.uploadIcon}>📷</span>
                                <p>クリックまたはドラッグ&ドロップで写真をアップロード</p>
                                <span className={styles.uploadHint}>JPEG, PNG (最大5MB)</span>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className={styles.formActions}>
                        <Link href="/service/sightings" className="btn btn-outline">
                            キャンセル
                        </Link>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? '投稿中...' : '投稿する'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
