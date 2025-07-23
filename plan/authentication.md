# Authentication Strategy

## Decision

The project will **not** use the Lucia Auth package for authentication.

## Reasoning

The existing custom authentication implementation in `src/lib/server/auth.ts` will be maintained. The database interactions within this custom authentication logic will be migrated from Drizzle ORM to Prisma ORM.

## Reference

Conceptual understanding of session management can be derived from Lucia Auth documentation (e.g., [https://lucia-auth.com/sessions/basic](https://lucia-auth.com/sessions/basic)), but the `lucia` package itself will not be installed or used as a dependency.

### Research Findings and Updates:

- **Prisma Migration Plan**: Migrating from Drizzle ORM to Prisma ORM involves several steps:
  1. **Install Prisma CLI**: Add Prisma to the project dependencies.
  2. **Introspect Database**: Use `prisma db pull` to generate `schema.prisma` from the existing database schema defined by Drizzle.
  3. **Install and Generate Prisma Client**: Generate the Prisma client for type-safe database interactions.
  4. **Replace Drizzle Queries**: Update the custom authentication logic in `src/lib/server/auth.ts` to use Prisma Client queries instead of Drizzle ORM queries.
  This process assumes a direct mapping of the existing Drizzle schema to Prisma models. Any schema modifications or optimizations should ideally occur after the initial migration.
- **Custom Authentication Security Audit**: A security audit of the custom authentication logic should focus on:
  - **Input Validation**: Ensure all user inputs are properly sanitized and validated to prevent injection attacks (e.g., SQL injection if raw queries are used, though Prisma helps mitigate this).
  - **Password Hashing**: Verify strong, industry-standard hashing algorithms (e.g., bcrypt, Argon2) are used with appropriate salt and iterations. Avoid weak or outdated hashing methods.
  - **Session Management**: Implement secure session token generation (e.g., using cryptographically secure random strings or UUIDs), secure storage (HTTP-only cookies, encrypted database storage), and proper invalidation mechanisms (logout, token expiry, revocation).
  - **Rate Limiting**: Implement rate limiting on login attempts to mitigate brute-force attacks.
  - **Account Lockout**: Implement account lockout policies after multiple failed login attempts.
  - **Error Handling**: Ensure error messages do not leak sensitive information.
- **Google OAuth Integration with Custom Auth**: Integrating Google OAuth with the custom authentication system will involve:
  1. **OAuth Flow**: Redirect users to Google for authentication. Google returns an authorization code to a specified redirect URI.
  2. **Token Exchange**: Exchange the authorization code for access and ID tokens with Google's OAuth 2.0 endpoint from the backend.
  3. **User Identification**: Use the ID token to retrieve Google user information (e.g., `sub` for unique ID, `email`, `name`).
  4. **User Mapping**: Check if the Google user ID exists in the application's user database. If not, create a new user record, linking it to the Google ID. If it exists, retrieve the existing user.
  5. **Session Creation**: Create a new session for the user within the custom authentication system, generating a secure session token and storing it securely (e.g., in a Prisma-managed database table).
  6. **Production Considerations**: Ensure secure handling of client secrets, use HTTPS for all redirects, and comply with Google's OAuth 2.0 policies, including app verification and domain ownership. Implement separate OAuth credentials for development and production environments.
