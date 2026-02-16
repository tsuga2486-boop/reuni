'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { getLostPets, type Pet } from '@/lib/supabase';

export default function LostPetsPage() {
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [speciesFilter, setSpeciesFilter] = useState('all');
    const [areaFilter, setAreaFilter] = useState('');

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const data = await getLostPets();
                setPets(data);
            } catch (err) {
                console.error('迷子ペット取得エラー:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPets();
    }, []);

    const filteredPets = pets.filter((pet) => {
        const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (pet.features || '').toLowerCase().includes(searchQuery.toLowerCase());

        const matchesSpecies = speciesFilter === 'all' || pet.species === speciesFilter;

        const matchesArea = !areaFilter ||
            (pet.last_seen_location || '').toLowerCase().includes(areaFilter.toLowerCase());

        return matchesSearch && matchesSpecies && matchesArea;
    });

    return (
        <div className={styles.petsPage}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className="container">
                    <Link href="/service" className={styles.backLink}>
                        ← サービスに戻る
                    </Link>
                    <h1>迷子ペット一覧</h1>
                    <p className={styles.heroSubtitle}>
                        現在迷子になっているペットの情報です。
                        見かけた方はぜひ情報をお寄せください。
                    </p>
                </div>
            </section>

            {/* Filters */}
            <section className={styles.filters}>
                <div className="container">
                    <div className={styles.filtersGrid}>
                        <div className={styles.filterGroup}>
                            <label htmlFor="search">キーワード検索</label>
                            <input
                                type="text"
                                id="search"
                                className="input"
                                placeholder="名前、品種、特徴など..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className={styles.filterGroup}>
                            <label htmlFor="species">種類</label>
                            <select
                                id="species"
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
                            <label htmlFor="area">エリア</label>
                            <input
                                type="text"
                                id="area"
                                className="input"
                                placeholder="渋谷区、新宿など..."
                                value={areaFilter}
                                onChange={(e) => setAreaFilter(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={styles.filterActions}>
                        <Link href="/service/map" className="btn btn-secondary">
                            🗺️ マップで見る
                        </Link>
                    </div>
                </div>
            </section>

            {/* Pet List */}
            <section className={styles.petList}>
                <div className="container">
                    {loading ? (
                        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--neutral-400)' }}>
                            読み込み中...
                        </p>
                    ) : (
                        <>
                            <p className={styles.resultCount}>
                                {filteredPets.length}件の迷子ペットが見つかりました
                            </p>

                            {filteredPets.length > 0 ? (
                                <div className={styles.petsGrid}>
                                    {filteredPets.map((pet) => (
                                        <div key={pet.id} className={styles.petCard}>
                                            <div className={styles.petImage}>
                                                <span className={styles.petEmoji}>
                                                    {pet.species === '犬' ? '🐕' : pet.species === '猫' ? '🐈' : '🐾'}
                                                </span>
                                            </div>
                                            <div className={styles.petInfo}>
                                                <div className={styles.petHeader}>
                                                    <h3>{pet.name}</h3>
                                                    <span className={`badge badge-warning`}>迷子中</span>
                                                </div>
                                                <p className={styles.petBreed}>{pet.species} / {pet.breed}</p>
                                                <p className={styles.petFeatures}>{pet.features || ''}</p>
                                                <div className={styles.petMeta}>
                                                    <span className={styles.petLocation}>📍 {pet.last_seen_location || '不明'}</span>
                                                    {pet.lost_at && (
                                                        <span className={styles.petDate}>
                                                            迷子発生: {new Date(pet.lost_at).toLocaleDateString('ja-JP')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.emptyState}>
                                    <div className={styles.emptyIcon}>🔍</div>
                                    <h3>該当するペットが見つかりませんでした</h3>
                                    <p>検索条件を変更してお試しください</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Report CTA */}
            <section className={styles.reportCta}>
                <div className="container">
                    <div className={styles.reportCard}>
                        <div className={styles.reportContent}>
                            <h2>迷子のペットを見かけましたか？</h2>
                            <p>目撃情報を投稿して、飼い主との再会をサポートしましょう</p>
                        </div>
                        <Link href="/service/sightings/new" className="btn btn-primary">
                            目撃情報を投稿する
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
