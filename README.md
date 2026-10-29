<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/d6d0ca04-89d1-45df-b14c-de62c5af3d30

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Booking QR workflow limitations

The current project is a browser-only demo. Booking, delivery, and notification data are stored in `localStorage`; QR checks run in the client and are not authenticated by a server or persisted in a database. The handover/return screens demonstrate the intended role flow, but their results are not authoritative and must not be used for real custody verification. A production deployment needs server-side identity, booking storage, atomic QR verification, and notification handling before these workflows can be trusted.
