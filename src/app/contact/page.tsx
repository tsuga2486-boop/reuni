import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
    title: 'お問い合わせ - REUNI',
    description: 'REUNIに関するお問い合わせはこちらから。ご質問、メディア取材、提携のご相談などお気軽にどうぞ。',
};

export default function ContactPage() {
    return (
        <div className={styles.contactPage}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className="container">
                    <h1>お問い合わせ</h1>
                    <p className={styles.heroSubtitle}>
                        REUNIに関するご質問やご相談がございましたら、
                        <br />
                        お気軽にお問い合わせください。
                    </p>
                </div>
            </section>

            {/* Contact Methods */}
            <section className={styles.contactMethods}>
                <div className="container">
                    <div className={styles.methodsGrid}>
                        <div className={styles.methodCard}>
                            <div className={styles.methodIcon}>📧</div>
                            <h3>メールでのお問い合わせ</h3>
                            <p>一般的なご質問やご要望はメールでお送りください。</p>
                            <a href="mailto:contact@reuni.jp" className={styles.methodLink}>
                                contact@reuni.jp
                            </a>
                            <span className={styles.responseTime}>※ 2営業日以内にご返信いたします</span>
                        </div>

                        <div className={styles.methodCard}>
                            <div className={styles.methodIcon}>🏢</div>
                            <h3>メディア・取材</h3>
                            <p>メディア掲載や取材のご依頼はこちらへお願いいたします。</p>
                            <a href="mailto:press@reuni.jp" className={styles.methodLink}>
                                press@reuni.jp
                            </a>
                            <span className={styles.responseTime}>※ 1営業日以内にご返信いたします</span>
                        </div>

                        <div className={styles.methodCard}>
                            <div className={styles.methodIcon}>🤝</div>
                            <h3>提携・パートナーシップ</h3>
                            <p>自治体・動物保護団体・企業様との提携について。</p>
                            <a href="mailto:partner@reuni.jp" className={styles.methodLink}>
                                partner@reuni.jp
                            </a>
                            <span className={styles.responseTime}>※ 3営業日以内にご返信いたします</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className={styles.contactForm}>
                <div className="container">
                    <div className={styles.formCard}>
                        <h2>お問い合わせフォーム</h2>
                        <p className={styles.formDescription}>
                            以下のフォームに必要事項をご記入の上、送信してください。
                        </p>
                        <form className={styles.form}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="name">お名前 *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="input"
                                        placeholder="山田 太郎"
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="email">メールアドレス *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="input"
                                        placeholder="example@email.com"
                                        required
                                    />
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="category">お問い合わせ種別 *</label>
                                <select id="category" className="input" required>
                                    <option value="">選択してください</option>
                                    <option value="general">一般的なご質問</option>
                                    <option value="service">サービスに関するお問い合わせ</option>
                                    <option value="bug">不具合の報告</option>
                                    <option value="media">メディア・取材</option>
                                    <option value="partner">提携のご相談</option>
                                    <option value="other">その他</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="subject">件名 *</label>
                                <input
                                    type="text"
                                    id="subject"
                                    className="input"
                                    placeholder="お問い合わせの件名"
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="message">お問い合わせ内容 *</label>
                                <textarea
                                    id="message"
                                    className="input"
                                    placeholder="お問い合わせ内容をご記入ください"
                                    rows={6}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                送信する
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className={styles.faq}>
                <div className="container">
                    <h2 className="text-center">よくあるご質問</h2>
                    <div className={styles.faqList}>
                        <details className={styles.faqItem}>
                            <summary>REUNIは無料で使えますか？</summary>
                            <p>
                                はい、基本機能は無料でご利用いただけます。
                                ペットの登録、迷子情報の投稿・閲覧、チャットなど主要な機能はすべて無料です。
                            </p>
                        </details>
                        <details className={styles.faqItem}>
                            <summary>ペットが見つからない場合、どうすればいいですか？</summary>
                            <p>
                                REUNIでは地域の方々に目撃情報を共有していただく仕組みがあります。
                                迷子情報を登録し、SNSでの共有も活用してください。
                                また、最寄りの動物愛護センターや警察への届け出もお忘れなく。
                            </p>
                        </details>
                        <details className={styles.faqItem}>
                            <summary>個人情報は安全ですか？</summary>
                            <p>
                                REUNIではお客様の個人情報を厳重に管理しています。
                                チャットでのやり取りは当事者間のみで共有され、
                                第三者に公開されることはありません。
                            </p>
                        </details>
                        <details className={styles.faqItem}>
                            <summary>動物保護団体として連携できますか？</summary>
                            <p>
                                はい、動物保護団体や自治体との連携を歓迎しています。
                                partner@reuni.jp までお問い合わせください。
                            </p>
                        </details>
                    </div>
                    <div className={styles.faqMore}>
                        <Link href="/faq" className="btn btn-outline">
                            よくある質問をもっと見る →
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
