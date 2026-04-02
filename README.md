This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## DocuSign embedded signing scaffold

A starter embedded-signing flow now exists at `/logged-in/docusign`.

What it currently does:

- Uses server-side JWT auth against DocuSign.
- Creates a demo HTML agreement on the fly.
- Creates an embedded recipient view.
- Opens DocuSign focused view inside the app.
- Stores envelope metadata in Firestore when the signing session starts.
- Updates the Firestore record again when the signing session ends in the browser.

Firestore structure:

- `docusignEnvelopes/{envelopeId}` stores the top-level envelope record.
- `users/{uid}/docusignEnvelopes/{envelopeId}` stores a per-user copy for easier account views.

Environment setup:

1. Copy `.env.example` to `.env.local`.
2. Configure Firebase web app keys for the browser.
3. Configure Firebase Admin credentials for server-side Firestore writes using one of these options:
   - `FIREBASE_ADMIN_SERVICE_ACCOUNT_PATH`
   - `FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON`
   - `FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64`
   - `FIREBASE_ADMIN_PROJECT_ID` + `FIREBASE_ADMIN_CLIENT_EMAIL` + `FIREBASE_ADMIN_PRIVATE_KEY`
   - `GOOGLE_APPLICATION_CREDENTIALS`
4. Fill in `DOCUSIGN_INTEGRATION_KEY`, `DOCUSIGN_USER_ID`, `DOCUSIGN_CONSENT_REDIRECT_URI`, and `DOCUSIGN_SIGNING_RETURN_URL`.
5. Add your DocuSign private key using one of the supported options:
   - `DOCUSIGN_PRIVATE_KEY_PATH` is the cleanest option for local development.
   - `DOCUSIGN_PRIVATE_KEY` works if you store the PEM with `\n` line breaks.
   - `DOCUSIGN_PRIVATE_KEY_BASE64` is useful if your deploy platform handles multiline secrets poorly.
6. Optionally set `DOCUSIGN_ACCOUNT_ID` if your user can access more than one DocuSign account.
7. Optionally set `DOCUSIGN_ALLOWED_ORIGINS` if you need extra allowed iframe origins beyond the current request origin.

Local URLs currently scaffolded:

- Consent callback: `http://localhost:3000/ds/callback`
- Embedded signing return: `http://localhost:3000/signing-complete`

Important notes:

- The app runtime needs your RSA private key, not the public key. The public key should stay registered in DocuSign under Apps and Keys.
- JWT auth also requires one-time consent for the impersonated user. The scaffold exposes a consent link from `/api/docusign/config` and the `/logged-in/docusign` page.
- `DOCUSIGN_CONSENT_REDIRECT_URI` must match a redirect URI registered on your DocuSign integration key.
- `DOCUSIGN_SIGNING_RETURN_URL` is used for the embedded signer `returnUrl`.
- Firestore writes now happen on the server after verifying the user's Firebase ID token.
- Browser return events are useful, but they are not a replacement for DocuSign webhooks if you need authoritative signed, declined, or completed status.
- The current scaffold uses a generated demo document. Swap `src/lib/docusign/esign.js` to use a template, stored PDF, or custom agreement generator when you are ready.

## Firebase setup

This project uses the Next.js App Router under `src/app`, so the cleanest Firebase database setup is a shared client initializer plus a Firestore helper.

1. Install the Firebase SDK:

```bash
npm install firebase
```

2. Copy `.env.example` to `.env.local` and replace the placeholders with your Firebase web app config from the Firebase console.

3. Import the shared Firestore helper from `src/lib/firebase/firestore.js` anywhere you need to read or write Firestore data in a client component.

Example:

```js
'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { getDb } from '@/lib/firebase/firestore';

export default function ExampleList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function loadItems() {
      const snapshot = await getDocs(collection(getDb(), 'items'));
      setItems(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }

    loadItems();
  }, []);

  return <pre>{JSON.stringify(items, null, 2)}</pre>;
}
```

If you meant Firebase Realtime Database instead of Firestore, the app initializer in `src/lib/firebase/client.js` still stays the same and only the database helper/imports change.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app) from the creators of Next.js.

Check out [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
