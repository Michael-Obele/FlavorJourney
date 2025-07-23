# Google OAuth Setup Guide

This guide provides a step-by-step process for integrating Google OAuth into your SvelteKit project using the `arctic` library. This setup assumes you are using a custom authentication system and **not** Lucia Auth.

## Prerequisites

Before starting, ensure you have a basic understanding of OAuth 2.0 and have set up your SvelteKit project.

## 1. Create an OAuth App (Google Cloud Console)

1.  Navigate to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project or select an existing one.
3.  Go to "APIs & Services" > "Credentials".
4.  Click "Create Credentials" > "OAuth client ID".
5.  Select "Web application" as the application type.
6.  Set the authorized redirect URI to `http://localhost:5173/login/google/callback` (replace `http://localhost:5173` with your production URL when deploying).
7.  Copy your Client ID and Client Secret and add them to your `.env` file:

    ```dotenv
    # .env
    GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
    GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"
    ```

## 2. Update your Database User Model

Update your user model in your database schema to include fields for the user's Google ID and name. For example, if using Prisma:

```prisma
// prisma/schema.prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  googleId  String?  @unique // Nullable if not all users will sign in with Google
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 3. Setup Arctic

1.  Install the `arctic` library:

    ```bash
    npm install arctic
    ```

2.  Initialize the Google provider with your client ID, client secret, and redirect URI. This typically goes into a server-side file, e.g., `src/lib/server/oauth.ts`.

    ```typescript
    // src/lib/server/oauth.ts
    import { Google } from 'arctic';
    import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';

    export const google = new Google(
    	GOOGLE_CLIENT_ID,
    	GOOGLE_CLIENT_SECRET,
    	'http://localhost:5173/login/google/callback'
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
import { generateState, generateCodeVerifier } from 'arctic';
import { google } from '$lib/server/oauth';
import { redirect } from '@sveltejs/kit';

import type { RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent): Promise<Response> {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const url = await google.createAuthorizationURL(state, codeVerifier, {
		scopes: ['openid', 'profile', 'email'] // Request email scope
	});

	event.cookies.set('google_oauth_state', state, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10, // 10 minutes
		sameSite: 'lax'
	});
	event.cookies.set('google_code_verifier', codeVerifier, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10, // 10 minutes
		sameSite: 'lax'
	});

	throw redirect(302, url.toString());
}
```

## 6. Validate Callback API Route

Create an API route to handle the OAuth callback from Google, e.g., `routes/login/google/callback/+server.ts`. This route validates the state and code verifier, exchanges the authorization code for tokens, decodes the ID token to get user information, and handles user creation/login and session management.

```typescript
// routes/login/google/callback/+server.ts
import { google } from '$lib/server/oauth';
import { PrismaClient } from '@prisma/client'; // Assuming Prisma is set up
import { redirect } from '@sveltejs/kit';
import { decodeIdToken } from 'arctic';

import type { RequestEvent } from '@sveltejs/kit';
import type { OAuth2Tokens } from 'arctic';

const prisma = new PrismaClient();

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('google_oauth_state') ?? null;
	const codeVerifier = event.cookies.get('google_code_verifier') ?? null;

	if (code === null || state === null || storedState === null || codeVerifier === null) {
		console.error('Missing code, state, storedState, or codeVerifier');
		throw redirect(302, '/login'); // Redirect to login on error
	}
	if (state !== storedState) {
		console.error('State mismatch');
		throw redirect(302, '/login'); // Redirect to login on error
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch (e) {
		console.error('Invalid code or client credentials', e);
		throw redirect(302, '/login'); // Redirect to login on error
	}

	const claims = decodeIdToken(tokens.idToken);
	const googleUserId = claims.sub;
	const username = claims.name;
	const email = claims.email; // Get email from claims

	// Find or create user in your database
	let user = await prisma.user.findUnique({
		where: { googleId: googleUserId }
	});

	if (!user) {
		// Check if a user with this email already exists (e.g., signed up with password)
		user = await prisma.user.findUnique({
			where: { email: email }
		});

		if (user) {
			// Link Google account to existing user
			user = await prisma.user.update({
				where: { id: user.id },
				data: { googleId: googleUserId }
			});
		} else {
			// Create new user
			user = await prisma.user.create({
				data: {
					googleId: googleUserId,
					email: email, // Ensure email is always set
					name: username
				}
			});
		}
	}

	// Session management (using your custom session functions)
	// Assuming you have functions like `createSession` and `setSessionCookie`
	// These would typically be in src/lib/server/auth.ts or similar
	// For demonstration, using placeholders for session handling
	const sessionToken = crypto.randomUUID(); // Generate a random session token
	const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 1 week expiration

	// TODO: Implement actual session creation and cookie setting logic
	// Example: await createSession(sessionToken, user.id, expiresAt);
	// Example: event.cookies.set('session_token', sessionToken, { httpOnly: true, path: '/', expires: expiresAt });

	// Placeholder for actual session creation and cookie setting
	event.cookies.set('session_token', sessionToken, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 60 * 24 * 7, // 1 week
		sameSite: 'lax'
	});

	throw redirect(302, '/');
}
```

## 7. Get the Current User (Server Load Function and Hooks)

You'll typically set up a server hook (`src/hooks.server.ts`) to validate the session and make user information available in `event.locals`.

```typescript
// src/hooks.server.ts
import { PrismaClient } from '@prisma/client';
import type { Handle } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const handle: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get('session_token');

	if (!sessionToken) {
		event.locals.user = null;
		return resolve(event);
	}

	// TODO: Implement actual session validation and user retrieval
	// For demonstration, a basic lookup
	const user = await prisma.user.findFirst({
		where: {
			// Assuming session token is directly stored or linked to user
			// In a real app, you'd likely have a Session model
			// For now, let's assume session_token is the user's ID for simplicity (not secure)
			// Or, more realistically, query a Session table by sessionToken and then get the user
			// This part needs to align with your custom auth's session management
		}
	});

	if (user) {
		event.locals.user = user;
	} else {
		event.locals.user = null;
		// Invalidate cookie if session is invalid
		event.cookies.delete('session_token', { path: '/' });
	}

	return resolve(event);
};

