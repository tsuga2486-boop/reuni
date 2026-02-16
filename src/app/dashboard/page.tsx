'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { supabase, getPets, type Pet } from '@/lib/supabase';

export default function DashboardPage() {
    const router = useRouter();
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/auth/login');
                return;
            }

            setUserEmail(user.email || '');
            setUserName(user.user_metadata?.name || user.email?.split('@')[0] || 'ユーザー');

            try {
                const userPets = await getPets(user.id);
                setPets(userPets);
            } catch (err) {
                console.error('ペット取得エラー:', err);
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [router]);

    if (loading) {
        return (
            <div className={styles.dashboardPage}>
                <div className="container">
                    <div className={styles.dashboardHeader}>
                        <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--neutral-400)' }}>
                            読み込み中...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.dashboardPage}>
            <div className="container">
                {/* Header */}
                <div className={styles.dashboardHeader}>
                    <Link href="/service" className={styles.backLink}>
                        ← サービスに戻る
                    </Link>
                    <div className={styles.userInfo}>
                        <div className={styles.avatar}>
                            {userName.charAt(0)}
                        </div>
                        <div>
                            <h1>こんにちは、{userName}さん</h1>
                            <p>{userEmail}</p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <section className={styles.quickActions}>
                    <h2>クイックアクション</h2>
                    <div className={styles.actionsGrid}>
                        <Link href="/dashboard/pets/new" className={styles.actionCard}>
                            <span className={styles.actionIcon}>➕</span>
                            <span className={styles.actionLabel}>ペットを登録</span>
                        </Link>
                        <Link href="/service/sightings/new" className={styles.actionCard}>
                            <span className={styles.actionIcon}>📝</span>
                            <span className={styles.actionLabel}>目撃情報を投稿</span>
                        </Link>
                        <Link href="/service/map" className={styles.actionCard}>
                            <span className={styles.actionIcon}>🗺️</span>
                            <span className={styles.actionLabel}>マップを見る</span>
                        </Link>
                        <Link href="/chat" className={styles.actionCard}>
                            <span className={styles.actionIcon}>💬</span>
                            <span className={styles.actionLabel}>チャット</span>
                        </Link>
                    </div>
                </section>

                {/* My Pets */}
                <section className={styles.myPets}>
                    <div className={styles.sectionHeader}>
                        <h2>登録したペット</h2>
                        <Link href="/dashboard/pets/new" className="btn btn-primary">
                            ➕ ペットを登録
                        </Link>
                    </div>

                    {pets.length > 0 ? (
                        <div className={styles.petsGrid}>
                            {pets.map((pet) => (
                                <Link href={`/dashboard/pets/${pet.id}`} key={pet.id} className={styles.petCard}>
                                    <div className={styles.petImage}>
                                        <span className={styles.petEmoji}>
                                            {pet.species === '犬' ? '🐕' : pet.species === '猫' ? '🐈' : '🐾'}
                                        </span>
                                        {pet.is_lost && (
                                            <span className={styles.lostBadge}>迷子中</span>
                                        )}
                                    </div>
                                    <div className={styles.petInfo}>
                                        <h3>{pet.name}</h3>
                                        <p>{pet.species} / {pet.breed}</p>
                                    </div>
                                    <div className={styles.petStatus}>
                                        <span className={`badge ${pet.is_lost ? 'badge-warning' : 'badge-success'}`}>
                                            {pet.is_lost ? '🔴 迷子ON' : '🟢 通常'}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>🐾</div>
                            <h3>まだペットが登録されていません</h3>
                            <p>大切なペットの情報を登録しましょう</p>
                            <Link href="/dashboard/pets/new" className="btn btn-primary">
                                ペットを登録する
                            </Link>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
