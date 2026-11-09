# Quire — EF101-P15 Digital Library Management System

Circulation desk for a university library project. It stores titles separately from physical copies, issues one copy to one member, keeps the loan after the book is returned, and calculates fines from one configurable rule.

Course: EF-101 Fall 2026  
Project: EF101-P15  
Submission note: Week 13, Monday 9 November 2026 · group of 3

## Run it from GitHub

GitHub stores the code. It does not run a database app by itself, and GitHub Pages cannot host this project (the desk needs a server plus PostgreSQL).

### On your own computer

1. Install Node.js 22.
2. Clone the repository and enter the folder.
3. `npm install`
4. `npm run dev`
5. Open the address the terminal prints (port 8080).

If you do not set `DATABASE_URL`, the app uses an embedded PostgreSQL so nothing else has to be installed. That data is wiped when the dev server stops. For a database that keeps rows, create a Postgres database (Neon has a free tier), export `DATABASE_URL` to its connection string in the shell, then start the app again. Do not commit that URL.

### GitHub Codespaces

1. Push this project to a GitHub repository.
2. On the repo page: Code → Codespaces → Create codespace.
3. In the codespace terminal: `npm install` then `npm run dev`.
4. Codespaces will offer to open port 8080. Use that.

### What to click first

- Dashboard: total, available, issued, and overdue copies.
- Catalog: search *Feynman* or a copy id such as `C-00001`.
- Desk: use **Try in** to issue a copy, then look it up again. A second issue is rejected. **Try out** returns an overdue copy and leaves the loan on record.
- Members, Overdue, Holds, Reports (CSV), Fine rule, How it works.

## Data

| Table | What one row means |
| --- | --- |
| titles | The work (title, author, subject, optional ISBN) |
| copies | One physical object, id `C-00042` |
| members | Card id and display name |
| loans | One issue. `returned_on` is empty while it is out |
| fine_payments | Money recorded against a loan |
| holds | A wait for a title. Status changes; the row stays |
| settings | The only fine rule |

A copy is available when it has no loan with `returned_on` null. Index `loans_one_open_copy` blocks a second open loan for the same copy.

Fine, in `loan_accounts`:

```text
chargeable days = max(0, days past due − grace days)
fine = min(max fine, chargeable days × fine per day)
```

Default: 14-day loan, 1 grace day, PKR 20 per chargeable day, cap PKR 500.

Seed: 200+ well-known published titles compiled for this assignment. Values starting `DEM-` are synthetic ISBNs, not registered ones. Member names are fictional. Source list: `scripts/generate-library-seed.mjs`.

## Code map

- `migrations/0002_library.sql` — schema, seed, views
- `src/lib/library.functions.ts` — issue, return, search, fines, export
- `src/routes/` — one screen per file
- `src/routes/guide.tsx` — architecture, viva answers, limits

## Report checklist (write this yourselves)

The running app is the demo. The graded report is a separate document with the 12 sections in the brief: title page, problem, objectives, architecture, technology, data design, implementation, testing, screenshots, limitations, AI/tools disclosure, and a contribution table for exactly three members.

Suggested test cases to write up:

1. Search by author, subject, and copy id.
2. Issue an available copy. Confirm due date.
3. Issue the same copy again. Confirm it is rejected.
4. Return it. Confirm the loan is still in history with a return date.
5. Open an overdue row and check chargeable days against the formula.
6. Record a payment and confirm the balance drops.
7. Export the circulation CSV and confirm returned loans are in the file.

## Assistance

The application was drafted with Grok (xAI) using React, TanStack Start, Tailwind CSS, PostgreSQL, and Recharts. Disclose that in report section 11. Each member should be able to explain the screen they own.

## Group

| Member | What they implemented and can explain |
| --- | --- |
| | |
| | |
| | |
