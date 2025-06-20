# CloudForge Open Source Mirror Frontend

It is the frontend of the CloudForge Open Source Mirror.

## Features

- SPA (Frontend routing)
- Search bar (Simple / RegExp mode)
- Quick Downloader
- Configuration Generator
- High performance in rendering large list page
- Adaptive dark theme
- Query Caching
- Small bundle size
- And many more...

## How to use

Fetch the dependencies.

```bash
pnpm install
```

Copy `.env` to `.env.local` and modify it.

```bash
cp .env .env.local
```

### Debug

You may want to change `MIRROR_BACKEND_SEPARATION` to `true`.

Then start the development server.

```bash
pnpm start
```

### Build

Build with this command.

```bash

pnpm build
```

You will get the `dist` folder. Upload it to your server.

### Demo site
https://mirrors.twentyone.top
