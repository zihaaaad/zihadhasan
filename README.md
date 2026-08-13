# Zihad Hasan - Personal Portfolio & Platform

A high-performance codebase powering the personal portfolio of Zihad Hasan. Built with Next.js 15, React 19, and Firebase.

---

## Core Features

- **Static Export Architecture:** Utilizes `output: 'export'` for highly optimized static hosting on Firebase Hosting. Content is pre-rendered at build time.
- **Modern Technology Stack:** Developed using TypeScript, Tailwind CSS v4, and Framer Motion for a fluid, responsive user experience.
- **CMS Architecture:** Implements domain-driven services for managing distinct platform areas, including courses, books, events, blogs, a shop, and user profiles.
- **Firestore Security Rules:** Enforces strict role-based access control server-side via `firestore.rules`.

## Technology Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org)
- **Language:** [TypeScript](https://www.typescriptlang.org)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- **Animation:** Framer Motion
- **Backend:** Firebase (Firestore, Authentication)
- **Media Hosting:** Cloudinary
- **Deployment:** Firebase Hosting

---

## Architecture Highlights

- **Service-Oriented Core:** Business logic is isolated into domain-specific services (e.g., `UserService`, `ProjectService`, `EventService`) rather than a monolithic CMS layer, ensuring strong separation of concerns and improved tree-shaking.
- **Deterministic Document IDs:** Utilizes a `userId_resourceId` pattern for database entries (like registrations), enabling direct security-rule lookups without requiring extraneous database queries.
- **Facade Pattern:** Centralizes service imports via `cms-service.ts`, re-exporting individual services for pages that do not require granular, per-domain imports.

## Project Structure

```text
src/
├── app/                  # Next.js App Router
│   ├── (public)/         # Public-facing pages (home, blog, courses, etc.)
│   ├── (admin)/          # Admin dashboard
│   └── layout.tsx        # Root layout with providers
├── components/
│   ├── home/             # Home page sections
│   ├── admin/            # Admin dashboard components
│   ├── shared/           # Shared cross-page components
│   ├── ui/               # Reusable UI primitives
│   └── providers/        # Global context providers (theme, auth, settings)
└── lib/
    ├── services/         # Domain-driven business logic
    │   ├── blog-service.ts
    │   ├── event-service.ts
    │   └── ...
    ├── firebase.ts       # Firebase client initialization
    ├── format.ts         # Locale-aware currency/date formatting
    └── cms-service.ts    # Facade re-exporting the individual services
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or pnpm
- A configured Firebase project (Firestore + Authentication)
- A Cloudinary account

### Installation

```bash
git clone https://github.com/zihaaaad/zihadhasan.git
cd zihadhasan
npm install
```

### Environment Configuration

Create a `.env.local` file in the project root containing the following variables. Do not commit this file to version control.

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=

# Security & Notifications (Optional)
NEXT_PUBLIC_RECAPTCHA_KEY=
NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=
```

### Running Locally

```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the application.

---

## Deployment & Security

### Deployment
This project is configured to deploy to Firebase Hosting as a static export.

```bash
npm run build
firebase deploy --only hosting,firestore:rules,firestore:indexes
```

A GitHub Actions workflow (`.github/workflows/build.yml`) automates production builds on pushes and pull requests to the `main` branch. Ensure the required environment variables are added to the repository's GitHub Secrets.

### Security Implementation
- **Access Control:** Enforced strictly via `firestore.rules`.
- **App Check:** Integrated in `src/lib/firebase.ts`. It activates automatically when `NEXT_PUBLIC_RECAPTCHA_KEY` is provided, securing public write endpoints from abuse.

---

## License

No license file is currently included in this repository. Add a `LICENSE` file if you intend to open-source this project under a specific license.
