import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { isLoggedIn } from './utils/auth';

export function middleware(request: NextRequest) {
	if (request.nextUrl.pathname.startsWith('/account') && !isLoggedIn()) {
		
		const target = `/account/login?redirect=${encodeURIComponent(request.nextUrl.href)}`;
		return NextResponse.redirect(new URL(target, request.url));
	}
}

export const config = {
	matcher: '/account((?!/login|/register).*)',
};
