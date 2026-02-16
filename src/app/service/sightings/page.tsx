'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { supabase, getSightings, createChatRoom, type Sighting } from '@/lib/supabase';

export default function SightingsPage() {
    const router = useRouter();
    const [sightings, setSightings] = useState<Sighting[]>([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState('all');
    const [speciesFilter, setSpeciesFilter] = useState('all');
    const [userId, setUserId] = useState<string | null>(null);
    const [contactingId, setContactingId] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setUserId(user.id);

            try {
                const data = await getSightings();
                setSightings(data);
            } catch (err) {
                console.error('目撃情報取得エラー:', err);
            } finally {
                setLoading(false);
            }
        };

        init();
    }, []);

    const filteredSightings = sightings.filter((sighting) => {
        const matchesType = typeFilter === 'all' || sighting.type === typeFilter;
        const matchesSpecies = speciesFilter === 'all' || sighting.species === speciesFilter;
        return matchesType && matchesSpecies;
    });

    const handleContact = async (sighting: Sighting) => {
        if (!userId) {
            router.push('/auth/login');
            return;
        }

        if (!sighting.reporter_id || !sighting.pet_id) {
            alert('この情報には連絡先がありません');
            return;
        }

        setContactingId(sighting.id);
        try {
            // 報告者（finder）がペットオーナーに連絡するチャットルームを作成
            const room = await createChatRoom(
                sighting.pet_id,
                sighting.reporter_id, // reporter_idをfinder_idとして使用（保護者）
                userId,               // 現在のユーザー（連絡する側）
                sighting.id
            );
            router.push(`/chat/${room.id}`);
        } catch (err) {
            console.error('チャットルーム作成エラー:', err);
            alert('連絡の開始に失敗しました。もう一度お試しください。');
        } finally {
            setContactingId(null);
        }
    };

    return (
        <div className={styles.sightingsPage}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className="container">
                    <Link href="/service" className={styles.backLink}>
                        ← サービスに戻る
                    </Link>
                    <h1>目撃・保護情報</h1>
                    <p className={styles.heroSubtitle}>
                        迷子ペットの目撃情報と保護情報を確認できます
                    </p>
                </div>
            </section>

            {/* Actions */}
            <section className={styles.actions}>
                <div className="container">
                    <div className={styles.actionsContent}>
                        <p>迷子のペットを見かけたり、保護しましたか？</p>
                        <Link href="/service/sightings/new" className="btn btn-primary">
                            📝 情報を投稿する
                        </Link>
                    </div>
                </div>
            </section>

            {/* Filters */}
            <section className={styles.filters}>
                <div className="container">
                    <div className={styles.filtersGrid}>
                        <div className={styles.filterGroup}>
                            <label>情報タイプ</label>
                            <div className={styles.filterButtons}>
                                <button
                                    className={`${styles.filterBtn} ${typeFilter === 'all' ? styles.active : ''}`}
                                    onClick={() => setTypeFilter('all')}
                                >
                                    すべて
                                </button>
                                <button
                                    className={`${styles.filterBtn} ${typeFilter === 'sighting' ? styles.active : ''}`}
                                    onClick={() => setTypeFilter('sighting')}
                                >
                                    👀 目撃
                                </button>
                                <button
                                    className={`${styles.filterBtn} ${typeFilter === 'protected' ? styles.active : ''}`}
                                    onClick={() => setTypeFilter('protected')}
                                >
                                    🏠 保護
                                </button>
                            </div>
                        </div>
                        <div className={styles.filterGroup}>
                            <label>種類</label>
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
                        <div className={styles.filterGroup}>
                            <Link href="/service/map" className="btn btn-secondary">
                                🗺️ マップで見る
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sightings List */}
            <section className={styles.sightingsList}>
                <div className="container">
                    {loading ? (
                        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--neutral-400)' }}>
                            読み込み中...
                        </p>
                    ) : (
                        <>
                            <p className={styles.resultCount}>
                                {filteredSightings.length}件の情報が見つかりました
                            </p>

                            {filteredSightings.length > 0 ? (
                                <div className={styles.sightingsGrid}>
                                    {filteredSightings.map((sighting) => (
                                        <div key={sighting.id} className={styles.sightingCard}>
                                            <div className={styles.sightingHeader}>
                                                <span className={`badge ${sighting.type === 'protected' ? 'badge-success' : 'badge-primary'
                                                    }`}>
                                                    {sighting.type === 'protected' ? '🏠 保護' : '👀 目撃'}
                                                </span>
                                                <span className={styles.sightingTime}>
                                                    {new Date(sighting.sighted_at).toLocaleString('ja-JP', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>

                                            <div className={styles.sightingImage}>
                                                <span className={styles.sightingEmoji}>
                                                    {sighting.species === '犬' ? '🐕' : '🐈'}
                                                </span>
                                            </div>

                                            <div className={styles.sightingContent}>
                                                <p className={styles.sightingDescription}>
                                                    {sighting.description}
                                                </p>
                                                <div className={styles.sightingMeta}>
                                                    <span>📍 {sighting.location}</span>
                                                </div>
                                            </div>

                                            <div className={styles.sightingActions}>
                                                {sighting.type === 'protected' && (
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() => handleContact(sighting)}
                                                        disabled={contactingId === sighting.id}
                                                    >
                                                        {contactingId === sighting.id ? '接続中...' : '💬 連絡する'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.emptyState}>
                                    <div className={styles.emptyIcon}>📭</div>
                                    <h3>該当する情報がありません</h3>
                                    <p>フィルター条件を変更してお試しください</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
