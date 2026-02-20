import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
    title: '迷子ペット捜索サービス - ペット登録・目撃情報・地図検索',
    description: 'REUNI（リユニ）のサービス一覧。迷子犬・迷子猫の登録、目撃・保護情報の共有、地図での捜索エリア確認、飼い主とのチャット機能を無料でご利用いただけます。',
};

export default function ServicePage() {
    return (
        <div className={styles.servicePage}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className="container">
                    <h1>REUNI（リユニ）サービス</h1>
                    <p className={styles.heroSubtitle}>
                        ペットの迷子対策から再会まで、すべてをサポート
                    </p>
                </div>
            </section>

            {/* Service Cards */}
            <section className={styles.services}>
                <div className="container">
                    <div className={styles.servicesGrid}>
                        {/* Pet Registration */}
                        <Link href="/dashboard/pets" className={styles.serviceCard}>
                            <div className={styles.serviceIcon}>🐕</div>
                            <h2>ペット情報登録</h2>
                            <p>
                                あなたのペットの写真や特徴を登録。
                                迷子になった時にすぐに情報を公開できます。
                            </p>
                            <span className={styles.serviceLink}>
                                登録する <span>→</span>
                            </span>
                        </Link>

                        {/* Lost Pet List */}
                        <Link href="/service/pets" className={styles.serviceCard}>
                            <div className={styles.serviceIcon}>🔍</div>
                            <h2>迷子ペット一覧</h2>
                            <p>
                                現在迷子になっているペットの情報を確認。
                                種類や地域で絞り込み検索ができます。
                            </p>
                            <span className={styles.serviceLink}>
                                一覧を見る <span>→</span>
                            </span>
                        </Link>

                        {/* Sighting Reports */}
                        <Link href="/service/sightings" className={styles.serviceCard}>
                            <div className={styles.serviceIcon}>👀</div>
                            <h2>目撃・保護情報</h2>
                            <p>
                                迷子のペットを見かけた方からの情報を確認。
                                保護情報も投稿できます。
                            </p>
                            <span className={styles.serviceLink}>
                                情報を見る <span>→</span>
                            </span>
                        </Link>

                        {/* Map View */}
                        <Link href="/service/map" className={styles.serviceCard}>
                            <div className={styles.serviceIcon}>🗺️</div>
                            <h2>マップで探す</h2>
                            <p>
                                迷子ペットや目撃情報を地図上で確認。
                                効率的な捜索エリアを特定できます。
                            </p>
                            <span className={styles.serviceLink}>
                                マップを開く <span>→</span>
                            </span>
                        </Link>

                        {/* Post Sighting */}
                        <Link href="/service/sightings/new" className={styles.serviceCard}>
                            <div className={styles.serviceIcon}>📝</div>
                            <h2>目撃情報を投稿</h2>
                            <p>
                                迷子のペットを見かけたら情報を投稿。
                                写真と位置情報で飼い主をサポート。
                            </p>
                            <span className={styles.serviceLink}>
                                投稿する <span>→</span>
                            </span>
                        </Link>

                        {/* My Page */}
                        <Link href="/dashboard" className={styles.serviceCard}>
                            <div className={styles.serviceIcon}>👤</div>
                            <h2>マイページ</h2>
                            <p>
                                登録したペット情報の管理や迷子状態の切り替え、
                                チャット履歴を確認できます。
                            </p>
                            <span className={styles.serviceLink}>
                                マイページへ <span>→</span>
                            </span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* How to Use */}
            <section className={styles.howToUse}>
                <div className="container">
                    <h2 className="text-center">ご利用の流れ</h2>
                    <div className={styles.flowGrid}>
                        <div className={styles.flowItem}>
                            <div className={styles.flowNumber}>1</div>
                            <h3>無料登録</h3>
                            <p>メールアドレスで簡単に登録</p>
                        </div>
                        <div className={styles.flowArrow}>→</div>
                        <div className={styles.flowItem}>
                            <div className={styles.flowNumber}>2</div>
                            <h3>ペット登録</h3>
                            <p>写真と特徴を登録</p>
                        </div>
                        <div className={styles.flowArrow}>→</div>
                        <div className={styles.flowItem}>
                            <div className={styles.flowNumber}>3</div>
                            <h3>迷子時に公開</h3>
                            <p>ワンタップで情報公開</p>
                        </div>
                        <div className={styles.flowArrow}>→</div>
                        <div className={styles.flowItem}>
                            <div className={styles.flowNumber}>4</div>
                            <h3>目撃情報確認</h3>
                            <p>地図で捜索エリアを特定</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.cta}>
                <div className="container">
                    <div className={styles.ctaCard}>
                        <h2>今すぐ始めましょう</h2>
                        <p>
                            大切な家族を守るために、ペット情報を登録しませんか？
                        </p>
                        <div className={styles.ctaActions}>
                            <Link href="/auth/register" className="btn btn-primary">
                                無料で登録する
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
