import Link from 'next/link';

export default function NotFound() {
    return (
        <div style={{
            minHeight: 'calc(100vh - 200px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
        }}>
            <div style={{
                textAlign: 'center',
                maxWidth: '500px',
            }}>
                <div style={{
                    fontSize: '6rem',
                    lineHeight: 1,
                    marginBottom: '1rem',
                }}>
                    🐾
                </div>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: 'var(--neutral-900)',
                    marginBottom: '0.5rem',
                }}>
                    ページが見つかりません
                </h1>
                <p style={{
                    fontSize: '1.1rem',
                    color: 'var(--neutral-500)',
                    marginBottom: '2rem',
                    lineHeight: 1.6,
                }}>
                    お探しのページは移動または削除された可能性があります。
                </p>
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                }}>
                    <Link href="/" className="btn btn-primary">
                        ホームに戻る
                    </Link>
                    <Link href="/service" className="btn btn-outline">
                        サービスを見る
                    </Link>
                </div>
            </div>
        </div>
    );
}
