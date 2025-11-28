import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/', '/dashboard', '/inventory', '/reports', '/pos'];
const AUTH_ROUTES = ['/signin', '/auth/signup'];

export function middleware(request: NextRequest) {
    const authToken = request.cookies.get('cms_pos_auth_token')?.value;
    const currentPath = request.nextUrl.pathname;

    // Cek apakah path saat ini adalah rute yang dilindungi
    const isProtectedRoute = PROTECTED_ROUTES.some(route => currentPath === route || (route !== '/' && currentPath.startsWith(route)));

    const isAuthRoute = AUTH_ROUTES.includes(currentPath);

    if (isProtectedRoute && !authToken) {
        const url = request.nextUrl.clone();
        url.pathname = '/signin';
        return NextResponse.redirect(url);
    }

    if (isAuthRoute && authToken) {
        // 2. Jika sudah login tapi mengakses halaman login/signup, arahkan ke rute root '/'
        const url = request.nextUrl.clone();
        url.pathname = '/'; // <--- Diubah ke Rute Root
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

// Konfigurasi agar middleware berjalan pada rute tertentu
export const config = {
    // Tambahkan '/' ke matcher
    matcher: ['/', '/dashboard/:path*', '/inventory/:path*', '/reports/:path*', '/pos/:path*', '/auth/:path*'],
};