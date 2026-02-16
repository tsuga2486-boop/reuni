import styles from './page.module.css';

export const metadata = {
    title: '利用規約 - REUNI',
    description: 'REUNIの利用規約。サービスのご利用にあたっての条件をご確認ください。',
};

export default function TermsPage() {
    return (
        <div className={styles.legalPage}>
            <div className="container">
                <h1>利用規約</h1>
                <p className={styles.lastUpdated}>最終更新日: 2026年2月1日</p>

                <div className={styles.content}>
                    <section className={styles.section}>
                        <h2>第1条（適用）</h2>
                        <p>
                            本規約は、REUNI（以下「当社」）が提供するサービス「REUNI」
                            （以下「本サービス」）の利用に関する条件を定めるものです。
                            ユーザーは、本規約に同意の上、本サービスを利用するものとします。
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>第2条（ユーザー登録）</h2>
                        <ul>
                            <li>本サービスの利用にはユーザー登録が必要です。</li>
                            <li>登録情報は正確かつ最新の内容を提供してください。</li>
                            <li>アカウントの管理責任はユーザーにあります。</li>
                            <li>18歳未満の方は、保護者の同意を得た上でご利用ください。</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>第3条（サービスの内容）</h2>
                        <p>本サービスは以下の機能を提供します。</p>
                        <ul>
                            <li>迷子ペット情報の登録・公開</li>
                            <li>目撃・保護情報の投稿・閲覧</li>
                            <li>地図を利用した位置情報の共有</li>
                            <li>ユーザー間のチャットによるコミュニケーション</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>第4条（禁止事項）</h2>
                        <p>ユーザーは、以下の行為を行ってはなりません。</p>
                        <ul>
                            <li>虚偽の情報を投稿する行為</li>
                            <li>他のユーザーに対する嫌がらせ、中傷行為</li>
                            <li>動物虐待に関連する行為</li>
                            <li>営利目的での動物の売買に本サービスを利用する行為</li>
                            <li>本サービスの運営を妨害する行為</li>
                            <li>法令または公序良俗に反する行為</li>
                            <li>他者の個人情報を無断で収集・利用する行為</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>第5条（投稿コンテンツ）</h2>
                        <ul>
                            <li>ユーザーが投稿したコンテンツの著作権はユーザーに帰属します。</li>
                            <li>当社は、サービスの提供・改善のために投稿コンテンツを利用できるものとします。</li>
                            <li>不適切な投稿は、当社の判断により削除することがあります。</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>第6条（免責事項）</h2>
                        <ul>
                            <li>当社は、ユーザー間のトラブルについて一切の責任を負いません。</li>
                            <li>目撃情報の正確性について、当社は保証いたしません。</li>
                            <li>サービスの中断・停止による損害について、当社は責任を負いません。</li>
                            <li>ペットの捜索結果について、当社は保証いたしません。</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>第7条（サービスの変更・停止）</h2>
                        <p>
                            当社は、事前の通知なくサービスの内容を変更、
                            または一時的もしくは永続的にサービスを停止することがあります。
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>第8条（退会）</h2>
                        <p>
                            ユーザーは、いつでもアカウントを削除し、本サービスを退会することができます。
                            退会後も、投稿済みの目撃情報は他のユーザーへの影響を考慮し、
                            一定期間保持される場合があります。
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>第9条（規約の変更）</h2>
                        <p>
                            当社は、必要と判断した場合、本規約を変更することがあります。
                            変更後の利用規約は、本サービス上に掲示した時点で効力を生じます。
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>第10条（準拠法・管轄裁判所）</h2>
                        <p>
                            本規約は日本法に準拠し、本サービスに関する紛争については
                            東京地方裁判所を第一審の専属的合意管轄裁判所とします。
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>お問い合わせ</h2>
                        <p>
                            本規約に関するお問い合わせは、以下までご連絡ください。
                        </p>
                        <p className={styles.contactInfo}>
                            REUNI<br />
                            メール: legal@reuni.jp
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
