import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'REUNI - 迷子ペットと飼い主をつなぐ';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #e8751d 0%, #d95c13 50%, #05c7b2 100%)',
                    fontFamily: 'sans-serif',
                    position: 'relative',
                }}
            >
                {/* 装飾円 */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-100px',
                        right: '-80px',
                        width: '400px',
                        height: '400px',
                        background: 'rgba(255,255,255,0.08)',
                        borderRadius: '50%',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-120px',
                        left: '-60px',
                        width: '350px',
                        height: '350px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '50%',
                    }}
                />

                {/* メインコンテンツ */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '20px',
                    }}
                >
                    <div style={{ fontSize: '80px' }}>🐾</div>
                    <div
                        style={{
                            fontSize: '72px',
                            fontWeight: 800,
                            color: 'white',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        REUNI
                    </div>
                    <div
                        style={{
                            fontSize: '28px',
                            color: 'rgba(255,255,255,0.9)',
                            fontWeight: 500,
                            textAlign: 'center',
                            maxWidth: '700px',
                        }}
                    >
                        迷子ペットと飼い主をつなぐプラットフォーム
                    </div>
                </div>

                {/* フッター */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '18px',
                    }}
                >
                    迷子・殺処分ゼロを目指して
                </div>
            </div>
        ),
        { ...size }
    );
}
