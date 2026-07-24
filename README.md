# Zihad Hasan - Personal Portfolio & Platform

![Project Status](https://img.shields.io/badge/status-active-success.svg)

A high-performance codebase powering the personal portfolio of Zihad Hasan. Built with Next.js 15, React 19, and Firebase.

## Features

- Static Export Architecture: uses `output: 'export'` for static hosting on Firebase Hosting. Content is pre-rendered at build time.
- Modern Tech Stack: TypeScript, Tailwind CSS v4, Framer Motion.
- CMS Architecture: domain-driven services for managing courses, books, events, blog, shop, and users.
- Firestore Security Rules: role-based access control enforced server-side via `firestore.rules`.

## Technology Stack

- Framework: [Next.js 15 (App Router)](https://nextjs.org)
- Language: [TypeScript](https://www.typescriptlang.org)
- Styling: [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- Animation: Framer Motion
- Backend: Firebase (Firestore, Auth)
- Media: Cloudinary (image hosting and delivery)
- Deployment: Firebase Hosting

## Architecture Highlights

- Service-Oriented Core: domain-specific services (`UserService`, `ProjectService`, `EventService`, etc.) instead of one monolithic CMS layer, for better separation of concerns and tree-shaking.
- Deterministic Document IDs: uses a `userId_resourceId` pattern for registrations, enabling direct security-rule lookups without extra queries.
- Facade Pattern: `cms-service.ts` re-exports the individual services under one import for pages that don't need per-domain granularity.

## Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── (public)/         # Public-facing pages (home, blog, courses, etc.)
│   ├── (admin)/          # Admin dashboard
│   └── layout.tsx        # Root layout with providers
├── components/
│   ├── home/             # Home page sections
│   ├── admin/            # Admin dashboard components
│   ├── shared/            # Shared cross-page components
│   ├── ui/                # Reusable UI primitives (buttons, inputs, etc.)
│   └── providers/         # Global providers (theme, auth, settings)
└── lib/
    ├── services/          # Domain-driven business logic
    │   ├── blog-service.ts
    │   ├── event-service.ts
    │   └── ...
    ├── firebase.ts         # Firebase client initialization
    ├── format.ts           # Locale-aware currency/date formatting
    └── cms-service.ts      # Facade re-exporting the individual services
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or pnpm
- A Firebase project (Firestore + Authentication enabled)
- A Cloudinary account (for image uploads)

### Installation

```bash
git clone https://github.com/zihaaaad/zihadhasan.git
cd zihadhasan
npm install
```

### Environment Setup

Create a `.env.local` file in the project root. These values are required for the app to build and run; none of them should be committed to version control.

```env
# Firebase (Firebase Console > Project Settings > General > Your apps > SDK setup and config)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Cloudinary (Cloudinary dashboard)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=

# Optional - Firebase App Check (get a reCAPTCHA v3 site key from
# google.com/recaptcha/admin, then register the same key under
# Firebase Console > App Check for this project)
NEXT_PUBLIC_RECAPTCHA_KEY=

# Optional - EmailJS, used for registration-approval and contact-form emails
# (get these after setting up a service + template at emailjs.com)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Deployment

This project deploys to Firebase Hosting as a static export.

```bash
npm run build
firebase deploy --only hosting,firestore:rules,firestore:indexes
```

The build output is written to the `out/` directory, which `firebase.json` points to as the hosting root.

A GitHub Actions workflow (`.github/workflows/build.yml`) runs a production build on every push and pull request to `main`, so a broken build is caught before it's manually deployed. It needs the same environment variables as local development added as repository secrets (Settings > Secrets and variables > Actions).

## Security

- Access control is enforced through `firestore.rules`; review that file for the current rule set before changing collection schemas.
- Firebase App Check is wired up in `src/lib/firebase.ts` and activates automatically once `NEXT_PUBLIC_RECAPTCHA_KEY` is set - get a reCAPTCHA v3 site key from `google.com/recaptcha/admin` and register the same key under Firebase Console > App Check for this project. Without it, public write endpoints (`/messages`, `/subscribers`) are only protected by requiring sign-in.

## Email Notifications

Registration approvals and contact form submissions can send real email via [EmailJS](https://www.emailjs.com), which is safe to call directly from the browser (no secret key involved) - a fit for this project's static-export, no-backend architecture. Configure `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`, and `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` to enable it. Until then, registration approvals still create an in-app notification, and the contact form falls back to opening the visitor's own mail client.

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m "Add your feature"`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a pull request.

## License

No license file is currently included in this repository. Add a `LICENSE` file if you intend to open-source this project under a specific license.
