# Dev Issues — Security

**Status: RESOLVED 2026-09-16.** `npm audit` reports 0 vulnerabilities.

---

## What the original report said, and why it was wrong

The first pass at this file blamed a stale `package-lock.json`:

> `package.json` pins `"next": "^15.5.9"`, but `package-lock.json` has an older resolved
> version installed.

That was not the case. `package-lock.json` already resolved `next@15.5.25`, and the
recommended fix (`npm update next react react-dom`) would have changed nothing for 83 of
the 87 alerts.

Querying the alerts directly showed the real split:

```
$ gh api repos/zihaaaad/zihadhasan/dependabot/alerts --paginate \
    -q '.[] | select(.state=="open") | .dependency.manifest_path' | sort | uniq -c
      4 package-lock.json
     83 pnpm-lock.yaml
```

**The repo carried two lockfiles.** `pnpm-lock.yaml` was committed back in February
(`bbb315c`, 2026-02-20), was never updated again, and still pinned `next@15.5.9` plus a
whole dependency tree seven months out of date. Nothing in the project uses pnpm — the
build script, the scripts in `package.json`, and every install run use npm. Dependabot
does not care about that; it scans every manifest it finds, so the orphaned file was
generating alerts for packages that are not installed and never were.

That accounts for all four "critical" findings (`next` x2, `protobufjs`,
`websocket-driver`) and all but four of the rest.

## The four real ones

All four genuine alerts were the same package, reached through Next.js:

| Path | Version | Status |
|---|---|---|
| `node_modules/postcss` | 8.5.28 | already patched |
| `node_modules/next/node_modules/postcss` | **8.4.31** | vulnerable |

Next.js pins `postcss` to an exact `8.4.31`, so the top-level upgrade never reached it.
The four advisories (arbitrary `.map` file read via attacker-controlled
`sourceMappingURL`, path traversal in source-map auto-loading, and XSS via unescaped
`</style>` in stringify output) are all patched by 8.5.23 or earlier.

Worth keeping in perspective: postcss only runs at **build time**, over CSS in this
repo. None of it is reachable by a site visitor. It was still worth closing, because the
fix costs nothing.

## What was done

1. **Deleted `pnpm-lock.yaml`.** This is the fix for 83 of the 87 alerts. `package-lock.json`
   is the single source of truth.
2. **Added `packageManager: "npm@10.9.4"`** to `package.json` so the ambiguity cannot
   come back, and corrected the README, which said "npm or pnpm".
3. **Added an `overrides` entry for `postcss: "^8.5.28"`**, which collapses Next's pinned
   copy into the hoisted one. This was preferred over `npm audit fix --force`, whose only
   offer was `next@16.3.5` — a major upgrade this change does not need.

## Verification

```
npm audit                 0 vulnerabilities  (was 2 locally / 87 on Dependabot)
npx tsc --noEmit          clean
npm run build             49/49 pages, export OK
npm run verify:rules      12/12 passed
```

The postcss bump was checked for behavioural change by diffing the emitted CSS across
builds. All three stylesheets came out **byte-identical** — same content hashes, same
sizes, same filenames:

```
a4c9100b700ff089   4501 B  0298092ef2cfeefe.css
9ced0076453b6f05 125060 B  1ed7e445786c111d.css
0ea100e9d9a25086    837 B  29020d976a14cc16.css
```

## A note on how these CVEs map to this app

The original report suggested smoke-testing because "this app uses App Router + Server
Actions + Server Components — the exact features several of these CVEs target". That
overstates the exposure. This project is a **static export** (`output: 'export'` in
`next.config.ts`) served by Firebase Hosting:

- There is no Next.js server in production, so the middleware/proxy bypasses, SSRF in
  rewrites, connection-exhaustion DoS and Server Action CVEs have no running surface.
- There are no Server Actions. `src/actions/system.ts` is a plain client-side module
  despite the directory name — it has no `"use server"` directive.
- The Image Optimization API is disabled (`images.unoptimized: true`), which is forced by
  static export. That is what both "critical" `next` RCEs target.
- Server Components execute only during `npm run build`, on a trusted machine.

Keeping Next patched is still the right default, and it already is. But the practical
risk from the `next` advisories here was close to zero — which is worth knowing before
anyone reaches for a major-version upgrade over them.

## If alerts reappear

Dependabot rescans on push and may take a few minutes to close the 83 resolved ones.
Check the live list at:
https://github.com/zihaaaad/zihadhasan/security/dependabot

If a new lockfile for another package manager ever gets committed again, expect this
exact failure mode to return.
