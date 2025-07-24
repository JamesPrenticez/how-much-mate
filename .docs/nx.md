### Setup Monorepo

Protip: Use powershell

### CREATING A NEW NX MONOREPO (you probably don't need to do this.)

```bash
npx create-nx-workspace@latest <project-name>

NX   Let's create a new workspace [https://nx.dev/getting-started/intro]
√ Which stack do you want to use? · none
√ Package-based monorepo, integrated monorepo, or standalone project? · integrated
'git' is not recognized as an internal or external command,
operable program or batch file.
√ Which CI provider would you like to use? · skip
√ Would you like remote caching to make your build faster? · yes
√ Will you be using GitHub as your git hosting provider? · Yes
```

### App - FRONTEND - React

(React Tutorial)[https://nx.dev/getting-started/tutorials/react-monorepo-tutorial]

```bash
npm install --save-dev @nx/react
npx nx g @nx/react:application dice-magic-app --directory=apps/dice-magic/app
npx nx g @nx/react:application component-library --directory=apps/component-library/app
npx nx g @nx/react:application website-app --directory=apps/website/app
npx nx g @nx/react:application website-app --directory=apps/website/app
```


```bash
  npx nx g @nx/node:app scraper --directory=apps/scraper
```

### App - BACKEND - Express

```bash
npx nx add @nx/express
npx nx g @nx/express:app messenger-backend --directory=apps/messenger/backend
```

### App - BACKEND - Vanilla Node
```bash
nx g @nx/node:application dice-magic-server --directory=apps/dice-magic/server
```

### Libs

#### React Library

To generate a new React component library in the /libs directory we run:

```bash
  npx nx g @nx/react:library <your-lib-name> --directory=libs/shared/ui/<your-lib-name>
  npx nx g @nx/react:library components --directory=libs/shared/ui/components
  npx nx g @nx/react:library contexts --directory=libs/shared/ui/contexts
  npx nx g @nx/react:library stores --directory=libs/shared/ui/stores
  npx nx g @nx/react:library demo-casino --directory=libs/shared/ui/demo-casino < this is not suppose to be buildable
  npx nx g @nx/react:library theme --directory=libs/shared/ui/theme
```

Once the app has been generated go to the project.json file and update the "tags" property with the following:
"tags": ["scope:lobby"]

#### Node Library

To generate a new Node library in the /libs/rgs directory we run:

```bash
  npx nx g @nx/node:library <your-lib-name> --directory=libs/shared/<your-lib-name>
  npx nx g @nx/node:library events --directory=libs/shared/events
  npx nx g @nx/node:library models --directory=libs/shared/events
  npx nx g @nx/node:library utils --directory=libs/shared/utils
  npx nx g @nx/node:library websockets --directory=libs/shared/websockets

  npx nx g @nx/node:library dice-magic --directory=libs/dice-magic/handlers
  npx nx g @nx/node:library dice-magic --directory=libs/dice-magic/models

  npx nx g @nx/node:library dice-magic --directory=libs/dice-magic/ui/stores
  npx nx g @nx/node:library dice-magic --directory=libs/dice-magic/ui/contexts

```

```bash
  npx nx g @nx/js:lib db --directory=libs/db
```

Once the 'libs/shared/your-lib-name' file structure has been generated go to the project.json file and update the "tags" property ie "tags": ["scope:shared"]

```bash
# Shared Assets
npx nx g @nx/js:library shared-assets --directory=libs/shared/assets --unitTestRunner=vitest --bundler=none

# Shared UI components & layout - (React)
npx nx generate @nx/react:library shared-ui-components --directory=shared/ui/components --buildable
npx nx generate @nx/react:library shared-ui-layout --directory=shared/ui/layout --buildable

# Shared Models
npx nx g @nx/js:library shared-models --directory=libs/shared/models --unitTestRunner=vitest --bundler=none

# State Management - Redux Tool Kit
npx nx g @nx/js:library shared-models --directory=libs/shared/models --unitTestRunner=vitest --bundler=none
```

### Supabase Libs

```bash
# Authentication library
npx nx g @nx/node:library shared-supabase-auth --directory=libs/shared/supabase/auth --buildable

# Database interactions library
npx nx g @nx/node:library shared-supabase-db --directory=libs/shared/supabase/db --buildable

# Real-time subscriptions library
npx nx g @nx/node:library shared-supabase-realtime --directory=libs/shared/supabase/realtime --buildable
```

#### DEPLOYMENT

Make sure to use the nx-cloud ignore flag
