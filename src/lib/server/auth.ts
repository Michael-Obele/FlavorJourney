import type { RequestEvent } from '@sveltejs/kit';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from '$lib/server/db';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = 'auth-session';

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	const token = encodeBase64url(bytes);
	return token;
}

export async function createSession(token: string, userId: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session = await db.session.create({
		data: {
			id: sessionId,
			user_id: userId,
			expires_at: new Date(Date.now() + DAY_IN_MS * 30)
		}
	});
	return session;
}

export async function validateSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const result = await db.session.findUnique({
		where: {
			id: sessionId
		},
		include: {
			user: {
				select: {
					id: true,
					username: true
				}
			}
		}
	});

	if (!result || !result.user) {
		return { session: null, user: null };
	}

	const { user, ...session } = result;

	const sessionExpired = Date.now() >= session.expires_at.getTime();
	if (sessionExpired) {
		await db.session.delete({ where: { id: session.id } });
		return { session: null, user: null };
	}

	const renewSession = Date.now() >= session.expires_at.getTime() - DAY_IN_MS * 15;
	if (renewSession) {
		const newExpiresAt = new Date(Date.now() + DAY_IN_MS * 30);
		await db.session.update({
			where: { id: session.id },
			data: { expires_at: newExpiresAt }
		});
		session.expires_at = newExpiresAt; // Update the session object in memory too
	}

	return { session, user };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(sessionId: string) {
	await db.session.delete({ where: { id: sessionId } });
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	event.cookies.set(sessionCookieName, token, {
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(sessionCookieName, {
		path: '/'
	});
}

export async function getUserFromGoogleId(googleId: string) {
	return db.user.findUnique({
		where: {
			google_id: googleId
		}
	});
}

export async function createUser(googleId: string, username: string) {
	return db.user.create({
		data: {
			id: crypto.randomUUID(),
			google_id: googleId,
			username: username // You might want to generate a unique username or handle existing ones
		}
	});
}
