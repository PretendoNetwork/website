export type AuthContext = {
	pid: number;
};

export function setAuthContext(event: H3Event, context: AuthContext): void {
	event.context.auth = context;
}

export function getAuthContext(event: H3Event): AuthContext | null {
	return event.context.auth ?? null;
}

export function enforceLoggedIn(event: H3Event): AuthContext {
	const context = getAuthContext(event);
	if (!context) {
		throw createError({
			status: 401,
			statusText: 'This action requires authentication'
		});
	}
	return context;
}
