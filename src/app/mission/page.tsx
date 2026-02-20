import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
    title: '理念・ミッション - 迷子・殺処分ゼロを目指して',
    description: 'REUNI（リユニ）の理念とミッション。日本では毎年多くのペットが迷子になり殺処分されています。迷子ペットと飼い主の再会をテクノロジーで支援し、殺処分ゼロの社会を実現します。',
};

export default function MissionPage() {
    return (
        <div className={styles.missionPage}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className="container">
                    <h1>理念・ミッション</h1>
                    <p className={styles.heroSubtitle}>
                        すべてのペットが家族のもとへ帰れる社会を目指して
                    </p>
                </div>
            </section>

            {/* Mission Statement */}
            <section className={styles.missionStatement}>
                <div className="container">
                    <div className={styles.statementCard}>
                        <div className={styles.statementIcon}>🏠</div>
                        <h2>私たちのミッション</h2>
                        <p className={styles.statementText}>
                            <strong>「迷子・殺処分ゼロの社会を実現する」</strong>
                        </p>
                        <p className={styles.statementDescription}>
                            REUNI（リユニ）は、テクノロジーと地域コミュニティの力を結集し、
                            迷子になったペットと飼い主の再会を支援します。
                            一日も早い再会が、殺処分という悲しい結末を防ぐことに繋がると信じています。
                        </p>
                    </div>
                </div>
            </section>

            {/* Problem */}
            <section className={styles.problem}>
                <div className="container">
                    <h2 className="text-center">日本のペット迷子問題</h2>
                    <div className={styles.problemGrid}>
                        <div className={styles.problemCard}>
                            <div className={styles.problemNumber}>約8万頭</div>
                            <p>年間の迷子ペット届出数</p>
                        </div>
                        <div className={styles.problemCard}>
                            <div className={styles.problemNumber}>約2万頭</div>
                            <p>年間の殺処分数</p>
                        </div>
                        <div className={styles.problemCard}>
                            <div className={styles.problemNumber}>約30%</div>
                            <p>迷子ペットの返還率</p>
                        </div>
                    </div>
                    <p className={styles.problemText}>
                        多くの迷子ペットが飼い主と再会できないまま、保護施設で長期間過ごしたり、
                        残念ながら殺処分されてしまう現実があります。
                        早期発見と迅速な情報共有が、この問題を解決する鍵です。
                    </p>
                </div>
            </section>

            {/* Solution */}
            <section className={styles.solution}>
                <div className="container">
                    <h2 className="text-center">REUNI（リユニ）が提供する解決策</h2>
                    <div className={styles.solutionGrid}>
                        <div className={styles.solutionCard}>
                            <div className={styles.solutionIcon}>📱</div>
                            <h3>迅速な情報発信</h3>
                            <p>
                                迷子発生時にワンタップで情報を公開。
                                地域の利用者に即座に通知が届きます。
                            </p>
                        </div>
                        <div className={styles.solutionCard}>
                            <div className={styles.solutionIcon}>🗺️</div>
                            <h3>可視化された捜索</h3>
                            <p>
                                目撃情報を地図上にリアルタイム表示。
                                効率的な捜索エリアの特定が可能です。
                            </p>
                        </div>
                        <div className={styles.solutionCard}>
                            <div className={styles.solutionIcon}>🤝</div>
                            <h3>コミュニティの力</h3>
                            <p>
                                地域住民が協力して目撃情報を共有。
                                みんなで支え合う捜索ネットワークを構築。
                            </p>
                        </div>
                        <div className={styles.solutionCard}>
                            <div className={styles.solutionIcon}>💬</div>
                            <h3>安全なコミュニケーション</h3>
                            <p>
                                プライバシーを守りながら保護者と飼い主が連絡。
                                スムーズな引き渡しを実現します。
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision */}
            <section className={styles.vision}>
                <div className="container">
                    <div className={styles.visionContent}>
                        <h2>私たちが目指す未来</h2>
                        <div className={styles.visionList}>
                            <div className={styles.visionItem}>
                                <span className={styles.visionCheck}>✓</span>
                                <span>迷子になったペットが24時間以内に発見される社会</span>
                            </div>
                            <div className={styles.visionItem}>
                                <span className={styles.visionCheck}>✓</span>
                                <span>すべてのペットに登録情報があり、すぐに飼い主が特定できる仕組み</span>
                            </div>
                            <div className={styles.visionItem}>
                                <span className={styles.visionCheck}>✓</span>
                                <span>地域全体でペットを見守るコミュニティ文化</span>
                            </div>
                            <div className={styles.visionItem}>
                                <span className={styles.visionCheck}>✓</span>
                                <span>殺処分という選択肢がなくなった社会</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.cta}>
                <div className="container">
                    <div className={styles.ctaContent}>
                        <h2>一緒に変えていきませんか</h2>
                        <p>
                            あなたの参加が、迷子・殺処分ゼロの社会への一歩になります。
                            今日からREUNI（リユニ）を始めましょう。
                        </p>
                        <div className={styles.ctaActions}>
                            <Link href="/auth/register" className="btn btn-primary">
                                無料で登録する
                            </Link>
                            <Link href="/service" className="btn btn-secondary">
                                サービスを見る
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
