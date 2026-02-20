import Link from 'next/link';
import styles from './page.module.css';
import { HowToJsonLd, BreadcrumbJsonLd, FAQPageJsonLd } from '@/components/seo/JsonLd';

export const metadata = {
    title: '迷子ペットの探し方ガイド【犬・猫が迷子になったらすべきこと】',
    description: '犬や猫が迷子になったときの対処法を完全ガイド。すぐにやるべき5つのステップ、届出先一覧（警察・保健所・動物愛護センター）、SNS活用法、捜索のコツまで。迷子ペットの発見率を高める方法を解説します。',
    openGraph: {
        title: '迷子ペットの探し方ガイド【犬・猫が迷子になったらすべきこと】',
        description: '犬や猫が迷子になったときの対処法を完全ガイド。すぐにやるべき5ステップ、届出先一覧、捜索のコツを解説。',
    },
};

export default function LostPetGuidePage() {
    return (
        <div className={styles.guidePage}>
            <HowToJsonLd
                name="迷子ペットの探し方"
                description="犬や猫が迷子になったときにすべきこと5ステップ"
                steps={[
                    { name: '周辺を捜索する', text: 'まずは近所を歩いて探しましょう。犬は1〜2km、猫は200m〜500m圏内にいることが多いです。名前を呼びながら、よく行く場所やお気に入りの場所を重点的に探してください。' },
                    { name: '警察・保健所に届出', text: '最寄りの警察署に「遺失物届」を、保健所・動物愛護センターに「迷子届」を出してください。収容された場合に連絡がもらえます。' },
                    { name: 'REUNIに登録', text: 'REUNIにペット情報を登録して「迷子」に設定。地図上に表示され、目撃情報が集まりやすくなります。' },
                    { name: 'チラシ・SNSで情報拡散', text: '写真付きのチラシを作成し、地域に掲示。SNS（Twitter/X、Instagram、Facebook）でも拡散しましょう。' },
                    { name: '目撃情報を確認', text: 'REUNIの地図で目撃情報をチェックし、行動範囲を把握して捜索エリアを絞り込みましょう。' },
                ]}
            />
            <FAQPageJsonLd faqs={[
                { question: '犬が迷子になったらまず何をすべきですか？', answer: 'まずは近所を徒歩で探してください。犬は迷子になると1〜2km圏内にいることが多いです。同時に、警察に遺失物届を、保健所・動物愛護センターに迷子届を出してください。REUNIに登録して目撃情報を集めることも効果的です。' },
                { question: '猫が帰ってこない場合どうすればいいですか？', answer: '室内飼いの猫は家の周辺200m〜500m以内に隠れていることがほとんどです。夜間や早朝の静かな時間帯に名前を呼びながら探してください。猫用フードやトイレの砂を玄関先に置くと帰ってくることもあります。また、REUNIに登録して近隣の方からの情報を集めましょう。' },
                { question: '迷子ペットが見つかる確率はどのくらいですか？', answer: '一般的に、迷子犬の約93%、迷子猫の約74%が飼い主のもとに戻ると言われています。早期の捜索開始と情報拡散が発見率を大きく高めます。' },
                { question: '迷子のペットを見つけたらどうすればいいですか？', answer: 'まず安全に保護してください。近くの動物病院でマイクロチップの確認を依頼し、警察に届け出てください。REUNIの目撃情報投稿機能を使って飼い主に知らせることもできます。' },
            ]} />
            <BreadcrumbJsonLd items={[
                { name: 'ホーム', url: 'https://reuni.jp' },
                { name: 'ガイド', url: 'https://reuni.jp/guide' },
                { name: '迷子ペットの探し方', url: 'https://reuni.jp/guide/lost-pet' },
            ]} />

            {/* Hero */}
            <section className={styles.guideHero}>
                <div className="container">
                    <div className={styles.heroBadge}>📖 完全ガイド</div>
                    <h1>迷子ペットの探し方ガイド</h1>
                    <p className={styles.heroSubtitle}>
                        犬・猫が迷子になったらすべきこと
                    </p>
                    <p className={styles.heroDescription}>
                        大切なペットが迷子になった時、焦らず正しい行動をとることが再会への近道です。
                        <br />
                        このガイドでは、迷子になった直後のやるべきことから、効果的な捜索方法まで徹底解説します。
                    </p>
                </div>
            </section>

            {/* 5ステップ */}
            <section className={styles.stepsSection}>
                <div className="container">
                    <h2>迷子になったら<strong>すぐやるべき5つのステップ</strong></h2>

                    <div className={styles.stepsList}>
                        <div className={styles.stepItem}>
                            <div className={styles.stepNumber}>1</div>
                            <div className={styles.stepContent}>
                                <h3>周辺を徒歩で捜索する</h3>
                                <p>
                                    <strong>犬の場合</strong>：迷子になった場所から1〜2km圏内を重点的に探しましょう。
                                    散歩コースやよく行く公園、以前住んでいた場所なども確認してください。
                                </p>
                                <p>
                                    <strong>猫の場合</strong>：室内飼いの猫は家から200m〜500m以内に隠れていることがほとんどです。
                                    車の下、物置、植え込みの中などを念入りにチェックしましょう。
                                    <strong>夜間や早朝の静かな時間帯</strong>が見つけやすいです。
                                </p>
                            </div>
                        </div>

                        <div className={styles.stepItem}>
                            <div className={styles.stepNumber}>2</div>
                            <div className={styles.stepContent}>
                                <h3>警察・保健所に届け出る</h3>
                                <p>
                                    以下の機関に<strong>できるだけ早く</strong>届け出ましょう：
                                </p>
                                <ul>
                                    <li><strong>警察署</strong>：「遺失物届」を提出。拾得物として届けられている場合に連絡がもらえます。</li>
                                    <li><strong>保健所・動物愛護センター</strong>：「迷子届」を提出。収容された場合に連絡がもらえます。</li>
                                    <li><strong>近隣の動物病院</strong>：保護された動物が持ち込まれることがあります。</li>
                                </ul>
                            </div>
                        </div>

                        <div className={styles.stepItem}>
                            <div className={styles.stepNumber}>3</div>
                            <div className={styles.stepContent}>
                                <h3>REUNIに迷子情報を登録する</h3>
                                <p>
                                    <Link href="/auth/register">REUNI（リユニ）に無料登録</Link>して、ペットの写真・特徴・最後に見かけた場所を登録しましょう。
                                </p>
                                <ul>
                                    <li>📍 <strong>地図上に表示</strong>され、近くの人が見つけやすくなります</li>
                                    <li>👀 <strong>目撃情報</strong>が集まりやすくなります</li>
                                    <li>💬 目撃者と<strong>直接チャット</strong>で連絡が取れます</li>
                                </ul>
                            </div>
                        </div>

                        <div className={styles.stepItem}>
                            <div className={styles.stepNumber}>4</div>
                            <div className={styles.stepContent}>
                                <h3>チラシ・SNSで情報を拡散する</h3>
                                <p>
                                    <strong>写真付きチラシ</strong>を作成し、以下の場所に掲示しましょう：
                                </p>
                                <ul>
                                    <li>近隣のスーパー・コンビニ・動物病院</li>
                                    <li>公園・散歩コース周辺</li>
                                    <li>SNS（Twitter/X、Instagram、Facebook、地域のLINEグループ）</li>
                                </ul>
                            </div>
                        </div>

                        <div className={styles.stepItem}>
                            <div className={styles.stepNumber}>5</div>
                            <div className={styles.stepContent}>
                                <h3>目撃情報を確認し捜索エリアを絞る</h3>
                                <p>
                                    <Link href="/service/map">REUNIの地図機能</Link>で目撃情報を確認し、
                                    ペットの行動パターンを把握しましょう。時間帯別の目撃場所から、
                                    <strong>効率的な捜索エリア</strong>を特定できます。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 犬の迷子 */}
            <section className={styles.animalSection}>
                <div className="container">
                    <h2>🐕 犬が迷子になった場合の対処法</h2>
                    <div className={styles.animalGrid}>
                        <div className={styles.animalCard}>
                            <h3>犬の行動パターン</h3>
                            <ul>
                                <li>パニックになると遠くまで走ってしまうことが多い</li>
                                <li>散歩コースや以前住んでいた場所に向かう傾向</li>
                                <li>フレンドリーな犬は他の人についていくことも</li>
                                <li>夜間は物陰で休んでいることが多い</li>
                            </ul>
                        </div>
                        <div className={styles.animalCard}>
                            <h3>効果的な捜索方法</h3>
                            <ul>
                                <li>お気に入りのおやつやオモチャを持って捜索</li>
                                <li>他の犬を連れて行くと見つかりやすいことも</li>
                                <li>名前を呼びながらゆっくり歩く</li>
                                <li>朝6時〜8時、夕方16時〜18時が活発な時間帯</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 猫の迷子 */}
            <section className={styles.animalSection}>
                <div className="container">
                    <h2>🐈 猫が迷子になった場合の対処法</h2>
                    <div className={styles.animalGrid}>
                        <div className={styles.animalCard}>
                            <h3>猫の行動パターン</h3>
                            <ul>
                                <li>室内猫は家の近く（200m〜500m）に隠れていることがほとんど</li>
                                <li>恐怖で動けなくなり、呼んでも出てこないことが多い</li>
                                <li>狭い場所（車の下、物置内、天井裏）に隠れる傾向</li>
                                <li>外猫は数日〜1週間後に自力で帰ることも</li>
                            </ul>
                        </div>
                        <div className={styles.animalCard}>
                            <h3>効果的な捜索方法</h3>
                            <ul>
                                <li>夜間（22時以降）や早朝の静かな時間に捜索</li>
                                <li>懐中電灯で目が光るのを確認</li>
                                <li>使用済みの猫砂やフードを玄関先に置く</li>
                                <li>段ボールハウスを玄関先に設置</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 届出先一覧 */}
            <section className={styles.contactSection}>
                <div className="container">
                    <h2>📋 迷子ペットの届出先一覧</h2>
                    <div className={styles.contactGrid}>
                        <div className={styles.contactCard}>
                            <h3>🏛️ 警察署</h3>
                            <p>「遺失物届」を提出</p>
                            <p className={styles.contactNote}>拾得物として届けられた場合に連絡がもらえます</p>
                        </div>
                        <div className={styles.contactCard}>
                            <h3>🏥 保健所・動物愛護センター</h3>
                            <p>「迷子届」を提出</p>
                            <p className={styles.contactNote}>収容された場合に連絡がもらえます</p>
                        </div>
                        <div className={styles.contactCard}>
                            <h3>🏪 近隣の動物病院</h3>
                            <p>チラシを配布・保護情報を確認</p>
                            <p className={styles.contactNote}>マイクロチップの情報照会も可能</p>
                        </div>
                        <div className={styles.contactCard}>
                            <h3>📱 REUNI（リユニ）</h3>
                            <p>オンラインで迷子情報を登録</p>
                            <p className={styles.contactNote}>地図・目撃情報・チャットで捜索をサポート</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.guideCta}>
                <div className="container">
                    <div className={styles.ctaCard}>
                        <h2>今すぐ迷子ペットを登録しましょう</h2>
                        <p>
                            REUNIに登録すると、地図上で目撃情報を集め、飼い主と直接チャットで連絡が取れます。
                            <br />
                            すべての機能を<strong>無料</strong>でご利用いただけます。
                        </p>
                        <div className={styles.ctaActions}>
                            <Link href="/auth/register" className="btn btn-primary">
                                無料で登録する
                            </Link>
                            <Link href="/service/pets" className="btn btn-secondary">
                                迷子ペット一覧を見る
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
