# GiveCheck DevOps Guide

How the CI/CD pipeline, testing, branching, and deployment work — and what you need to do as a developer.

---

## Overview

```
feature branch → push → CI runs (lint, typecheck, tests) → preview deploy → merge PR → production deploy
```

Everything is automated. Your job is: create a branch, make changes, push, open a PR, merge when green.

---

## Branching Strategy

### Branch naming
- `feat/short-description` — new feature
- `fix/short-description` — bug fix
- `content/short-description` — blog posts, copy changes, docs
- `infra/short-description` — CI, config, dependencies

### Rules
- `main` is always deployable. Never push directly to `main`.
- Every change goes through a PR, even small ones.
- PRs require CI to pass before merging.
- Delete branches after merge (GitHub does this automatically if configured).

---

## Working with Branches

### In Claude Code (terminal)
```bash
# Start new work
git checkout -b feat/add-widget

# Make changes, then commit
git add src/components/widget.tsx
git commit -m "feat: add widget component"

# Push and create PR
git push -u origin feat/add-widget
gh pr create --title "Add widget component" --body "Description here"

# Or use the /commit skill in Claude Code to auto-generate commit messages
```

### In Cursor / VS Code
1. Click branch name in bottom-left → "Create new branch"
2. Make changes, stage in Source Control panel
3. Commit with message
4. Click "Publish Branch" → open PR via GitHub extension or `gh pr create` in terminal

### In Codex / Antigravity / other AI tools
Same git workflow — the tools may handle branching differently but the process is:
1. Create branch from `main`
2. Make changes
3. Push and open PR
4. CI runs automatically
5. Merge when green

---

## What the CI Pipeline Does

When you push to a branch or open a PR, GitHub Actions runs this pipeline:

### For content-only changes (blog posts, docs, copy)
Files matching: `src/lib/blog-data.ts`, `docs/**`, `*.md`, static assets

| Step | Duration |
|------|----------|
| Lint | ~15s |
| Typecheck | ~20s |
| Deploy preview | ~90s |
| **Total** | **~2 min** |

No tests run. Just validates the code compiles and deploys a preview.

### For UI/component changes
Files matching: `src/components/**`, `src/app/**/page.tsx`, `globals.css`

| Step | Duration |
|------|----------|
| Lint | ~15s |
| Typecheck | ~20s |
| Unit tests | ~30s |
| Deploy preview | ~90s |
| E2E tests (vs preview) | ~120s |
| **Total** | **~4-5 min** |

### For API/DB/infrastructure changes
Files matching: `src/app/api/**`, `src/db/**`, `src/middleware.ts`, `src/lib/**`

| Step | Duration |
|------|----------|
| Lint | ~15s |
| Typecheck | ~20s |
| Unit tests | ~30s |
| Integration tests (Neon branch) | ~60s |
| Deploy preview | ~90s |
| E2E tests (vs preview) | ~120s |
| **Total** | **~5-6 min** |

A Neon database branch is created for integration tests, seeded with test data, and torn down after.

---

## How to Add a Blog Post

The simplest change. No tests needed.

```bash
# 1. Create branch
git checkout main && git pull
git checkout -b content/new-blog-post

# 2. Edit blog data
# Add your post object to src/lib/blog-data.ts

# 3. Commit and push
git add src/lib/blog-data.ts
git commit -m "content: add blog post about X"
git push -u origin content/new-blog-post

# 4. Open PR
gh pr create --title "Add blog post: X" --body "New blog post about X"

# 5. CI runs lint + typecheck + preview deploy (~2 min)
# 6. Check preview link, merge when satisfied
```

---

## How to Make a Database Schema Change

The most dangerous change. Follow this exactly.

```bash
# 1. Create branch
git checkout main && git pull
git checkout -b feat/add-user-preferences

# 2. Edit schema
# Modify src/db/schema.ts

# 3. Generate migration
npx drizzle-kit generate

# 4. Review the generated SQL in drizzle/ directory
# READ THE SQL. Make sure it won't drop data.

# 5. Test locally against your dev Neon branch
npx drizzle-kit migrate

# 6. Commit everything
git add src/db/schema.ts drizzle/
git commit -m "feat: add user preferences table"
git push -u origin feat/add-user-preferences

# 7. CI creates a Neon branch, runs migration + tests against it
# 8. Review PR carefully — migration SQL is the most critical part
# 9. After merge, migration runs against prod automatically
```