// In your +page.server.ts:
// import { redirect } from '@sveltejs/kit';
// import type { PageServerLoad } from './$types';

// export const load: PageServerLoad = async (event) => {
// 	if (!event.locals.user) {
// 		throw redirect(302, '/login');
// 	}
// 	return { user: event.locals.user };
// };
```

## 8. Sign Out

To sign out a user, invalidate their session and remove the session cookie. This can be done in a SvelteKit action.

```typescript
// routes/logout/+server.ts (or an action in +page.server.ts)
import { redirect } from '@sveltejs/kit';

import type { RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent): Promise<Response> {
	event.cookies.delete('session_token', { path: '/' }); // Clear the session cookie
	throw redirect(302, '/login'); // Redirect to login page
}

// Example usage in a Svelte page:
// <form action="/logout" method="GET">
//   <button type="submit">Sign out</button>
// </form>
```

### Research Findings and Updates:

- **Prisma Session Management**: A Prisma schema for session management could look like this:
```prisma
model Session {
  id        String   @id @default(cuid())
  userId    String
  expiresAt DateTime
  token     String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```
  Functions for session management would include:
  - `createSession(userId: string, expiresAt: Date, token: string)`: Inserts a new session record into the database.
  - `invalidateSession(sessionId: string)`: Deletes a session record.
  - `validateSession(token: string)`: Retrieves and validates a session, checking `expiresAt`.
- **Secure Session Token Generation**: For production, `crypto.randomUUID()` is generally acceptable for generating unique session IDs, especially when combined with secure storage and transmission (HTTP-only cookies, HTTPS). However, for enhanced security, consider using a cryptographically strong pseudo-random number generator to generate a longer, more complex token, or a library that handles secure token generation and management (e.g., `csrf` for CSRF tokens, `jsonwebtoken` for JWTs if using stateless sessions). The key is randomness and sufficient length to prevent brute-force attacks.
- **Error Handling and User Feedback**: Implement detailed error handling in the OAuth callback (`routes/login/google/callback/+server.ts`) to provide specific messages to the user. Instead of generic redirects to `/login`, redirect with query parameters (e.g., `/login?error=state_mismatch`) and display appropriate messages on the login page.
- **Production Environment Considerations for OAuth**: 
  - **Redirect URIs**: Ensure that the Google Cloud Console OAuth client configuration includes all production redirect URIs (e.g., `https://yourdomain.com/login/google/callback`) and that `http://localhost` is removed or only used for development environments.
  - **HTTPS**: All communication with Google's OAuth endpoints and your application should strictly use HTTPS.
  - **Client Secrets**: Store `GOOGLE_CLIENT_SECRET` securely in production environment variables, not directly in source code.
  - **App Verification**: Google requires app verification for applications accessing sensitive user data or exceeding certain usage limits. Plan for this process well in advance of production deployment.
  - **Domain Ownership Verification**: Verify domain ownership in Google Search Console for proper OAuth consent screen display.
  - **Separate Credentials**: Maintain distinct OAuth client IDs and secrets for development, staging, and production environments to prevent cross-environment issues and enhance security.
