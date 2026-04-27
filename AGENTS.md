<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Development workflow — read this before writing any code

## Git discipline

1. **Check current branch first.** Before making any changes, run `git status` and `git branch`. If you're on `main`, stop and create a feature branch: `git checkout -b feat/<short-description>`.
2. **One concern per PR.** Schema migrations, route changes, and page rewrites are separate PRs. If a PR title needs "and" more than once, split it.
3. **Migration commits are always standalone.** `drizzle-kit push` runs happen in a commit by itself before any code that relies on the new columns.
4. **Never commit directly to `main`.** main is Vercel production. All work goes through feature branches → PR → merge.

## Feature flags (test vs prod data)

- Real data vs mock data is controlled by `src/lib/flags.ts` (import `flags`).
- Local dev: `.env.local` sets `NEXT_PUBLIC_REAL_DATA=false` by default — mocks render.
- Vercel preview branches: can set `NEXT_PUBLIC_REAL_DATA=true` to test live data before merging.
- **Never rewrite a page to real-data-only.** Always keep a mock fallback behind `if (flags.realXxx) { ... } else { return MOCK }`.

## Scope rules for each session

- Aim for PRs < 400 lines of diff.
- If a task feels like it requires changes in > 5 files, propose splitting it before starting.
- Architecture changes (schema, new libs) land first; UI wiring lands after they're confirmed live.

## Karpathy principles (from CLAUDE.md inherited values)

1. **Think before coding** — read related files, understand the full context, before writing a line.
2. **Prefer simplicity** — reach for the simplest working solution, not the most complete one.
3. **Surgical changes only** — edit the minimum viable set of files; do not refactor adjacent code unless asked.
4. **Verifiable goal per task** — every task ends with a concrete test you can run (curl, browser check, unit assertion) to confirm it worked.

## Every session should start with

```bash
git status           # confirm clean / which branch
git log --oneline -5 # understand recent history
```

Then read `docs/todos.md` to understand current P-phase priorities.

## Story format

Each user story lives in `docs/stories/`. Format:

```md
# Story: <short title>
**As a** <user type>, **I want** <action>, **so that** <outcome>.

## Acceptance criteria
- [ ] ...

## Test plan
- curl / browser step
- Expected response

## Scope
Files changed: ...
```

Reference the story in the PR description.
