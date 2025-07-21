import type { Handle } from '@sveltejs/kit';
import { validateSessionToken, sessionCookieName } from '$lib/server/auth';

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(sessionCookieName);

	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await validateSessionToken(sessionId);

	if (!session) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

export const handle: Handle = handleAuth;
