import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'REUNI（リユニ） - 迷子ペットと飼い主をつなぐ',
        short_name: 'REUNI',
        description: '大切な家族との再会を支援する。迷子ペットと飼い主を繋ぐプラットフォーム',
        start_url: '/',
        display: 'standalone',
        background_color: '#f8fafc',
        theme_color: '#e8751d',
        orientation: 'portrait-primary',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    };
}
