# OmniHook Backend

This backend validates Whop license keys using a secret server-side Whop API token.
The Framer plugin sends the license key and device ID to this backend over HTTPS, and the backend makes the Whop API call securely.

## Setup

1. Install dependencies:

```bash
cd backend
npm install
```

2. Create a `.env` file from `.env.example` and set your Whop secret:

```bash
cp .env.example .env
# then edit .env and set WHOP_API_TOKEN
```

3. Run the backend:

```bash
cd backend
npm run dev
```

## Configuration

The backend expects:

- `WHOP_API_TOKEN` — your Whop bearer token stored only on the server
- `PORT` — optional HTTP port (default: `3000`)

## License validation endpoint

- POST `/validate-license`
- Request body:
  - `licenseKey` (string)
  - `deviceId` (string)

Response example:

```json
{ "status": "valid" }
```

or

```json
{ "status": "invalid", "message": "License key is inactive or expired." }
```

## Build plugin with backend URL

When building the Framer plugin, set `VITE_BACKEND_URL` to your backend URL:

```bash
set VITE_BACKEND_URL=http://localhost:3000 && npm run build
```

In production, use your HTTPS backend URL and make sure the token is rotated immediately after revocation.

## Deploying to Vercel

This repository includes a `vercel.json` file to deploy the backend as a serverless function.

1. Connect this GitHub repo to Vercel.
2. In Vercel, set the environment variable:
   - `WHOP_API_TOKEN`
3. Deploy the project.

If you want to test locally with Vercel's CLI, you can run:

```bash
npm install -g vercel
vercel dev
```

Then build the plugin against the local backend:

```bash
set VITE_BACKEND_URL=http://localhost:3000 && npm run build
```
