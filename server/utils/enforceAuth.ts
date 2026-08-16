import type { H3Event } from 'h3';

export type AuthContext = {
	pid: number;
	username: string;
	token: string;
	email: string;
	accessLevel: number;
	stripeSubscriptionId: string | null;
};

export function setAuthContext(event: H3Event, context: AuthContext | null): void {
	event.context.auth = context;
}

export function getAuthContext(event: H3Event): AuthContext | null {
	return event.context.auth ?? null;
}

export function enforceLoggedIn(event: H3Event): AuthContext {
	const context = getAuthContext(event);
	if (!context) {
		throw createApiError('UNAUTHENTICATED');
	}
	return context;
}