### Schema change safety rules
- **Never** use `drizzle-kit push` in production — it does destructive sync
- **Never** drop a column directly — use expand-and-contract:
  1. Deploy: add new column, backfill data
  2. Deploy: update code to use new column
  3. Deploy: remove old column
- **Always** test migration on a Neon branch first
- **Always** have a rollback plan (write the reverse SQL before applying)

---

## Environments

| Environment | Database | Stripe | Clerk | URL |
|-------------|----------|--------|-------|-----|
| **Local dev** | Neon `dev` branch | Test mode keys | Test mode | `localhost:3000` |
| **PR preview** | Neon `staging` branch (or per-PR branch) | Test mode keys | Test mode | `*.vercel.app` |
| **Production** | Neon `main` branch | Live mode keys | Live mode | `givecheck.org` |

### Environment variables
- **Local:** `.env.local` (git-ignored, never committed)
- **Preview:** Set in Vercel project settings under "Preview" environment
- **Production:** Set in Vercel project settings under "Production" environment

To check which vars are set:
```bash
vercel env ls
```

To add a new env var:
```bash
# Or use the Vercel dashboard
vercel env add VARIABLE_NAME
```

---

## How to Run Tests Locally

```bash
# Unit tests (fast, no DB needed)
npm run test:unit

# Integration tests (needs DATABASE_URL pointing to dev Neon branch)
npm run test:integration

# E2E tests (needs local dev server running)
npm run dev &
npm run test:e2e

# All tests
npm test
```

---

## How to Debug a Failed CI Run

1. Go to the PR on GitHub → click "Details" next to the failed check
2. Read the error log — it tells you exactly which step and which test failed
3. Common failures:
   - **Lint:** Run `npx eslint . --fix` locally
   - **Typecheck:** Run `npx tsc --noEmit` locally to see the error
   - **Test:** Run the specific test locally: `npx vitest run path/to/test.ts`
   - **E2E:** Check the Playwright HTML report (uploaded as CI artifact)

---

## How to Handle a Production Incident

1. **Don't panic.** Vercel keeps previous deployments. You can instantly roll back:
   ```bash
   # List recent deployments
   vercel ls

   # Roll back to previous deployment
   vercel rollback
   ```

2. **If it's a DB issue:**
   - Neon has point-in-time restore (free tier: last 24 hours)
   - Go to Neon dashboard → your project → "Restore" → pick a timestamp

3. **If it's an API error:**
   - Check Sentry for the stack trace
   - Check Vercel function logs: `vercel logs --follow`

4. **Fix forward, don't revert if possible:**
   - Create a `fix/` branch, fix the issue, push, fast-track the PR

---

## Cost Summary

All free to start. First upgrade needed: Neon Launch ($19/mo) for staging branches.

| Service | Free Tier Limit | Upgrade Trigger | Cost |
|---------|----------------|-----------------|------|
| Neon | 0.5 GB, 1 branch | Staging branches or >0.5 GB | $19/mo |
| Clerk | 10k MAU | >10k users | $25/mo |
| Vercel | 100 GB BW, 6k build mins | Team features | $20/mo |
| GitHub Actions | 2000 mins/mo | Unlikely to exceed | Free |
| Upstash Redis | 10k cmds/day | High traffic | $2/mo |
| Sentry | 5k errors/mo | High error volume | $26/mo |

**Estimated monthly at launch: $0–19.** Scale to ~$50-70/mo with moderate traffic.

---

## Quick Reference

| I want to... | Do this |
|--------------|---------|
| Start new feature | `git checkout -b feat/name` |
| Add a blog post | Branch `content/name`, edit `blog-data.ts`, PR |
| Change DB schema | Branch, edit schema, `drizzle-kit generate`, review SQL, PR |
| Run tests locally | `npm test` |
| Check CI status | GitHub PR page → status checks |
| Deploy to prod | Merge PR to `main` (automatic) |
| Roll back prod | `vercel rollback` |
| Check prod errors | Sentry dashboard or `vercel logs` |
| Add env var | `vercel env add NAME` or Vercel dashboard |
| See what's deployed | `vercel ls` |
