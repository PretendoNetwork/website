import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

import localeList from '../public/assets/json/localeList.json';

import { isLoggedIn } from './utils/auth';

export function middleware(request: NextRequest) {
	// selects locale code based on user accept-language header and saves it as cookie
	let availableLocales: string[] = [];
	localeList.forEach((l) => {
		availableLocales.push(l.code);
	});

	availableLocales = availableLocales.filter((l) => l !== 'en@uwu');

	const plainHeaders: Record<string, string> = {};
	request.headers.forEach((v, k) => (plainHeaders[k] = v));

	const userLocales = new Negotiator({ headers: plainHeaders }).languages(availableLocales);

	const locale = match(userLocales, availableLocales, 'en-US');

	const response = NextResponse.next();
	response.cookies.set({
		name: 'autoLocale',
		value: locale,
		path: '/',
	});

	if (
		request.nextUrl.pathname.startsWith('/account/login') ||
		request.nextUrl.pathname.startsWith('/account/register')
	) {
		return response;
	}

	if (request.nextUrl.pathname.startsWith('/account') && !isLoggedIn()) {
		const target = `/account/login?redirect=${encodeURIComponent(request.nextUrl.href)}`;
		return NextResponse.redirect(new URL(target, request.url));
	}

	return response;
}

export const config = {
	matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
