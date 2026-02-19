'use client';

import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import styles from './page.module.css';
import { getLostPets, getSightings, Pet, Sighting } from '@/lib/supabase';

// Google Mapsはクライアントサイドのみで動作するため動的インポート
const MapComponent = dynamic(() => import('@/components/map/GoogleMapView'), {
    ssr: false,
    loading: () => (
        <div className={styles.mapLoading}>
            <div className={styles.loadingSpinner}></div>
            <p>地図を読み込み中...</p>
        </div>
    ),
});

// マーカーデータ型
interface MarkerData {
    id: string;
    type: 'lost' | 'sighting' | 'protected';
    name: string;
    species: string;
    color: string;
    size: string;
    lat: number;
    lng: number;
    location: string;
    date: string;
}

// 2点間の距離を計算（Haversine公式）
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // 地球の半径（km）
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}

// Pet型をMarkerData型に変換
function petToMarker(pet: Pet): MarkerData | null {
    if (!pet.last_seen_lat || !pet.last_seen_lng) return null;
    return {
        id: pet.id,
        type: 'lost',
        name: pet.name,
        species: pet.species,
        color: pet.color || '',
        size: '', // ペットテーブルにはサイズがないので空文字
        lat: pet.last_seen_lat,
        lng: pet.last_seen_lng,
        location: pet.last_seen_location || '',
        date: pet.lost_at || pet.created_at,
    };
}

// Sighting型をMarkerData型に変換
function sightingToMarker(sighting: Sighting): MarkerData | null {
    if (!sighting.lat || !sighting.lng) return null;
    return {
        id: sighting.id,
        type: sighting.type === 'protected' ? 'protected' : 'sighting',
        name: sighting.description.substring(0, 20) + (sighting.description.length > 20 ? '...' : ''),
        species: sighting.species,
        color: '', // sightingsテーブルには色がないので空文字
        size: '',
        lat: sighting.lat,
        lng: sighting.lng,
        location: sighting.location,
        date: sighting.sighted_at,
    };
}

