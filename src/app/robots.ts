import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/dashboard/', '/chat/', '/api/'],
            },
        ],
        sitemap: 'https://reuni.vercel.app/sitemap.xml',
    };
}
