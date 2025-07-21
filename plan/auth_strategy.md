# Authentication Strategy

**Decision:** The project will *not* use the Lucia Auth package for authentication.

**Reasoning:**
The existing custom authentication implementation in `src/lib/server/auth.ts` will be maintained. The database interactions within this custom authentication logic will be migrated from Drizzle ORM to Prisma ORM.

**Reference:**
Conceptual understanding of session management can be derived from Lucia Auth documentation (e.g., https://lucia-auth.com/sessions/basic), but the `lucia` package itself will not be installed or used as a dependency.