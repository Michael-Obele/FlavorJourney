# Google OAuth with Lucia Auth in SvelteKit: A Step-by-Step Guide

This guide synthesizes information from Lucia Auth documentation to provide a clear, step-by-step process for integrating Google OAuth into your SvelteKit project using Lucia Auth and Arctic.

## Prerequisites

Before starting, ensure you have set up session and cookie APIs as outlined in the Lucia Auth "Sessions" overview.

## 1. Create an OAuth App (Google Cloud Console)

Create a Google OAuth client in the Google Cloud Console.
Set the authorized redirect URI to `http://localhost:5173/login/google/callback`.
Copy your Client ID and Client Secret and add them to your `.env` file:

```dotenv
# .env
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

## 2. Update your Database User Model

Update your user model to include fields for the user's Google ID and name.

```typescript
interface User {
	id: number;
	googleId: string;
	name: string;
}
```

## 3. Setup Arctic

Install the `arctic` library:

```bash
npm install arctic
```

Initialize the Google provider with your client ID, client secret, and redirect URI. This typically goes into a server-side file, e.g., `src/lib/server/oauth.ts`.

```typescript
// src/lib/server/oauth.ts
import { Google } from "arctic";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "$env/static/private";

export const google = new Google(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	"http://localhost:5173/login/google/callback"
);
```

## 4. Create a Sign-in Page

Create a Svelte page for signing in, e.g., `routes/login/+page.svelte`. This page will contain a link to initiate the Google OAuth flow.

```svelte
<!-- routes/login/+page.svelte -->
<h1>Sign in</h1>
<a href="/login/google">Sign in with Google</a>
```

## 5. Create Authorization URL API Route

Create an API route to generate the Google OAuth authorization URL, e.g., `routes/login/google/+server.ts`. This route will generate a `state` and `code verifier`, store them in cookies, and redirect the user to Google's sign-in page.

```typescript
// routes/login/google/+server.ts
import { generateState, generateCodeVerifier } from "arctic";
import { google } from "$lib/server/oauth";

import type { RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent): Promise<Response> {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const url = google.createAuthorizationURL(state, codeVerifier, {
        scopes: ["openid", "profile"]
    });

	event.cookies.set("google_oauth_state", state, {
		path: "/",
		httpOnly: true,
		maxAge: 60 * 10, // 10 minutes
		sameSite: "lax"
	});
	event.cookies.set("google_code_verifier", codeVerifier, {
		path: "/",
		httpOnly: true,
		maxAge: 60 * 10, // 10 minutes
		sameSite: "lax"
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString()
		}
	});
}
```

## 6. Validate Callback API Route

Create an API route to handle the OAuth callback from Google, e.g., `routes/login/google/callback/+server.ts`. This route validates the state and code verifier, exchanges the authorization code for tokens, decodes the ID token to get user information, and handles user creation/login and session management.

```typescript
// routes/login/google/callback/+server.ts
import { generateSessionToken, createSession, setSessionTokenCookie } from "$lib/server/session";
import { google } from "$lib/server/oauth";
import { decodeIdToken } from "arctic";

import type { RequestEvent } from "@sveltejs/kit";
import type { OAuth2Tokens } from "arctic";

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get("code");
	const state = event.url.searchParams.get("state");
	const storedState = event.cookies.get("google_oauth_state") ?? null;
	const codeVerifier = event.cookies.get("google_code_verifier") ?? null;

	if (code === null || state === null || storedState === null || codeVerifier === null) {
		return new Response(null, {
			status: 400
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch (e) {
		// Invalid code or client credentials
		return new Response(null, {
			status: 400
		});
	}

	const claims = decodeIdToken(tokens.idToken); // Use tokens.idToken directly
	const googleUserId = claims.sub;
	const username = claims.name;

	// TODO: Replace this with your own DB query to find user by googleId
	const existingUser = await getUserFromGoogleId(googleUserId); // Placeholder function

	if (existingUser !== null) {
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/"
			}
		});
	}

	// TODO: Replace this with your own DB query to create a new user
	const user = await createUser(googleUserId, username); // Placeholder function

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	setSessionTokenCookie(event, sessionToken, session.expiresAt);
	return new Response(null, {
		status: 302,
		headers: {
			Location: "/"
		}
	});
}

// Placeholder functions for database operations - replace with your actual DB logic
async function getUserFromGoogleId(googleId: string) {
    // Implement your database query to find a user by their Google ID
    return null; // Return user object if found, null otherwise
}

async function createUser(googleId: string, username: string) {
    // Implement your database query to create a new user
    return { id: "new_user_id", googleId, name: username }; // Return the newly created user object
}
```

## 7. Get the Current User (Server Load Function)

If you have implemented a session middleware (e.g., in `src/hooks.server.ts`), you can access the current session and user from `event.locals` in your `+page.server.ts` files.

```typescript
// routes/+page.server.ts
import { redirect } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, "/login");
	}

	return {
		user: event.locals.user // Assuming event.locals.user is populated by your session middleware
	};
};
```

## 8. Sign Out

To sign out a user, invalidate their session and remove the session cookie. This can be done in a SvelteKit action.

```typescript
// routes/+page.server.ts
import { fail, redirect } from "@sveltejs/kit";
import { invalidateSession, deleteSessionTokenCookie } from "$lib/server/session"; // Placeholder for your session utility functions

import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	// ... your existing load logic
    return {};
};

export const actions: Actions = {
	default: async (event) => {
		if (event.locals.session === null) {
			return fail(401);
		}
		await invalidateSession(event.locals.session.id);
		deleteSessionTokenCookie(event);
		return redirect(302, "/login");
	}
};
```

And a basic sign-out button in your Svelte page:

```svelte
<!-- routes/+page.svelte -->
<script lang="ts">
	import { enhance } from "$app/forms";
</script>

<form method="post" use:enhance>
    <button>Sign out</button>
</form>