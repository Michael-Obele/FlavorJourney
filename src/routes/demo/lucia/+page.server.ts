import { fail, redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';
import type { Actions, PageServerLoad } from './$types';
import { hash } from '@node-rs/argon2';
import { db } from '$lib/server/db';
import { encodeBase32LowerCase } from '@oslojs/encoding';

export const load: PageServerLoad = async () => {
	const user = requireLogin();
	return { user };
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		// Invalidate the session in the database
		await db.session.delete({
			where: {
				id: event.locals.session.id
			}
		});
		// Clear the session cookie
		event.cookies.set('session_id', '', {
			path: '/',
			expires: new Date(0)
		});

		return redirect(302, '/demo/lucia/login');
	},
	register: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!validateUsername(username)) {
			return fail(400, {
				message: 'Invalid username (min 3, max 31 characters, alphanumeric only)'
			});
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password (min 6, max 255 characters)' });
		}

		const userId = generateUserId();
		const passwordHash = await hash(password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			await db.user.create({
				data: {
					id: userId,
					username,
					password_hash: passwordHash
				}
			});

			const session = await db.session.create({
				data: {
					id: generateSessionId(),
					user_id: userId,
					expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 1 week
				}
			});

			event.cookies.set('session_id', session.id, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: process.env.NODE_ENV === 'production',
				expires: session.expires_at
			});
		} catch (e) {
			if (
				e instanceof Error &&
				e.message.includes('Unique constraint failed on the fields: (`username`)')
			) {
				return fail(400, { message: 'Username already taken' });
			}
			return fail(500, { message: 'An unknown error occurred' });
		}
		return redirect(302, '/demo/lucia');
	}
};

function generateUserId(): string {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}

function generateSessionId(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(16)); // 128-bit ID
	const id = encodeBase32LowerCase(bytes);
	return id;
}

function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-z0-9_-]+$/.test(username)
	);
}

function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}

function requireLogin() {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return redirect(302, '/demo/lucia/login');
	}

	return locals.user;
}
