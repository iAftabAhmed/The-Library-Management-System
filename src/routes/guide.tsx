import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHead } from "@/components/bits";
import { getSummary } from "@/lib/library.functions";

export const Route = createFileRoute("/guide")({
  loader: () => getSummary(),
  component: GuidePage,
});

function GuidePage() {
  const data = Route.useLoaderData();
  return (
    <AppShell>
      <PageHead
        title="How this system works"
        lede="Use this page for the report and the viva. It is written against the running database, not a slide."
      />
      <article className="grid max-w-3xl gap-8 text-sm leading-relaxed">
        <section>
          <h2 className="font-serif text-2xl font-semibold">Problem</h2>
          <p className="mt-2 text-pretty">
            A library that only stores “the book” cannot tell two shelf copies apart, so the same object can be promised to two people. Quire keeps the work, the physical copy, the member, and the transaction as separate records. Right now the database holds {data.titles} titles and {data.totalCopies} copies.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-semibold">Architecture</h2>
          <p className="mt-2 text-pretty">The browser never talks to the database. It calls server functions. Those functions run the SQL.</p>
          <ol className="mt-3 grid gap-2 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch">
            <li className="card p-3">
              <p className="text-xs font-semibold tracking-wide text-muted uppercase">Client</p>
              <p className="font-serif text-lg">Browser</p>
              <p className="text-muted">Desk, catalog, reports.</p>
            </li>
            <li className="hidden items-center text-muted md:flex" aria-hidden>→</li>
            <li className="card p-3">
              <p className="text-xs font-semibold tracking-wide text-muted uppercase">Server</p>
              <p className="font-serif text-lg">Server functions</p>
              <p className="text-muted">Check the rules, then write rows.</p>
            </li>
            <li className="hidden items-center text-muted md:flex" aria-hidden>→</li>
            <li className="card p-3">
              <p className="text-xs font-semibold tracking-wide text-muted uppercase">Database</p>
              <p className="font-serif text-lg">PostgreSQL</p>
              <p className="text-muted">Tables, the fine view, the unique index.</p>
            </li>
          </ol>
          <p className="mt-3 text-pretty text-muted">
            What is the client? The pages in the browser. What is the server? The functions in <span className="font-mono">src/lib/library.functions.ts</span>. What is the role of the database? It stores the rows and enforces “one open loan per copy” even if two people click Issue together. Does it need the internet? Only to load the typefaces. The data itself is on the app’s database. If that database is the embedded one used for a local run, disconnecting the internet does not wipe the open tab, but a new server cannot be reached.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-semibold">Data design</h2>
          <ul className="mt-2 grid gap-2">
            <li className="card p-3"><strong>titles</strong> — the work: title, author, subject, optional ISBN, year. One row for <em>Hamlet</em>, however many paperbacks you own.</li>
            <li className="card p-3"><strong>copies</strong> — one physical object. Primary key <span className="font-mono">C-00042</span>. Shelf code. This is the thing you hand to a person.</li>
            <li className="card p-3"><strong>members</strong> — card id and display name. Seed names are fictional.</li>
            <li className="card p-3"><strong>loans</strong> — one issue. Copy, member, issued date, due date, and <span className="font-mono">returned_on</span> which stays empty until the book comes back.</li>
            <li className="card p-3"><strong>fine_payments</strong> — money recorded against a loan. Not deleted when the book returns.</li>
            <li className="card p-3"><strong>holds</strong> — a member waiting for a title. Status becomes fulfilled or cancelled. The row stays.</li>
            <li className="card p-3"><strong>settings</strong> — the single fine rule: loan length, grace, rate, cap, currency label.</li>
          </ul>
          <p className="mt-3 text-pretty">
            Availability is not a flag someone can forget to update. A copy is issued exactly when it has a loan with no return date. The partial unique index <span className="font-mono">loans_one_open_copy</span> makes a second open loan for that copy impossible.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-semibold">What happens when you press the button</h2>
          <p className="mt-2 text-pretty">
            Issue inserts one loan. The due date is today plus <span className="tabular-nums">{data.settings.loanDays}</span> days from settings. If that copy already has an open loan, the insert matches zero rows and the desk explains who has it. Return sets <span className="font-mono">returned_on</span> to today. It does not delete the loan, so the member history and the book history still show it. That is why a returned book does not destroy the transaction.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-semibold">Fine rule</h2>
          <p className="mt-2 font-mono text-xs leading-relaxed">
            days past due = max(0, as-of date − due date)
            <br />
            chargeable days = max(0, days past due − grace days)
            <br />
            fine = min(max fine, chargeable days × fine per day)
            <br />
            balance = max(0, fine − payments)
          </p>
          <p className="mt-2 text-pretty">
            The as-of date is the return date, or today if the copy is still out. The formula lives in the database view <span className="font-mono">loan_accounts</span>, so the dashboard, the desk, the member page, and the overdue list cannot disagree. Current rate: {data.settings.currency} {data.settings.finePerDay} per chargeable day, grace {data.settings.graceDays}, cap {data.settings.maxFine}.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-semibold">Where the code lives</h2>
          <ul className="mt-2 list-disc ps-5">
            <li><span className="font-mono">migrations/0002_library.sql</span> — tables, seed, views, the unique index.</li>
            <li><span className="font-mono">scripts/generate-library-seed.mjs</span> — rebuilds that seed. The source of the 200+ titles is in this file.</li>
            <li><span className="font-mono">src/lib/library.functions.ts</span> — every database operation.</li>
            <li><span className="font-mono">src/routes</span> — one screen per file. The route loader calls a server function before paint.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-semibold">Viva, in one line each</h2>
          <dl className="mt-2 grid gap-3">
            <Item q="Where is the data stored?" a="In PostgreSQL tables. The browser only receives the rows the server functions return." />
            <Item q="Which table stores this loan?" a="loans. The member’s name is not copied onto it; member_id points at members. The title is reached through copies.title_id." />
            <Item q="How do you prevent duplicate open loans?" a="The insert checks for an open loan, and a unique index on copy_id where returned_on is null rejects a second one." />
            <Item q="How do you prevent duplicate members?" a="members.id is the primary key. Adding M-1001 again inserts nothing." />
            <Item q="What breaks if the internet is disconnected?" a="A hosted database cannot be reached, so issue and return fail. The pages do not keep a second secret copy of the loans." />
            <Item q="How would you scale to 10,000 users?" a="The hot path is the open-loan index and the copy lookup, not a scan of every title. A real deployment would add accounts so each library’s rows are not world-writable." />
            <Item q="What did you personally implement?" a="Fill the contribution table in the report. Do not claim the whole system if you owned one part." />
          </dl>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-semibold">Limits</h2>
          <ul className="mt-2 list-disc ps-5 text-pretty">
            <li>No accounts and no passwords. The checklist forbids shipping secrets, and a shared class demo should open without a login wall. Anyone who can open the app can issue a book. A real library would add staff accounts first.</li>
            <li>Fines follow the current rule, even for old loans. A production desk would store the rate on the loan at issue time.</li>
            <li>There is no email reminder and no card payment. A payment here is a recorded amount, not a bank charge.</li>
            <li>Barcode scanning works only in browsers that expose a camera and BarcodeDetector. Typing the copy id is the reliable path.</li>
            <li>Demo ISBNs that start with DEM- are not registered ISBNs. Member names in the seed are not real people.</li>
            <li>The embedded database used when no DATABASE_URL is set is wiped when the dev server restarts.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-semibold">Sources and assistance</h2>
          <p className="mt-2 text-pretty">
            The catalog is an original demonstration list of well-known published works (title, author, year, subject), compiled for EF101-P15. It is not an export from a live library. No external dataset file was imported. The app was built with assistance from Grok, using React, TanStack Start, Tailwind, PostgreSQL, and Recharts. Say that in report section 11, and name which group member checked which screen.
          </p>
        </section>
      </article>
    </AppShell>
  );
}

function Item({ q, a }: { q: string; a: string }) {
  return (
    <div className="card p-3">
      <dt className="font-semibold">{q}</dt>
      <dd className="mt-1 text-pretty text-muted">{a}</dd>
    </div>
  );
}
