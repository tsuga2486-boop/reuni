import Script from 'next/script';

// Organization + WebSite + SearchAction 構造化データ
export function OrganizationJsonLd() {
    const organizationData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'REUNI（リユニ）',
        url: 'https://reuni.jp',
        logo: 'https://reuni.jp/favicon.ico',
        description: 'REUNI（リユニ）は迷子になったペットと飼い主の再会を支援する無料プラットフォームです。',
        sameAs: [],
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            url: 'https://reuni.jp/contact',
            availableLanguage: 'Japanese',
        },
    };

    return (
        <Script
            id="organization-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
            strategy="afterInteractive"
        />
    );
}

export function WebSiteJsonLd() {
    const websiteData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'REUNI（リユニ）',
        alternateName: ['リユニ', 'REUNI'],
        url: 'https://reuni.jp',
        description: '迷子ペットと飼い主の再会を支援するプラットフォーム',
        inLanguage: 'ja',
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://reuni.jp/service/pets?q={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
        },
    };

    return (
        <Script
            id="website-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
            strategy="afterInteractive"
        />
    );
}

export function WebApplicationJsonLd() {
    const appData = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'REUNI（リユニ）',
        url: 'https://reuni.jp',
        applicationCategory: 'LifestyleApplication',
        operatingSystem: 'Web',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'JPY',
        },
        description: '迷子ペットの捜索・保護情報共有・飼い主との直接連絡ができる無料Webアプリケーション。犬・猫の迷子届けや目撃情報の投稿、マップでの捜索が可能。',
        featureList: [
            '迷子ペット登録',
            '目撃・保護情報の投稿',
            '地図上での捜索',
            'チャットでの直接連絡',
            '迷子ペット一覧検索',
        ],
    };

    return (
        <Script
            id="webapp-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(appData) }}
            strategy="afterInteractive"
        />
    );
}

// FAQPage 構造化データ
export function FAQPageJsonLd({ faqs }: { faqs: { question: string; answer: string }[] }) {
    const faqData = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };

    return (
        <Script
            id="faqpage-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
            strategy="afterInteractive"
        />
    );
}

// BreadcrumbList 構造化データ
export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
    const breadcrumbData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };

    return (
        <Script
            id="breadcrumb-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
            strategy="afterInteractive"
        />
    );
}

// HowTo 構造化データ（迷子ペットの探し方ガイド用）
export function HowToJsonLd({ name, description, steps }: {
    name: string;
    description: string;
    steps: { name: string; text: string }[];
}) {
    const howToData = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name,
        description,
        step: steps.map((step, index) => ({
            '@type': 'HowToStep',
            position: index + 1,
            name: step.name,
            text: step.text,
        })),
    };

    return (
        <Script
            id="howto-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(howToData) }}
            strategy="afterInteractive"
        />
    );
}