export default function MapPage() {
    // マーカーデータ
    const [markers, setMarkers] = useState<MarkerData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 基本フィルター
    const [typeFilter, setTypeFilter] = useState('all');

    // 詳細フィルター
    const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
    const [speciesFilter, setSpeciesFilter] = useState('all');
    const [colorFilter, setColorFilter] = useState('');
    const [sizeFilter, setSizeFilter] = useState('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    // 位置・距離フィルター
    const [useLocationFilter, setUseLocationFilter] = useState(false);
    const [centerLat, setCenterLat] = useState('35.6812');
    const [centerLng, setCenterLng] = useState('139.7671');
    const [radius, setRadius] = useState('5');
    const [locationName, setLocationName] = useState('');

    const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);

    // マップの表示中心（現在地ボタン用）
    const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
    const [isLocating, setIsLocating] = useState(false);

    // データベースからデータを取得
    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                setError(null);

                // 迷子ペットと目撃・保護情報を並行して取得
                const [lostPets, sightings] = await Promise.all([
                    getLostPets(),
                    getSightings(),
                ]);

                // マーカーデータに変換
                const petMarkers = lostPets
                    .map(petToMarker)
                    .filter((m): m is MarkerData => m !== null);

                const sightingMarkers = sightings
                    .map(sightingToMarker)
                    .filter((m): m is MarkerData => m !== null);

                setMarkers([...petMarkers, ...sightingMarkers]);
            } catch (err) {
                console.error('データの取得に失敗しました:', err);
                setError('データの取得に失敗しました');
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

    // 初回ロード時に現在地を自動取得
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setMapCenter([lat, lng]);
                },
                () => {
                    // 取得失敗時はデフォルト（東京）のまま
                }
            );
        }
    }, []);

    // 現在地を取得（フィルター用 + マップ移動）
    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('このブラウザは位置情報をサポートしていません');
            return;
        }
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                setCenterLat(lat.toString());
                setCenterLng(lng.toString());
                setLocationName('📍 現在地');
                setMapCenter([lat, lng]);
                setIsLocating(false);
            },
            (error) => {
                console.error('位置情報の取得に失敗しました:', error);
                alert('位置情報の取得に失敗しました');
                setIsLocating(false);
            }
        );
    };

    // 地図クリックで位置を設定
    const handleMapClick = (lat: number, lng: number) => {
        if (useLocationFilter) {
            setCenterLat(lat.toString());
            setCenterLng(lng.toString());
            setLocationName(`📍 選択した地点`);
        }
    };

    // フィルタリング処理
    const filteredMarkers = useMemo(() => {
        return markers.filter((marker) => {
            // 種類フィルター
            if (typeFilter !== 'all' && marker.type !== typeFilter) return false;

            // 動物種類フィルター
            if (speciesFilter !== 'all' && marker.species !== speciesFilter) return false;

            // 毛色フィルター
            if (colorFilter && marker.color && !marker.color.includes(colorFilter)) return false;

            // 大きさフィルター
            if (sizeFilter !== 'all' && marker.size && marker.size !== sizeFilter) return false;

            // 日付フィルター
            if (dateFrom) {
                const markerDate = new Date(marker.date);
                const fromDate = new Date(dateFrom);
                if (markerDate < fromDate) return false;
            }
            if (dateTo) {
                const markerDate = new Date(marker.date);
                const toDate = new Date(dateTo);
                if (markerDate > toDate) return false;
            }

            // 位置・距離フィルター
            if (useLocationFilter && centerLat && centerLng && radius) {
                const distance = getDistanceFromLatLonInKm(
                    parseFloat(centerLat),
                    parseFloat(centerLng),
                    marker.lat,
                    marker.lng
                );
                if (distance > parseFloat(radius)) return false;
            }

            return true;
        });
    }, [markers, typeFilter, speciesFilter, colorFilter, sizeFilter, dateFrom, dateTo, useLocationFilter, centerLat, centerLng, radius]);

    // フィルターをリセット
    const resetFilters = () => {
        setTypeFilter('all');
        setSpeciesFilter('all');
        setColorFilter('');
        setSizeFilter('all');
        setDateFrom('');
        setDateTo('');
        setUseLocationFilter(false);
        setCenterLat('35.6812');
        setCenterLng('139.7671');
        setRadius('5');
        setLocationName('東京駅');
    };

    return (
        <div className={styles.mapPage}>
            {/* Header */}
            <div className={styles.mapHeader}>
                <div className="container">
                    <Link href="/service" className={styles.backLink}>
                        ← サービスに戻る
                    </Link>
                    <div className={styles.headerContent}>
                        <div className={styles.headerLeft}>
                            <h1>マップで探す</h1>
                            <p>迷子ペットと目撃情報を地図上で確認</p>
                        </div>
                        <div className={styles.headerActions}>
                            <button
                                className={`btn ${showAdvancedFilter ? 'btn-secondary' : 'btn-outline'}`}
                                onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
                            >
                                🔍 詳細絞り込み
                            </button>
                            <Link href="/service/sightings/new" className="btn btn-primary">
                                📝 情報を投稿
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Basic Filters */}
            <div className={styles.mapFilters}>
                <div className="container">
                    <div className={styles.filterTabs}>
                        <button
                            className={`${styles.filterTab} ${typeFilter === 'all' ? styles.active : ''}`}
                            onClick={() => setTypeFilter('all')}
                        >
                            すべて ({markers.length})
                        </button>
                        <button
                            className={`${styles.filterTab} ${typeFilter === 'lost' ? styles.active : ''}`}
                            onClick={() => setTypeFilter('lost')}
                        >
                            🐕 迷子ペット ({markers.filter(m => m.type === 'lost').length})
                        </button>
                        <button
                            className={`${styles.filterTab} ${typeFilter === 'sighting' ? styles.active : ''}`}
                            onClick={() => setTypeFilter('sighting')}
                        >
                            👀 目撃情報 ({markers.filter(m => m.type === 'sighting').length})
                        </button>
                        <button
                            className={`${styles.filterTab} ${typeFilter === 'protected' ? styles.active : ''}`}
                            onClick={() => setTypeFilter('protected')}
                        >
                            🏠 保護情報 ({markers.filter(m => m.type === 'protected').length})
                        </button>
                    </div>
                </div>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilter && (
                <div className={styles.advancedFilters}>
                    <div className="container">
                        <div className={styles.filterGrid}>
                            {/* 位置・距離フィルター */}
                            <div className={styles.filterSection}>
                                <h3>📍 位置・距離で絞り込み</h3>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={useLocationFilter}
                                        onChange={(e) => setUseLocationFilter(e.target.checked)}
                                    />
                                    位置・距離フィルターを有効にする
                                </label>
                                {useLocationFilter && (
                                    <div className={styles.locationFilterContent}>
                                        <div className={styles.locationInputs}>
                                            <div className={styles.formGroup}>
                                                <label>中心地点</label>
                                                <p className={styles.locationDisplay}>
                                                    {locationName || '地図をクリックして指定'}
                                                </p>
                                                <div className={styles.locationButtons}>
                                                    <button
                                                        className="btn btn-outline"
                                                        onClick={handleGetCurrentLocation}
                                                        type="button"
                                                    >
                                                        📍 現在地を使用
                                                    </button>
                                                </div>
                                                <p className={styles.hint}>
                                                    💡 地図上をクリックしても位置を指定できます
                                                </p>
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>半径 (km)</label>
                                                <div className={styles.radiusInput}>
                                                    <input
                                                        type="range"
                                                        min="1"
                                                        max="50"
                                                        value={radius}
                                                        onChange={(e) => setRadius(e.target.value)}
                                                    />
                                                    <span className={styles.radiusValue}>{radius} km</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 日時フィルター */}
                            <div className={styles.filterSection}>
                                <h3>📅 日時で絞り込み</h3>
                                <div className={styles.dateInputs}>
                                    <div className={styles.formGroup}>
                                        <label>開始日</label>
                                        <input
                                            type="date"
                                            className="input"
                                            value={dateFrom}
                                            onChange={(e) => setDateFrom(e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>終了日</label>
                                        <input
                                            type="date"
                                            className="input"
                                            value={dateTo}
                                            onChange={(e) => setDateTo(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 動物種類・特徴フィルター */}
                            <div className={styles.filterSection}>
                                <h3>🐾 動物の特徴で絞り込み</h3>
                                <div className={styles.characteristicInputs}>
                                    <div className={styles.formGroup}>
                                        <label>動物の種類</label>
                                        <select
                                            className="input"
                                            value={speciesFilter}
                                            onChange={(e) => setSpeciesFilter(e.target.value)}
                                        >
                                            <option value="all">すべて</option>
                                            <option value="犬">犬</option>
                                            <option value="猫">猫</option>
                                            <option value="その他">その他</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>毛の色</label>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="例: 茶色、白、黒"
                                            value={colorFilter}
                                            onChange={(e) => setColorFilter(e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>大きさ</label>
                                        <select
                                            className="input"
                                            value={sizeFilter}
                                            onChange={(e) => setSizeFilter(e.target.value)}
                                        >
                                            <option value="all">すべて</option>
                                            <option value="小型">小型</option>
                                            <option value="中型">中型</option>
                                            <option value="大型">大型</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.filterActions}>
                            <button className="btn btn-outline" onClick={resetFilters}>
                                🔄 リセット
                            </button>
                            <span className={styles.resultCount}>
                                {filteredMarkers.length} 件の情報が見つかりました
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Map Container */}
            <div className={styles.mapContainer}>
                {error ? (
                    <div className={styles.mapLoading}>
                        <p style={{ color: 'red' }}>{error}</p>
                        <button className="btn btn-primary" onClick={() => window.location.reload()}>
                            再読み込み
                        </button>
                    </div>
                ) : isLoading ? (
                    <div className={styles.mapLoading}>
                        <div className={styles.loadingSpinner}></div>
                        <p>データを読み込み中...</p>
                    </div>
                ) : (
                    <MapComponent
                        markers={filteredMarkers}
                        onMarkerClick={(marker) => setSelectedMarker(marker as MarkerData)}
                        center={
                            useLocationFilter
                                ? [parseFloat(centerLat), parseFloat(centerLng)]
                                : mapCenter || undefined
                        }
                        radiusKm={useLocationFilter ? parseFloat(radius) : undefined}
                        onMapClick={handleMapClick}
                        isSelectingLocation={useLocationFilter}
                    />
                )}

                {/* 現在地ボタン */}
                <button
                    className={styles.locateBtn}
                    onClick={handleGetCurrentLocation}
                    disabled={isLocating}
                    title="現在地に移動"
                >
                    {isLocating ? '⏳' : '📍'}
                </button>

                {/* Legend */}
                <div className={styles.mapLegend}>
                    <div className={styles.legendItem}>
                        <span className={`${styles.legendDot} ${styles.lost}`}></span>
                        <span>迷子</span>
                    </div>
                    <div className={styles.legendItem}>
                        <span className={`${styles.legendDot} ${styles.sighting}`}></span>
                        <span>目撃</span>
                    </div>
                    <div className={styles.legendItem}>
                        <span className={`${styles.legendDot} ${styles.protected}`}></span>
                        <span>保護</span>
                    </div>
                </div>

                {/* Selected Marker Info */}
                {selectedMarker && (
                    <div className={styles.markerInfo}>
                        <button
                            className={styles.closeBtn}
                            onClick={() => setSelectedMarker(null)}
                        >
                            ×
                        </button>
                        <div className={styles.markerHeader}>
                            <span className={`badge ${selectedMarker.type === 'lost' ? 'badge-warning' :
                                selectedMarker.type === 'protected' ? 'badge-success' : 'badge-primary'
                                }`}>
                                {selectedMarker.type === 'lost' ? '迷子' :
                                    selectedMarker.type === 'protected' ? '保護中' : '目撃'}
                            </span>
                            <h3>{selectedMarker.name}</h3>
                        </div>
                        <p className={styles.markerSpecies}>{selectedMarker.species}</p>
                        {selectedMarker.color && (
                            <p className={styles.markerDetails}>
                                毛色: {selectedMarker.color}
                            </p>
                        )}
                        <p className={styles.markerLocation}>📍 {selectedMarker.location}</p>
                        <p className={styles.markerDate}>
                            {new Date(selectedMarker.date).toLocaleDateString('ja-JP')}
                        </p>
                        <Link
                            href={selectedMarker.type === 'lost'
                                ? `/service/pets/${selectedMarker.id}`
                                : `/service/sightings/${selectedMarker.id}`
                            }
                            className="btn btn-primary"
                        >
                            詳細を見る
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
