'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { supabase, createPet } from '@/lib/supabase';

export default function NewPetPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        species: '犬',
        breed: '',
        color: '',
        features: '',
        age: '',
        gender: 'unknown',
    });

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/auth/login');
                return;
            }
            setUserId(user.id);
        };
        checkAuth();
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;
        setIsLoading(true);
        setError('');

        try {
            await createPet({
                owner_id: userId,
                name: formData.name,
                species: formData.species as '犬' | '猫' | 'その他',
                breed: formData.breed,
                color: formData.color,
                features: formData.features || undefined,
                age: formData.age || undefined,
                gender: (formData.gender as 'male' | 'female' | 'unknown') || undefined,
                is_lost: false,
            });

            router.push('/dashboard');
        } catch (err: any) {
            console.error('登録エラー:', err);
            setError('ペットの登録に失敗しました。もう一度お試しください。');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.newPetPage}>
            <div className="container">
                <div className={styles.pageHeader}>
                    <Link href="/dashboard" className={styles.backLink}>
                        ← マイページに戻る
                    </Link>
                    <h1>ペットを登録</h1>
                    <p>大切なペットの情報を登録して、万が一に備えましょう</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && (
                        <div style={{ background: 'var(--danger-50, #fef2f2)', color: 'var(--danger-600, #dc2626)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                            {error}
                        </div>
                    )}

                    {/* Basic Info */}
                    <div className={styles.formSection}>
                        <h2>基本情報</h2>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name">名前 *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="input"
                                    placeholder="ポチ"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
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
                                <label htmlFor="breed">品種 *</label>
                                <input
                                    type="text"
                                    id="breed"
                                    name="breed"
                                    className="input"
                                    placeholder="柴犬、トイプードルなど"
                                    value={formData.breed}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="color">毛色 *</label>
                                <input
                                    type="text"
                                    id="color"
                                    name="color"
                                    className="input"
                                    placeholder="茶色、白黒など"
                                    value={formData.color}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="age">年齢</label>
                                <input
                                    type="text"
                                    id="age"
                                    name="age"
                                    className="input"
                                    placeholder="3歳、1歳半など"
                                    value={formData.age}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="gender">性別</label>
                                <select
                                    id="gender"
                                    name="gender"
                                    className="input"
                                    value={formData.gender}
                                    onChange={handleChange}
                                >
                                    <option value="unknown">不明</option>
                                    <option value="male">オス</option>
                                    <option value="female">メス</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className={styles.formSection}>
                        <h2>特徴</h2>
                        <div className={styles.formGroup}>
                            <label htmlFor="features">特徴・備考</label>
                            <textarea
                                id="features"
                                name="features"
                                className={`input ${styles.textarea}`}
                                placeholder="首輪の色、体の模様、性格など、見分けがつく特徴を記入してください"
                                value={formData.features}
                                onChange={handleChange}
                                rows={4}
                            />
                            <p className={styles.hint}>
                                迷子になった時に見つけやすくなる情報を詳しく記入してください
                            </p>
                        </div>
                    </div>

                    {/* Photo Upload */}
                    <div className={styles.formSection}>
                        <h2>写真</h2>
                        <div className={styles.photoUpload}>
                            <div className={styles.uploadArea}>
                                <span className={styles.uploadIcon}>📷</span>
                                <p>クリックまたはドラッグ&ドロップで写真をアップロード</p>
                                <span className={styles.uploadHint}>JPEG, PNG (最大5MB)</span>
                            </div>
                        </div>
                        <p className={styles.hint}>
                            正面からの写真があると見つかりやすくなります
                        </p>
                    </div>

                    {/* Submit */}
                    <div className={styles.formActions}>
                        <Link href="/dashboard" className="btn btn-outline">
                            キャンセル
                        </Link>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? '登録中...' : 'ペットを登録'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
