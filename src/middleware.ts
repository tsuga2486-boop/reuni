import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// 認証が必要なルート
const protectedRoutes = ['/dashboard', '/chat'];

export async function middleware(request: NextRequest) {
    // 環境変数が未設定の場合はスキップ
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        return NextResponse.next();
    }

    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // 認証保護ルートのチェックのみgetUserを呼ぶ
    const isProtectedRoute = protectedRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
    );

    const isAuthRoute = request.nextUrl.pathname.startsWith('/auth');

    // 保護ルートまたは認証ルートの場合のみユーザー情報を取得
    if (isProtectedRoute || isAuthRoute) {
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (isProtectedRoute && !user) {
                const url = request.nextUrl.clone();
                url.pathname = '/auth/login';
                url.searchParams.set('redirect', request.nextUrl.pathname);
                return NextResponse.redirect(url);
            }

            if (isAuthRoute && user) {
                const url = request.nextUrl.clone();
                url.pathname = '/dashboard';
                return NextResponse.redirect(url);
            }
        } catch {
            // Supabase接続エラー時はそのまま通す
            if (isProtectedRoute) {
                const url = request.nextUrl.clone();
                url.pathname = '/auth/login';
                return NextResponse.redirect(url);
            }
        }
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/chat/:path*',
        '/auth/:path*',
    ],
};
