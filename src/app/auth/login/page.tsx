'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { supabase } from '@/lib/supabase';
import { isInAppBrowser, getMobileOS } from '@/lib/webview-detect';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isWebView, setIsWebView] = useState(false);
    const [mobileOS, setMobileOS] = useState<'ios' | 'android' | 'other'>('other');

    useEffect(() => {
        setIsWebView(isInAppBrowser());
        setMobileOS(getMobileOS());
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                if (signInError.message.includes('Invalid login credentials')) {
                    setError('メールアドレスまたはパスワードが正しくありません');
                } else if (signInError.message.includes('Email not confirmed')) {
                    setError('メールアドレスが確認されていません。確認メールのリンクをクリックしてください。');
                } else {
                    setError(signInError.message);
                }
                return;
            }

            router.push('/dashboard');
        } catch {
            setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        if (isWebView) {
            // WebViewの場合は外部ブラウザで開くよう案内
            return;
        }
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/dashboard`,
            },
        });
        if (error) {
            setError('Google認証に失敗しました。もう一度お試しください。');
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
                        <h1>ログイン</h1>
                        <p>アカウントにログインして、サービスをご利用ください</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.authForm}>
                        {error && (
                            <div className={styles.errorMessage}>
                                {error}
                            </div>
                        )}

                        <div className={styles.formGroup}>
                            <label htmlFor="email">メールアドレス</label>
                            <input
                                type="email"
                                id="email"
                                className="input"
                                placeholder="example@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password">パスワード</label>
                            <input
                                type="password"
                                id="password"
                                className="input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.formActions}>
                        </div>

                        <button
                            type="submit"
                            className={`btn btn-primary ${styles.submitBtn}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'ログイン中...' : 'ログイン'}
                        </button>
                    </form>

                    <div className={styles.authDivider}>
                        <span>または</span>
                    </div>

                    <div className={styles.socialLogin}>
                        {isWebView ? (
                            <div className={styles.webviewBanner}>
                                <div className={styles.webviewIcon}>🌐</div>
                                <p className={styles.webviewTitle}>
                                    Googleログインには外部ブラウザが必要です
                                </p>
                                <p className={styles.webviewDescription}>
                                    {mobileOS === 'ios'
                                        ? 'Safariでこのページを開いてください'
                                        : mobileOS === 'android'
                                            ? 'Chromeでこのページを開いてください'
                                            : 'ブラウザでこのページを開いてください'
                                    }
                                </p>
                                <button
                                    className={`btn btn-primary ${styles.openBrowserBtn}`}
                                    onClick={() => {
                                        // URLをコピーして案内
                                        navigator.clipboard?.writeText(window.location.href).then(() => {
                                            alert(
                                                mobileOS === 'ios'
                                                    ? 'URLをコピーしました！\n\nSafariを開いてアドレスバーに貼り付けてください。'
                                                    : 'URLをコピーしました！\n\nChromeを開いてアドレスバーに貼り付けてください。'
                                            );
                                        }).catch(() => {
                                            alert(
                                                `以下のURLをブラウザで開いてください:\n\n${window.location.href}`
                                            );
                                        });
                                    }}
                                >
                                    📋 URLをコピーして{mobileOS === 'ios' ? 'Safari' : mobileOS === 'android' ? 'Chrome' : 'ブラウザ'}で開く
                                </button>
                                <p className={styles.webviewHint}>
                                    💡 メールアドレスでのログインはこのままご利用いただけます
                                </p>
                            </div>
                        ) : (
                            <button
                                className={`btn btn-outline ${styles.socialBtn}`}
                                onClick={handleGoogleLogin}
                            >
                                <span>G</span>
                                Googleでログイン
                            </button>
                        )}
                    </div>

                    <div className={styles.authFooter}>
                        <p>
                            アカウントをお持ちでないですか？{' '}
                            <Link href="/auth/register">新規登録</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
