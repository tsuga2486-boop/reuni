'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../login/page.module.css';
import { supabase } from '@/lib/supabase';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError('パスワードが一致しません');
            setIsLoading(false);
            return;
        }

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        name: formData.name,
                    },
                },
            });

            if (signUpError) {
                if (signUpError.message.includes('already registered')) {
                    setError('このメールアドレスは既に登録されています');
                } else {
                    setError(signUpError.message);
                }
                return;
            }

            if (data.user && !data.session) {
                // メール確認が必要な場合
                setSuccess('確認メールを送信しました。メールのリンクをクリックして登録を完了してください。');
            } else {
                // メール確認不要（Supabase設定による）→ ダッシュボードへ
                router.push('/dashboard');
            }
        } catch {
            setError('登録に失敗しました。もう一度お試しください。');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.authPage}>
            <div className={styles.authContainer}>
                <div className={styles.authCard}>
                    <div className={styles.authHeader}>
                        <Link href="/" className={styles.logo}>
                            <span>🐾</span>
                            <span>REUNI</span>
                        </Link>
                        <h1>新規登録</h1>
                        <p>アカウントを作成して、大切なペットを守りましょう</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.authForm}>
                        {error && (
                            <div className={styles.errorMessage}>
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className={styles.errorMessage} style={{ background: 'var(--success-50, #f0fdf4)', color: 'var(--success-600, #16a34a)', borderColor: 'var(--success-200, #bbf7d0)' }}>
                                {success}
                            </div>
                        )}

                        <div className={styles.formGroup}>
                            <label htmlFor="name">お名前</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="input"
                                placeholder="山田太郎"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">メールアドレス</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="input"
                                placeholder="example@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password">パスワード</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="input"
                                placeholder="8文字以上"
                                value={formData.password}
                                onChange={handleChange}
                                minLength={8}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword">パスワード（確認）</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="input"
                                placeholder="パスワードを再入力"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className={`btn btn-primary ${styles.submitBtn}`}
                            disabled={isLoading}
                        >
                            {isLoading ? '登録中...' : '無料で登録する'}
                        </button>
                    </form>

                    <div className={styles.authDivider}>
                        <span>または</span>
                    </div>

                    <div className={styles.socialLogin}>
                        <button
                            className={`btn btn-outline ${styles.socialBtn}`}
                            onClick={async () => {
                                const { error: oauthError } = await supabase.auth.signInWithOAuth({
                                    provider: 'google',
                                    options: {
                                        redirectTo: `${window.location.origin}/dashboard`,
                                    },
                                });
                                if (oauthError) {
                                    setError('Google認証に失敗しました。もう一度お試しください。');
                                }
                            }}
                        >
                            <span>G</span>
                            Googleで登録
                        </button>
                    </div>

                    <div className={styles.authFooter}>
                        <p>
                            すでにアカウントをお持ちですか？{' '}
                            <Link href="/auth/login">ログイン</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
