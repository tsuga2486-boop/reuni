'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { supabase, getChatRooms, getLatestMessage } from '@/lib/supabase';

interface ChatRoomDisplay {
    id: string;
    petName: string;
    petSpecies: string;
    otherUserName: string;
    lastMessage: string;
    lastMessageAt: string;
    status: string;
}

export default function ChatListPage() {
    const router = useRouter();
    const [chatRooms, setChatRooms] = useState<ChatRoomDisplay[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            // ログインユーザーの確認
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }
            setUserId(user.id);

            try {
                const rooms = await getChatRooms(user.id);

                // 各ルームの最新メッセージを取得
                const roomsWithMessages: ChatRoomDisplay[] = await Promise.all(
                    rooms.map(async (room: any) => {
                        const latestMsg = await getLatestMessage(room.id);
                        const isOwner = room.owner_id === user.id;
                        const otherUser = isOwner ? room.finder : room.owner;

                        return {
                            id: room.id,
                            petName: room.pet?.name || '不明',
                            petSpecies: room.pet?.species || 'その他',
                            otherUserName: otherUser?.name || '不明',
                            lastMessage: latestMsg?.content || 'メッセージはまだありません',
                            lastMessageAt: latestMsg?.created_at || room.created_at,
                            status: room.status,
                        };
                    })
                );

                setChatRooms(roomsWithMessages);
            } catch (err) {
                console.error('チャットルーム取得エラー:', err);
            } finally {
                setLoading(false);
            }
        };

        init();
    }, []);

    if (loading) {
        return (
            <div className={styles.chatListPage}>
                <div className="container">
                    <div className={styles.pageHeader}>
                        <h1>チャット</h1>
                        <p>読み込み中...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!userId) {
        return (
            <div className={styles.chatListPage}>
                <div className="container">
                    <div className={styles.pageHeader}>
                        <h1>チャット</h1>
                        <p>保護者・発見者との連絡</p>
                    </div>
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>🔒</div>
                        <h3>ログインが必要です</h3>
                        <p>チャット機能を利用するにはログインしてください</p>
                        <Link href="/auth/login" className="btn btn-primary">
                            ログインする
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.chatListPage}>
            <div className="container">
                <div className={styles.pageHeader}>
                    <h1>チャット</h1>
                    <p>保護者・発見者との連絡</p>
                </div>

                {chatRooms.length > 0 ? (
                    <div className={styles.chatList}>
                        {chatRooms.map((room) => (
                            <Link
                                href={`/chat/${room.id}`}
                                key={room.id}
                                className={`${styles.chatRoom} ${room.status === 'closed' ? styles.chatRoomClosed : ''}`}
                            >
                                <div className={styles.roomAvatar}>
                                    <span>{room.petSpecies === '犬' ? '🐕' : room.petSpecies === '猫' ? '🐈' : '🐾'}</span>
                                    {room.status === 'closed' && (
                                        <span className={styles.closedBadge}>終了</span>
                                    )}
                                </div>
                                <div className={styles.roomInfo}>
                                    <div className={styles.roomHeader}>
                                        <h3>{room.otherUserName}</h3>
                                        <span className={styles.roomTime}>
                                            {new Date(room.lastMessageAt).toLocaleDateString('ja-JP', {
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                    <p className={styles.roomPet}>{room.petName}について</p>
                                    <p className={styles.roomLastMessage}>{room.lastMessage}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>💬</div>
                        <h3>チャットはありません</h3>
                        <p>目撃・保護情報から連絡を開始できます</p>
                        <Link href="/service/sightings" className="btn btn-primary">
                            目撃・保護情報を見る
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
