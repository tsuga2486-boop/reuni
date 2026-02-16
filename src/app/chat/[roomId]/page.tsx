'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import {
    supabase,
    getChatRoom,
    getMessages,
    sendMessage,
    subscribeToMessages,
    type Message,
} from '@/lib/supabase';

interface RoomInfo {
    id: string;
    petId: string;
    petName: string;
    petSpecies: string;
    otherUserName: string;
    status: string;
}

export default function ChatRoomPage() {
    const params = useParams();
    const roomId = params.roomId as string;

    const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // 初期データ取得
    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setError('ログインが必要です');
                setLoading(false);
                return;
            }
            setUserId(user.id);

            try {
                // チャットルーム情報を取得
                const room = await getChatRoom(roomId);
                if (!room) {
                    setError('チャットルームが見つかりません');
                    setLoading(false);
                    return;
                }

                // 参加者チェック
                if (room.owner_id !== user.id && room.finder_id !== user.id) {
                    setError('このチャットルームへのアクセス権限がありません');
                    setLoading(false);
                    return;
                }

                const isOwner = room.owner_id === user.id;
                const otherUser = isOwner ? room.finder : room.owner;

                setRoomInfo({
                    id: room.id,
                    petId: room.pet?.id || '',
                    petName: room.pet?.name || '不明',
                    petSpecies: room.pet?.species || 'その他',
                    otherUserName: (otherUser as any)?.name || '不明',
                    status: room.status,
                });

                // メッセージ取得
                const msgs = await getMessages(roomId);
                setMessages(msgs);
            } catch (err) {
                console.error('チャットルーム読み込みエラー:', err);
                setError('チャットルームの読み込みに失敗しました');
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [roomId]);

    // リアルタイム購読
    useEffect(() => {
        if (!roomId || !userId) return;

        const channel = subscribeToMessages(roomId, (newMsg) => {
            // 自分が送信したメッセージは既にstateに追加済みなのでスキップ
            if (newMsg.sender_id === userId) return;
            setMessages((prev) => [...prev, newMsg]);
        });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [roomId, userId]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || isSending || !userId) return;

        const content = newMessage.trim();
        setIsSending(true);
        setNewMessage('');

        // 楽観的にUIに追加
        const optimisticMessage: Message = {
            id: `temp-${Date.now()}`,
            room_id: roomId,
            sender_id: userId,
            content,
            created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, optimisticMessage]);

        try {
            const savedMsg = await sendMessage(roomId, userId, content);
            // 楽観的メッセージを実際のメッセージに置き換え
            setMessages((prev) =>
                prev.map((m) => (m.id === optimisticMessage.id ? savedMsg : m))
            );
        } catch (err) {
            console.error('メッセージ送信エラー:', err);
            // 送信失敗 → 楽観的メッセージを削除
            setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
            setNewMessage(content); // 入力欄に戻す
            alert('メッセージの送信に失敗しました。もう一度お試しください。');
        } finally {
            setIsSending(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.chatRoomPage}>
                <div className={styles.chatHeader}>
                    <div className="container">
                        <div className={styles.headerContent}>
                            <Link href="/chat" className={styles.backBtn}>←</Link>
                            <div className={styles.headerInfo}>
                                <h1>読み込み中...</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.messagesContainer}>
                    <div className={`container ${styles.messagesList}`}>
                        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--neutral-400)' }}>
                            チャットを読み込んでいます...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !roomInfo) {
        return (
            <div className={styles.chatRoomPage}>
                <div className={styles.chatHeader}>
                    <div className="container">
                        <div className={styles.headerContent}>
                            <Link href="/chat" className={styles.backBtn}>←</Link>
                            <div className={styles.headerInfo}>
                                <h1>エラー</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.messagesContainer}>
                    <div className={`container ${styles.messagesList}`}>
                        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--danger-500)' }}>
                            {error || 'チャットルームが見つかりません'}
                        </p>
                        <div style={{ textAlign: 'center' }}>
                            <Link href="/chat" className="btn btn-primary">チャット一覧に戻る</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const isClosed = roomInfo.status === 'closed';

    return (
        <div className={styles.chatRoomPage}>
            {/* Header */}
            <div className={styles.chatHeader}>
                <div className="container">
                    <div className={styles.headerContent}>
                        <Link href="/chat" className={styles.backBtn}>
                            ←
                        </Link>
                        <div className={styles.headerInfo}>
                            <h1>{roomInfo.otherUserName}</h1>
                            <p>
                                {roomInfo.petName}について
                                {isClosed && <span style={{ color: 'var(--neutral-400)', marginLeft: '0.5rem' }}>（終了済み）</span>}
                            </p>
                        </div>
                        <div className={styles.headerActions}>
                            {roomInfo.petId && (
                                <Link href={`/dashboard/pets/${roomInfo.petId}`} className={styles.petLink}>
                                    {roomInfo.petSpecies === '犬' ? '🐕' : roomInfo.petSpecies === '猫' ? '🐈' : '🐾'}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className={styles.messagesContainer}>
                <div className={`container ${styles.messagesList}`}>
                    {messages.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--neutral-400)' }}>
                            メッセージはまだありません。最初のメッセージを送信しましょう！
                        </p>
                    ) : (
                        messages.map((message) => (
                            <div
                                key={message.id}
                                className={`${styles.message} ${message.sender_id === userId ? styles.sent : styles.received}`}
                            >
                                <div className={styles.messageBubble}>
                                    <p>{message.content}</p>
                                    <span className={styles.messageTime}>
                                        {new Date(message.created_at).toLocaleTimeString('ja-JP', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <div className={styles.inputContainer}>
                <div className="container">
                    {isClosed ? (
                        <p style={{ textAlign: 'center', padding: '0.75rem', color: 'var(--neutral-400)', fontSize: '0.9rem' }}>
                            このチャットは終了しました
                        </p>
                    ) : (
                        <form onSubmit={handleSendMessage} className={styles.inputForm}>
                            <input
                                type="text"
                                className="input"
                                placeholder="メッセージを入力..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={!newMessage.trim() || isSending}
                            >
                                送信
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
