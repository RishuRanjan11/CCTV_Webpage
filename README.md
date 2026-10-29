# CCTV Digital Surveillance Store

This repository contains a React storefront and an Express/MongoDB API. For a free demo deployment, the Render web service serves both the built frontend and API from one URL. Keeping them on the same origin is important because authentication uses secure, HTTP-only cookies.

## Run locally

1. Install dependencies from the repository root:

   ```sh
   npm ci --prefix Backend
   npm ci --prefix Frontend
   ```

2. Create a root-level `.env` file with the environment variables listed below. Keep this file private; it is ignored by Git.

3. In one terminal, start the API:

   ```sh
   npm start --prefix Backend
   ```

4. In another terminal, start the React app:

   ```sh
   npm start --prefix Frontend
   ```

The local frontend is at `http://localhost:3000` and the API is at `http://localhost:5000`. Create a production frontend build with `npm run build`.

## Free demo deployment on Render

The checked-in [render.yaml](./render.yaml) defines a free Render web service that builds the frontend, starts the API, and serves both from the same host. Render assigns the public `onrender.com` URL; no custom domain is required.

### 1. Prepare the free-tier services

- Create a MongoDB Atlas free M0 cluster and a database user. Add the outbound IP ranges shown in the Render service settings to the Atlas network access list. Avoid opening Atlas to all IPs unless you understand and accept that exposure.
- Create free-tier Cloudinary and Resend accounts. Verify a domain you own in Resend, then set `SENDER_EMAIL` to an address at that verified domain. Resend's test sender is restricted to testing and cannot send signup OTPs to arbitrary recipients.
- Product images are stored with Cloudinary; do not rely on the Render service's local disk for persistent uploads. Product images are limited to 7 MB so the base64 upload stays within the API request limit.

### 2. Deploy the Render Blueprint

1. Push this repository to GitHub.
2. In Render, choose **New → Blueprint**, connect this repository, and select the branch to deploy.
3. Review the `cctv-storefront` web service from `render.yaml`. Provide the values for the prompted secret variables, then deploy.
4. If the Blueprint prompts for any variables after deployment, add them in the Render service's **Environment** page and redeploy.

Set these variables in Render:

| Variable | Value |
| --- | --- |
| `MONGO_URI` | Atlas connection URI prefix ending in `/`, e.g. `mongodb+srv://USER:URL_ENCODED_PASSWORD@HOST/`. Keep the database name out of this value. |
| `DB_NAME` | Database name; defaults to `cctv_store` in the Blueprint. |
| `ACCESS_TOKEN_SECRET` | A long, random secret unique to this deployment. |
| `REFRESH_TOKEN_SECRET` | A different long, random secret. |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name. |
| `CLOUDINARY_API_KEY` | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret. |
| `RESEND_API_KEY` | Resend API key used to send OTP and password-reset email. |
| `SENDER_EMAIL` | Verified sender address for Resend. |

Generate each token secret independently with:

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Render supplies `PORT` and `RENDER_EXTERNAL_URL`. The app uses the latter for password-reset links. If you later attach a custom domain, set `FRONTEND_DOMAIN_NAME` to its full HTTPS origin (without a trailing slash). Never commit secret values or upload the local `.env` file to Git.

Check `https://<your-service>.onrender.com/health` after deployment; it should return `{"status":"ok"}`. Then test the storefront, product listing, signup/login, email OTP, and image upload using real accounts and provider credentials.

### Free-tier limitations

Render's free web services spin down after 15 minutes without traffic and can take about a minute to wake. They have ephemeral filesystems and limited monthly usage, so this is appropriate for a demo, not a production storefront. MongoDB Atlas M0 also has a small storage limit. Check each provider's current quotas and terms before launch; free tiers and limits can change.

## Environment variables

The backend reads a root `.env` file for local development and environment variables for hosted deployments:

```text
MONGO_URI=
DB_NAME=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=
SENDER_EMAIL=
FRONTEND_DOMAIN_NAME=http://localhost:3000
```

`FRONTEND_DOMAIN_NAME` is optional locally and in Render. For local email links, set it to `http://localhost:3000`; in Render it defaults to the service URL.
