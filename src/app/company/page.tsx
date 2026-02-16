import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
    title: '会社概要 - REUNI',
    description: 'REUNIの会社概要',
};

export default function CompanyPage() {
    return (
        <div className={styles.companyPage}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className="container">
                    <h1>会社概要</h1>
                    <p className={styles.heroSubtitle}>
                        ペットと飼い主の再会を支援するREUNIについて
                    </p>
                </div>
            </section>

            {/* Company Info */}
            <section className={styles.companyInfo}>
                <div className="container">
                    <div className={styles.infoCard}>
                        <h2>会社概要</h2>
                        <table className={styles.infoTable}>
                            <tbody>
                                <tr>
                                    <th>屋号</th>
                                    <td>REUNI</td>
                                </tr>
                                <tr>
                                    <th>創業</th>
                                    <td>2026年2月</td>
                                </tr>

                                <tr>
                                    <th>事業内容</th>
                                    <td>迷子ペット捜索支援プラットフォームの運営</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>


            {/* Contact CTA */}
            <section className={styles.contact}>
                <div className="container">
                    <div className={styles.contactCard}>
                        <h2>お問い合わせ</h2>
                        <p>
                            REUNIに関するご質問やご相談はお問い合わせページからどうぞ。
                        </p>
                        <Link href="/contact" className="btn btn-primary">
                            お問い合わせはこちら
                        </Link>
                        <div className={styles.legalLinks}>
                            <Link href="/privacy" className={styles.legalLink}>
                                📄 プライバシーポリシー
                            </Link>
                            <Link href="/terms" className={styles.legalLink}>
                                📋 利用規約
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
