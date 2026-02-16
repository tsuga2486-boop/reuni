import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
    title: 'よくある質問 - REUNI',
    description: 'REUNIに関するよくあるご質問と回答をまとめました。',
};

export default function FaqPage() {
    return (
        <div className={styles.faqPage}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className="container">
                    <h1>よくある質問</h1>
                    <p className={styles.heroSubtitle}>
                        REUNIに関するよくあるご質問と回答をまとめました
                    </p>
                </div>
            </section>

            <div className="container">
                {/* サービスについて */}
                <section className={styles.faqSection}>
                    <h2>🐾 サービスについて</h2>
                    <div className={styles.faqList}>
                        <details className={styles.faqItem}>
                            <summary>REUNIとは何ですか？</summary>
                            <p>
                                REUNIは、迷子になったペットと飼い主の再会を支援するプラットフォームです。
                                地図ベースの目撃情報共有やチャット機能を通じて、
                                地域全体でペットの捜索をサポートします。
                            </p>
                        </details>
                        <details className={styles.faqItem}>
                            <summary>REUNIは無料で使えますか？</summary>
                            <p>
                                はい、基本機能はすべて無料でご利用いただけます。
                                ペットの登録、迷子情報の投稿・閲覧、目撃情報の共有、チャット機能など
                                主要な機能はすべて無料です。
                            </p>
                        </details>
                        <details className={styles.faqItem}>
                            <summary>対応しているペットの種類は？</summary>
                            <p>
                                現在、犬・猫・鳥・その他の小動物に対応しています。
                                今後、対応する動物の種類を拡大していく予定です。
                            </p>
                        </details>
                    </div>
                </section>

                {/* ペットの登録 */}
                <section className={styles.faqSection}>
                    <h2>📋 ペットの登録</h2>
                    <div className={styles.faqList}>
                        <details className={styles.faqItem}>
                            <summary>ペットを登録するにはどうすればいいですか？</summary>
                            <p>
                                まずアカウントを作成し、マイページから「ペットを登録する」ボタンをクリックしてください。
                                ペットの名前、種類、特徴、写真などを入力して登録できます。
                            </p>
                        </details>
                        <details className={styles.faqItem}>
                            <summary>複数のペットを登録できますか？</summary>
                            <p>
                                はい、登録数に制限はありません。お持ちのペットをすべて登録していただけます。
                            </p>
                        </details>
                        <details className={styles.faqItem}>
                            <summary>ペットの情報は後から編集できますか？</summary>
                            <p>
                                はい、マイページからいつでもペットの情報を編集できます。
                                写真の追加や特徴の更新も可能です。
                            </p>
                        </details>
                    </div>
                </section>

                {/* 迷子の捜索 */}
                <section className={styles.faqSection}>
                    <h2>🔍 迷子の捜索</h2>
                    <div className={styles.faqList}>
                        <details className={styles.faqItem}>
                            <summary>ペットが迷子になったらどうすればいいですか？</summary>
                            <p>
                                マイページからペットの「迷子をONにする」ボタンを押してください。
                                最後に見かけた場所を入力すると、マップ上に表示されます。
                                同時に、最寄りの動物愛護センターや警察への届け出もお忘れなく。
                            </p>
                        </details>
                        <details className={styles.faqItem}>
                            <summary>目撃情報はどうやって投稿しますか？</summary>
                            <p>
                                「目撃・保護情報」ページから「情報を投稿する」ボタンをクリックし、
                                発見場所、日時、ペットの特徴などを入力してください。
                                地図上で場所を指定することもできます。
                            </p>
                        </details>
                        <details className={styles.faqItem}>
                            <summary>迷子のペットが見つかったらどうすればいいですか？</summary>
                            <p>
                                マイページからペットの「迷子をOFFにする」ボタンを押してください。
                                関連するチャットは自動的に終了されます。
                            </p>
                        </details>
                    </div>
                </section>

                {/* アカウント */}
                <section className={styles.faqSection}>
                    <h2>👤 アカウント</h2>
                    <div className={styles.faqList}>
                        <details className={styles.faqItem}>
                            <summary>アカウントを削除するにはどうすればいいですか？</summary>
                            <p>
                                マイページの設定からアカウントの削除が可能です。
                                削除すると、登録情報やペットの情報はすべて削除されます。
                                ただし、投稿済みの目撃情報は他のユーザーへの影響を考慮し、
                                一定期間保持される場合があります。
                            </p>
                        </details>
                        <details className={styles.faqItem}>
                            <summary>パスワードを忘れた場合は？</summary>
                            <p>
                                ログインページの「パスワードを忘れた方」リンクから
                                パスワードリセットの手続きを行ってください。
                                登録メールアドレスにリセット用のリンクが送信されます。
                            </p>
                        </details>
                    </div>
                </section>

                {/* セキュリティ */}
                <section className={styles.faqSection}>
                    <h2>🔒 セキュリティ・プライバシー</h2>
                    <div className={styles.faqList}>
                        <details className={styles.faqItem}>
                            <summary>個人情報は安全ですか？</summary>
                            <p>
                                REUNIではお客様の個人情報を厳重に管理しています。
                                チャットでのやり取りは当事者間のみで共有され、
                                第三者に公開されることはありません。
                                詳しくは<Link href="/privacy">プライバシーポリシー</Link>をご確認ください。
                            </p>
                        </details>
                        <details className={styles.faqItem}>
                            <summary>位置情報の取り扱いについて教えてください</summary>
                            <p>
                                目撃情報の投稿時に位置情報を使用しますが、
                                これはペットの捜索に必要な範囲でのみ利用されます。
                                ユーザーの現在地が常時追跡されることはありません。
                            </p>
                        </details>
                    </div>
                </section>

                {/* CTA */}
                <section className={styles.ctaSection}>
                    <div className={styles.ctaCard}>
                        <h3>お探しの回答が見つかりませんか？</h3>
                        <p>お気軽にお問い合わせください。</p>
                        <Link href="/contact" className="btn btn-primary">
                            お問い合わせはこちら
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
