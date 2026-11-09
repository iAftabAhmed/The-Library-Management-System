import { createFileRoute, Link } from "@tanstack/react-router";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/app-shell";
import { LoanTable, PageHead, Stat } from "@/components/bits";
import { formatDay, money } from "@/lib/format";
import { getSummary } from "@/lib/library.functions";

export const Route = createFileRoute("/")({
  loader: () => getSummary(),
  component: Dashboard,
});

function Dashboard() {
  const data = Route.useLoaderData();
  const { settings } = data;
  return (
    <AppShell>
      <PageHead
        title="Reading room"
        lede="One desk for the catalog, the copies on the shelf, and every issue and return. Counts below are the four the brief asks for, read live from the database."
      />
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Total copies" value={String(data.totalCopies)} hint={`${data.titles} titles`} />
        <Stat label="Available" value={String(data.availableCopies)} hint="No open loan" />
        <Stat label="Issued" value={String(data.issuedCopies)} hint="Out right now" />
        <Stat label="Overdue" value={String(data.overdueCopies)} hint="Still out, past due" />
      </section>
      <section className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <article className="card p-4">
          <h2 className="font-serif text-xl font-semibold">Loans by subject</h2>
          <p className="mb-3 text-sm text-muted">Every loan ever recorded, including ones already returned.</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.byCategory} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <XAxis dataKey="category" hide />
                <YAxis allowDecimals={false} width={32} stroke="var(--color-muted)" fontSize={12} />
                <Tooltip
                  cursor={{ fill: "var(--color-paper)" }}
                  contentStyle={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-line)",
                    borderRadius: 12,
                    color: "var(--color-ink)",
                  }}
                />
                <Bar dataKey="loans" fill="var(--color-binding)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
            {data.byCategory.map((row) => (
              <li key={row.category}>
                {row.category} <span className="tabular-nums text-ink">{row.loans}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="card p-4">
          <h2 className="font-serif text-xl font-semibold">Fine rule</h2>
          <p className="mt-2 text-sm text-pretty">
            Loan length {settings.loanDays} days. Grace {settings.graceDays} day
            {settings.graceDays === 1 ? "" : "s"}. Then {money(settings.finePerDay, settings.currency)} per
            day, capped at {money(settings.maxFine, settings.currency)}.
          </p>
          <p className="mt-2 text-sm text-muted">
            Outstanding on open loans: <span className="tabular-nums text-ink">{money(data.outstandingFines, settings.currency)}</span>
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/desk" className="btn btn-primary">Open the desk</Link>
            <Link to="/overdue" className="btn btn-line">Review overdue</Link>
          </div>
          <p className="mt-4 text-xs text-muted">{data.members} demonstration member cards.</p>
        </article>
      </section>
      <section className="card mt-3 p-4">
        <div className="mb-2">
          <h2 className="font-serif text-xl font-semibold">Latest transactions</h2>
        </div>
        <p className="mb-3 text-sm text-muted">
          A return fills in the date. It does not remove the row. Newest loan id first.
          {data.recent[0] ? ` Latest due ${formatDay(data.recent[0].dueOn)}.` : ""}
        </p>
        <LoanTable rows={data.recent} currency={settings.currency} />
      </section>
    </AppShell>
  );
}
