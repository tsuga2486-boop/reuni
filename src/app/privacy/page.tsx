import styles from './page.module.css';

export const metadata = {
    title: 'プライバシーポリシー - REUNI',
    description: 'REUNIのプライバシーポリシー。個人情報の取り扱いについてご説明いたします。',
};

export default function PrivacyPage() {
    return (
        <div className={styles.legalPage}>
            <div className="container">
                <h1>プライバシーポリシー</h1>
                <p className={styles.lastUpdated}>最終更新日: 2026年2月1日</p>

                <div className={styles.content}>
                    <section className={styles.section}>
                        <h2>1. はじめに</h2>
                        <p>
                            REUNI（以下「当社」）は、お客様の個人情報の保護を重要な責務と考え、
                            個人情報の保護に関する法律（個人情報保護法）およびその他の関連法令を遵守し、
                            以下のプライバシーポリシーに従い個人情報を適切に取り扱います。
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>2. 収集する情報</h2>
                        <p>当社は、以下の情報を収集することがあります。</p>
                        <ul>
                            <li>氏名、メールアドレス等のアカウント情報</li>
                            <li>ペットの情報（名前、種類、特徴、写真等）</li>
                            <li>位置情報（目撃情報の投稿時など）</li>
                            <li>チャットでのメッセージ内容</li>
                            <li>サービスの利用状況に関する情報</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>3. 情報の利用目的</h2>
                        <p>収集した情報は、以下の目的で利用します。</p>
                        <ul>
                            <li>サービスの提供・運営</li>
                            <li>迷子ペットの捜索支援</li>
                            <li>ユーザー間のマッチングおよびコミュニケーション支援</li>
                            <li>サービスの改善・新機能の開発</li>
                            <li>お問い合わせへの対応</li>
                            <li>重要なお知らせの送付</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>4. 情報の共有</h2>
                        <p>
                            当社は、お客様の個人情報を第三者に販売、貸与することはありません。
                            ただし、以下の場合を除きます。
                        </p>
                        <ul>
                            <li>お客様の同意がある場合</li>
                            <li>法令に基づく場合</li>
                            <li>迷子ペットの捜索に必要な範囲で目撃情報を共有する場合</li>
                            <li>サービスの運営に必要な業務委託先に提供する場合</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>5. 情報の保護</h2>
                        <p>
                            当社は、お客様の個人情報を不正アクセス、紛失、破壊、改ざんおよび漏洩から
                            保護するため、適切なセキュリティ対策を講じます。
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>6. お客様の権利</h2>
                        <p>お客様は、以下の権利を有します。</p>
                        <ul>
                            <li>個人情報の開示、訂正、削除の請求</li>
                            <li>個人情報の利用停止の請求</li>
                            <li>アカウントの削除</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>7. Cookieの使用</h2>
                        <p>
                            当社のサービスでは、利便性の向上やアクセス解析のためにCookieを使用することがあります。
                            ブラウザの設定によりCookieを無効にすることができますが、
                            一部のサービスが正常に動作しなくなる場合があります。
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>8. ポリシーの変更</h2>
                        <p>
                            当社は、必要に応じて本プライバシーポリシーを変更することがあります。
                            重要な変更がある場合は、サービス上でお知らせいたします。
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>9. お問い合わせ</h2>
                        <p>
                            プライバシーポリシーに関するお問い合わせは、以下までご連絡ください。
                        </p>
                        <p className={styles.contactInfo}>
                            REUNI<br />
                            メール: privacy@reuni.jp
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
