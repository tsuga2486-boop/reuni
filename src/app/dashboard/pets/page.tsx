'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { supabase, getPets, type Pet } from '@/lib/supabase';

export default function MyPetsPage() {
    const router = useRouter();
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/auth/login');
                return;
            }

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
            <div className={styles.myPetsPage}>
                <div className="container">
                    <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--neutral-400)' }}>
                        読み込み中...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.myPetsPage}>
            <div className="container">
                <div className={styles.pageHeader}>
                    <Link href="/dashboard" className={styles.backLink}>
                        ← マイページに戻る
                    </Link>
                    <div className={styles.headerContent}>
                        <h1>登録したペット</h1>
                        <Link href="/dashboard/pets/new" className="btn btn-primary">
                            ➕ ペットを登録
                        </Link>
                    </div>
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
            </div>
        </div>
    );
}
