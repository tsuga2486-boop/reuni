'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';
import { supabase } from '@/lib/supabase';

export default function Header() {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        // 現在のセッションを取得
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
            setIsLoading(false);
        };
        getSession();

        // 認証状態の変更を監視
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        // スクロール検知
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            subscription.unsubscribe();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setIsMenuOpen(false);
        router.push('/');
    };

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
            <div className={`container ${styles.headerInner}`}>
                <Link href="/" className={styles.logo} onClick={closeMenu}>
                    <span className={styles.logoIcon}>🐾</span>
                    <span className={styles.logoText}>REUNI</span>
                </Link>

                <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
                    <Link href="/" className={styles.navLink} onClick={closeMenu}>ホーム</Link>
                    <Link href="/about" className={styles.navLink} onClick={closeMenu}>REUNIについて</Link>
                    <Link href="/service" className={styles.navLink} onClick={closeMenu}>サービス</Link>
                    <Link href="/company" className={styles.navLink} onClick={closeMenu}>会社概要</Link>
                    <Link href="/contact" className={styles.navLink} onClick={closeMenu}>お問い合わせ</Link>

                    {/* モバイルメニュー内の認証ボタン */}
                    <div className={styles.mobileAuth}>
                        {!isLoading && (
                            user ? (
                                <>
                                    <Link href="/dashboard" className="btn btn-outline" onClick={closeMenu} style={{ width: '100%' }}>
                                        マイページ
                                    </Link>
                                    <button onClick={handleLogout} className="btn btn-primary" style={{ width: '100%' }}>
                                        ログアウト
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/auth/login" className="btn btn-outline" onClick={closeMenu} style={{ width: '100%' }}>
                                        ログイン
                                    </Link>
                                    <Link href="/auth/register" className="btn btn-primary" onClick={closeMenu} style={{ width: '100%' }}>
                                        新規登録
                                    </Link>
                                </>
                            )
                        )}
                    </div>
                </nav>

                <div className={styles.headerActions}>
                    {isLoading ? (
                        <span style={{ color: 'var(--neutral-400)', fontSize: '0.875rem' }}>...</span>
                    ) : user ? (
                        <>
                            <Link href="/dashboard" className={`btn btn-outline ${styles.loginBtn}`}>
                                マイページ
                            </Link>
                            <button onClick={handleLogout} className="btn btn-primary">
                                ログアウト
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/login" className={`btn btn-outline ${styles.loginBtn}`}>
                                ログイン
                            </Link>
                            <Link href="/auth/register" className="btn btn-primary">
                                新規登録
                            </Link>
                        </>
                    )}
                </div>

                <button
                    className={styles.menuToggle}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="メニュー"
                >
                    <span className={`${styles.menuBar} ${isMenuOpen ? styles.menuBarOpen : ''}`}></span>
                </button>
            </div>
        </header>
    );
}
