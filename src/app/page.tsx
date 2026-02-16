import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroGradient}></div>
          <div className={styles.heroPattern}></div>
        </div>
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroBadge}>
            <span>🐾</span> 迷子・殺処分ゼロを目指して
          </div>
          <h1 className={styles.heroTitle}>
            大切な家族との
            <span className={styles.heroTitleAccent}>再会</span>を
            <br />
            支援します
          </h1>
          <p className={styles.heroDescription}>
            REUNIは、迷子になったペットと飼い主を繋ぐプラットフォームです。
            <br />
            目撃情報の共有とリアルタイムのコミュニケーションで、
            <br />
            一日も早い再会を実現します。
          </p>
          <div className={styles.heroActions}>
            <Link href="/service" className="btn btn-primary">
              サービスを見る
              <span>→</span>
            </Link>
            <Link href="/auth/register" className="btn btn-secondary">
              無料で始める
            </Link>
          </div>
        </div>
      </section>

      {/* TODO: Supabase連携後に実データで統計セクションを復活させる
      <section className={styles.stats}>
        <div className="container">
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>0</div>
              <div className={styles.statLabel}>再会達成</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>0</div>
              <div className={styles.statLabel}>登録ペット</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>0</div>
              <div className={styles.statLabel}>目撃情報</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>0</div>
              <div className={styles.statLabel}>利用ユーザー</div>
            </div>
          </div>
        </div>
      </section>
      */}

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>REUNIの仕組み</h2>
            <p>シンプルな3ステップで、ペットとの再会を支援します</p>
          </div>
          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>01</div>
              <div className={styles.stepIcon}>📝</div>
              <h3>ペット情報を登録</h3>
              <p>
                あなたのペットの写真や特徴を登録。
                万が一の迷子に備えて、いつでも情報を公開できます。
              </p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>02</div>
              <div className={styles.stepIcon}>👀</div>
              <h3>目撃情報を共有</h3>
              <p>
                迷子のペットを見かけたら、写真と位置情報を投稿。
                地域の方々と情報を共有できます。
              </p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>03</div>
              <div className={styles.stepIcon}>💬</div>
              <h3>飼い主と直接連絡</h3>
              <p>
                保護した方と飼い主が安全にチャットで連絡。
                スムーズな再会を実現します。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>REUNIの特徴</h2>
            <p>ペットと飼い主の再会を全力でサポート</p>
          </div>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🗺️</div>
              <h4>地図で可視化</h4>
              <p>目撃・保護情報を地図上でリアルタイムに確認。効率的な捜索が可能です。</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔔</div>
              <h4>通知機能</h4>
              <p>登録地域で新しい目撃情報があれば即座にお知らせ。見逃しを防ぎます。</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔒</div>
              <h4>安全なチャット</h4>
              <p>個人情報を明かさずに飼い主と発見者が連絡可能。プライバシーを保護します。</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📱</div>
              <h4>スマホ対応</h4>
              <p>外出先でもすぐに投稿・確認。レスポンシブデザインで快適に利用できます。</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🆓</div>
              <h4>無料で利用</h4>
              <p>すべての基本機能を無料で提供。経済的な負担なく利用できます。</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🤝</div>
              <h4>コミュニティ</h4>
              <p>地域の方々と協力してペットを探す。みんなで支え合うプラットフォーム。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Preview */}
      <section className={styles.missionPreview}>
        <div className="container">
          <div className={styles.missionCard}>
            <div className={styles.missionContent}>
              <h2>私たちの使命</h2>
              <p className={styles.missionText}>
                日本では毎年多くのペットが迷子になり、
                残念ながら殺処分される動物も少なくありません。
                REUNIは、テクノロジーの力でペットと飼い主の再会率を高め、
                殺処分ゼロの社会を目指します。
              </p>
              <Link href="/about" className="btn btn-primary">
                理念を詳しく見る
              </Link>
            </div>
            <div className={styles.missionVisual}>
              <div className={styles.missionEmoji}>🏠</div>
              <div className={styles.missionEmojiSmall1}>🐕</div>
              <div className={styles.missionEmojiSmall2}>🐈</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2>今すぐ始めましょう</h2>
            <p>
              大切な家族を守るために、今日からペット情報を登録しませんか？
              <br />
              無料で簡単に始められます。
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
    </>
  );
}
