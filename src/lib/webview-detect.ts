'use client';

/**
 * アプリ内ブラウザ（WebView）を検出するユーティリティ
 * LINE, Twitter, Instagram, Facebook 等のアプリ内ブラウザを検出
 */

export function isInAppBrowser(): boolean {
    if (typeof window === 'undefined') return false;

    const ua = navigator.userAgent || navigator.vendor || '';

    // 主要なアプリ内ブラウザの判定
    const inAppPatterns = [
        /Line\//i,           // LINE
        /FBAN|FBAV/i,        // Facebook
        /Instagram/i,        // Instagram
        /Twitter/i,          // Twitter / X
        /MicroMessenger/i,   // WeChat
        /Snapchat/i,         // Snapchat
        /TikTok/i,           // TikTok
        /\bwv\b/i,           // Android WebView
        /WebView/i,          // Generic WebView
    ];

    // iOS の standalone モード（PWA）は除外
    if ((window.navigator as any).standalone) return false;

    return inAppPatterns.some(pattern => pattern.test(ua));
}

/**
 * 現在のURLを外部ブラウザで開くためのURLを生成
 * iOS: Safari で開く
 * Android: Chrome で開く（intent URL）
 */
export function getExternalBrowserUrl(url?: string): string {
    const targetUrl = url || window.location.href;

    // Android の場合は Intent URL で Chrome を起動
    const ua = navigator.userAgent;
    if (/android/i.test(ua)) {
        return `intent://${targetUrl.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
    }

    // iOS の場合はそのまま（Safari で開くよう案内）
    return targetUrl;
}

/**
 * OSを判定
 */
export function getMobileOS(): 'ios' | 'android' | 'other' {
    if (typeof window === 'undefined') return 'other';
    const ua = navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
    if (/android/i.test(ua)) return 'android';
    return 'other';
}
