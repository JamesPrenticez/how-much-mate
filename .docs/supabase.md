# Supabase

(Docs - Setup)[https://supabase.com/dashboard/project/hkhdwtuibhdthoccbmsh]
(Docs - Websockets)[https://supabase.com/docs/guides/functions/websockets?queryGroups=runtime&runtime=node]
(Tutorial)[https://medium.com/@heshramsis/building-a-crud-app-with-supabase-and-express-a-step-by-step-guide-for-junior-developers-81456b850910]
(Real Time Messenging App with React and Supabase)[https://github.com/shwosner/realtime-chat-supabase-react]

### Install

```basg
  npm install supabase --save-dev
  npm update supabase --save-dev
```

### Clean up before upgrading

If you have any Supabase containers running locally, stop them and delete their data volumes before proceeding with the upgrade. This ensures that Supabase managed services can apply new migrations on a clean state of the local database.

```
supabase db diff -f my_schema
supabase db dump --local --data-only > supabase/seed.sql
supabase stop --no-backup
```

### AI Generated Guide:

1. Generate a Shared Library

Run the following Nx command to create a shared library:

```bash
  nx generate @nx/js:library supabase-auth --directory=shared --buildable
```

This creates a library in libs/shared/supabase-auth.

2. Install Supabase Dependencies

Install the necessary Supabase client packages:

```bash
  npm install @supabase/supabase-js
```

3. Create the Supabase Client

Inside the newly created library, add a file to initialize and export the Supabase client:

```ts
// libs/shared/supabase-auth/src/lib/supabase-client.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NX_SUPABASE_URL || 'your-supabase-url';
const SUPABASE_ANON_KEY = process.env.NX_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

4. Add Authentication Utility Functions

Create utility functions to handle authentication logic (e.g., sign-in, sign-out, user session):

```ts
// libs/shared/supabase-auth/src/lib/auth.ts
import { supabase } from './supabase-client';

export const signInWithEmail = async (email: string, password: string) => {
  const { user, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getUser = () => supabase.auth.getUser();
```

5. Expose Public API
   Update the library's index.ts file to export the client and utilities:

```ts
// libs/shared/supabase-auth/src/index.ts
export * from './lib/supabase-client';
export * from './lib/auth';
```

6. Configure Environment Variables

Add Supabase environment variables to your root .env file or use per-app .env files:

```env
NX_SUPABASE_URL=https://your-supabase-url.supabase.co
NX_SUPABASE_ANON_KEY=your-anon-key
```

7. Use the Library in Apps

In your apps, import and use the shared library for authentication:

```ts
// Example: apps/my-app/src/app/login.tsx
import { signInWithEmail, getUser, signOut } from '@myorg/shared/supabase-auth';

const handleLogin = async () => {
  try {
    const user = await signInWithEmail('user@example.com', 'password');
    console.log('Logged in:', user);
  } catch (error) {
    console.error('Login failed:', error.message);
  }
};
```

8. Add the Library as a Dependency

Make sure the apps explicitly depend on the library:

```bash
nx generate @nx/workspace:dependency-migration
```

This setup ensures all apps in your monorepo have access to a shared Supabase authentication system. If you need additional functionality, extend the shared library!

**_You said:_**
do we need docker to run this locally? or is there a way to do this with sqlite?

**_ChatGPT said:_**
You don't need Docker to run this locally. Supabase supports using SQLite as a local database when using the Supabase CLI. Here’s how you can run Supabase locally without Docker:

1. Install Supabase CLI
   First, install the Supabase CLI, which allows you to run Supabase locally without Docker. Follow the installation steps from the official Supabase CLI docs.

For example, on macOS with Homebrew:

```bash
brew install supabase/tap/supabase
```

Or download it for your platform from the Supabase CLI releases.

2. Initialize a Supabase Project

Run the following command in your project directory to set up Supabase locally:

```bash
supabase init
```

This creates a supabase folder with necessary configurations.

3. Start Supabase Locally with SQLite

To use SQLite as your local database, pass the --use-simple flag:

```bash
supabase start --use-simple
```

This avoids running a full PostgreSQL instance and uses SQLite instead for local development.

4. Set Environment Variables

Make sure your .env file or environment variables are configured to point to your local Supabase setup:

```env
NX_SUPABASE_URL=http://localhost:54321
NX_SUPABASE_ANON_KEY=your-local-anon-key
NX_SUPABASE_SERVICE_ROLE_KEY=your-local-service-role-key
The NX_SUPABASE_URL points to the local Supabase API (default: http://localhost:54321).
```

You can find the keys in the supabase/config.toml file or by running:

```bash
supabase status
```

5. Develop and Test Locally

Once Supabase is running, your apps can interact with the local Supabase instance just like they would with a hosted instance. The Supabase client will connect to your local API using the URL and keys you provided.

6. Switch to Hosted for Production

When deploying to production, simply change the environment variables (NX_SUPABASE_URL and keys) to point to your hosted Supabase instance.

This approach provides flexibility for local development without needing Docker, while still allowing seamless integration with a hosted Supabase setup.
