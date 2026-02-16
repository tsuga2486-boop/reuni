'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { supabase, getPet, updatePet, deletePet, type Pet } from '@/lib/supabase';

export default function PetDetailPage() {
    const params = useParams();
    const router = useRouter();
    const petId = params.id as string;
    const [pet, setPet] = useState<Pet | null>(null);
    const [loading, setLoading] = useState(true);
    const [isChangingStatus, setIsChangingStatus] = useState(false);
    const [showLostModal, setShowLostModal] = useState(false);
    const [lostLocation, setLostLocation] = useState('');

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/auth/login');
                return;
            }

            try {
                const petData = await getPet(petId);
                if (petData.owner_id !== user.id) {
                    router.push('/dashboard');
                    return;
                }
                setPet(petData);
            } catch (err) {
                console.error('ペット取得エラー:', err);
                router.push('/dashboard');
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [petId, router]);

    const toggleLostStatus = async () => {
        if (!pet) return;

        if (!pet.is_lost) {
            setShowLostModal(true);
            return;
        }

        const confirmed = confirm(
            '迷子をOFFにしますか？\n\n' +
            '※ 関連するすべてのチャットが自動的に終了されます。\n' +
            '※ この操作は取り消せません。'
        );

        if (!confirmed) return;

        setIsChangingStatus(true);
        try {
            const updated = await updatePet(pet.id, {
                is_lost: false,
                lost_at: undefined,
                last_seen_location: undefined,
            });

            // 関連チャットルームを終了
            await supabase
                .from('chat_rooms')
                .update({ status: 'closed' })
                .eq('pet_id', pet.id)
                .eq('status', 'active');

            setPet(updated);
            alert('おめでとうございます！🎉\nペットが見つかったことを記録しました。\n関連するチャットはすべて終了されました。');
        } catch (err) {
            console.error('更新エラー:', err);
            alert('更新に失敗しました。');
        } finally {
            setIsChangingStatus(false);
        }
    };

    const handleLostSubmit = async () => {
        if (!pet || !lostLocation.trim()) return;

        setIsChangingStatus(true);
        try {
            const updated = await updatePet(pet.id, {
                is_lost: true,
                lost_at: new Date().toISOString(),
                last_seen_location: lostLocation,
            });
            setPet(updated);
            setShowLostModal(false);
            setLostLocation('');
        } catch (err) {
            console.error('更新エラー:', err);
            alert('迷子登録に失敗しました。');
        } finally {
            setIsChangingStatus(false);
        }
    };

    const handleDelete = async () => {
        if (!pet) return;
        if (!confirm('本当にこのペットを削除しますか？')) return;

        try {
            await deletePet(pet.id);
            router.push('/dashboard');
        } catch (error) {
            console.error('削除エラー:', error);
            alert('削除に失敗しました。');
        }
    };

    if (loading || !pet) {
        return (
            <div className={styles.petDetailPage}>
                <div className="container">
                    <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--neutral-400)' }}>
                        読み込み中...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.petDetailPage}>
            <div className="container">
                <div className={styles.pageHeader}>
                    <Link href="/dashboard" className={styles.backLink}>
                        ← マイページに戻る
                    </Link>
                </div>

                <div className={styles.petProfile}>
                    {/* Pet Image */}
                    <div className={styles.petImageSection}>
                        <div className={styles.petImage}>
                            <span className={styles.petEmoji}>
                                {pet.species === '犬' ? '🐕' : pet.species === '猫' ? '🐈' : '🐾'}
                            </span>
                            {pet.is_lost && (
                                <span className={styles.lostBadge}>迷子中</span>
                            )}
                        </div>
                    </div>

                    {/* Pet Info */}
                    <div className={styles.petInfoSection}>
                        <div className={styles.petHeader}>
                            <h1>{pet.name}</h1>
                            <span className={`badge ${pet.is_lost ? 'badge-warning' : 'badge-success'}`}>
                                {pet.is_lost ? '🔴 迷子中' : '🟢 通常'}
                            </span>
                        </div>

                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>種類</span>
                                <span className={styles.infoValue}>{pet.species}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>品種</span>
                                <span className={styles.infoValue}>{pet.breed}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>毛色</span>
                                <span className={styles.infoValue}>{pet.color}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>年齢</span>
                                <span className={styles.infoValue}>{pet.age || '不明'}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>性別</span>
                                <span className={styles.infoValue}>
                                    {pet.gender === 'male' ? 'オス' : pet.gender === 'female' ? 'メス' : '不明'}
                                </span>
                            </div>
                        </div>

                        <div className={styles.features}>
                            <span className={styles.infoLabel}>特徴・備考</span>
                            <p>{pet.features || '未登録'}</p>
                        </div>

                        {pet.is_lost && pet.lost_at && (
                            <div className={styles.lostInfo}>
                                <h3>迷子情報</h3>
                                <div className={styles.lostDetails}>
                                    <div className={styles.lostItem}>
                                        <span className={styles.lostLabel}>📅 迷子発生日</span>
                                        <span>{new Date(pet.lost_at).toLocaleDateString('ja-JP')}</span>
                                    </div>
                                    <div className={styles.lostItem}>
                                        <span className={styles.lostLabel}>📍 最後の目撃場所</span>
                                        <span>{pet.last_seen_location}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    <h2>アクション</h2>
                    <div className={styles.actionButtons}>
                        <button
                            className={`btn ${pet.is_lost ? 'btn-secondary' : 'btn-primary'} ${styles.lostToggle}`}
                            onClick={toggleLostStatus}
                            disabled={isChangingStatus}
                        >
                            {isChangingStatus ? '処理中...' : pet.is_lost ? '🟢 迷子をOFFにする' : '🔴 迷子をONにする'}
                        </button>
                        <button className={`btn btn-outline ${styles.deleteBtn}`} onClick={handleDelete}>
                            🗑️ 削除する
                        </button>
                    </div>
                </div>

                {pet.is_lost && (
                    <div className={styles.relatedInfo}>
                        <h2>関連する目撃情報</h2>
                        <div className={styles.emptyRelated}>
                            <p>まだ目撃情報はありません</p>
                            <Link href="/service/map" className="btn btn-secondary">
                                🗺️ マップで確認する
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Lost Modal */}
            {showLostModal && (
                <div className={styles.modalOverlay} onClick={() => setShowLostModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <h3>迷子情報を登録</h3>
                        <p>最後に見かけた場所を入力してください</p>
                        <div className={styles.modalForm}>
                            <input
                                type="text"
                                className="input"
                                placeholder="例: 東京都渋谷区代々木公園付近"
                                value={lostLocation}
                                onChange={(e) => setLostLocation(e.target.value)}
                            />
                            <div className={styles.modalActions}>
                                <button
                                    className="btn btn-outline"
                                    onClick={() => setShowLostModal(false)}
                                >
                                    キャンセル
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleLostSubmit}
                                    disabled={!lostLocation.trim() || isChangingStatus}
                                >
                                    {isChangingStatus ? '処理中...' : '迷子として登録'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
