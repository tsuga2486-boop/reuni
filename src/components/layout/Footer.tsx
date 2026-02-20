import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerInner}`}>
                <div className={styles.footerTop}>
                    <div className={styles.footerBrand}>
                        <Link href="/" className={styles.logo}>
                            <span className={styles.logoIcon}>🐾</span>
                            <span className={styles.logoText}>REUNI</span>
                        </Link>
                        <p className={styles.brandTagline}>
                            大切な家族との再会を支援する
                        </p>
                    </div>

                    <div className={styles.footerLinks}>
                        <div className={styles.linkGroup}>
                            <h4 className={styles.linkGroupTitle}>サービス</h4>
                            <Link href="/service" className={styles.footerLink}>サービス概要</Link>
                            <Link href="/service/pets" className={styles.footerLink}>迷子ペット一覧</Link>
                            <Link href="/service/map" className={styles.footerLink}>マップで探す</Link>
                            <Link href="/service/sightings" className={styles.footerLink}>目撃・保護情報</Link>
                        </div>

                        <div className={styles.linkGroup}>
                            <h4 className={styles.linkGroupTitle}>REUNI（リユニ）について</h4>
                            <Link href="/about" className={styles.footerLink}>REUNI（リユニ）について</Link>
                            <Link href="/company" className={styles.footerLink}>会社概要</Link>
                        </div>

                        <div className={styles.linkGroup}>
                            <h4 className={styles.linkGroupTitle}>サポート</h4>
                            <Link href="/guide/lost-pet" className={styles.footerLink}>迷子ペットの探し方</Link>
                            <Link href="/faq" className={styles.footerLink}>よくある質問</Link>
                            <Link href="/contact" className={styles.footerLink}>お問い合わせ</Link>
                            <Link href="/privacy" className={styles.footerLink}>プライバシーポリシー</Link>
                            <Link href="/terms" className={styles.footerLink}>利用規約</Link>
                        </div>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <p className={styles.copyright}>
                        © 2026 REUNI. All rights reserved.
                    </p>
                    <div className={styles.socialLinks}>
                        <a href="#" className={styles.socialLink} aria-label="Twitter">
                            𝕏
                        </a>
                        <a href="#" className={styles.socialLink} aria-label="Instagram">
                            📷
                        </a>
                        <a href="#" className={styles.socialLink} aria-label="Facebook">
                            📘
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
