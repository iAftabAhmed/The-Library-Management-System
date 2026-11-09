import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Notice, PageHead } from "@/components/bits";
import { money } from "@/lib/format";
import { getSettings, updateSettings } from "@/lib/library.functions";

export const Route = createFileRoute("/rules")({
  loader: () => getSettings(),
  component: RulesPage,
});

function RulesPage() {
  const saved = Route.useLoaderData();
  const router = useRouter();
  const [loanDays, setLoanDays] = useState(saved.loanDays);
  const [graceDays, setGraceDays] = useState(saved.graceDays);
  const [finePerDay, setFinePerDay] = useState(saved.finePerDay);
  const [maxFine, setMaxFine] = useState(saved.maxFine);
  const [currency, setCurrency] = useState(saved.currency);
  const [daysLate, setDaysLate] = useState(10);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const chargeable = Math.max(0, daysLate - graceDays);
  const fine = Math.min(maxFine, chargeable * finePerDay);

  return (
    <AppShell>
      <PageHead
        title="Fine rule"
        lede="One settings row drives every screen. Fines are calculated when you look at a loan. They are not copied onto the loan, so changing the rule changes the numbers you see. Payments already taken stay as their own rows."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <form
          className="card grid gap-3 p-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setBusy(true);
            setError(null);
            const result = await updateSettings({
              data: { loanDays, graceDays, finePerDay, maxFine, currency },
            });
            setBusy(false);
            if (!result.ok) {
              setError(result.message);
              return;
            }
            setNotice(result.message);
            await router.invalidate();
          }}
        >
          <label className="text-sm">
            Loan length (days)
            <input className="field mt-1" type="number" min={1} max={90} value={loanDays} onChange={(event) => setLoanDays(Number(event.target.value))} />
          </label>
          <label className="text-sm">
            Grace days with no charge
            <input className="field mt-1" type="number" min={0} max={30} value={graceDays} onChange={(event) => setGraceDays(Number(event.target.value))} />
          </label>
          <label className="text-sm">
            Fine per chargeable day
            <input className="field mt-1" type="number" min={0} step="0.5" value={finePerDay} onChange={(event) => setFinePerDay(Number(event.target.value))} />
          </label>
          <label className="text-sm">
            Maximum fine on one loan
            <input className="field mt-1" type="number" min={0} step="1" value={maxFine} onChange={(event) => setMaxFine(Number(event.target.value))} />
          </label>
          <label className="text-sm">
            Currency label
            <input className="field mt-1" value={currency} maxLength={8} onChange={(event) => setCurrency(event.target.value.toUpperCase())} />
          </label>
          <button className="btn btn-primary" type="submit" disabled={busy}>Save rule</button>
          {notice ? <Notice tone="ok">{notice}</Notice> : null}
          {error ? <Notice tone="bad">{error}</Notice> : null}
        </form>
        <article className="card p-4">
          <h2 className="font-serif text-xl font-semibold">Worked example</h2>
          <p className="mt-2 text-sm text-pretty">
            Suppose a copy is still out, or was returned, this many days after the due date.
          </p>
          <label className="mt-3 block text-sm">
            Days after the due date: <span className="tabular-nums">{daysLate}</span>
            <input
              className="mt-2 w-full accent-binding"
              type="range"
              min={0}
              max={40}
              value={daysLate}
              onChange={(event) => setDaysLate(Number(event.target.value))}
            />
          </label>
          <p className="mt-4 font-mono text-sm leading-relaxed">
            chargeable = max(0, {daysLate} − {graceDays}) = {chargeable}
            <br />
            fine = min({maxFine}, {chargeable} × {finePerDay}) = {fine}
          </p>
          <p className="mt-3 text-lg tabular-nums">{money(fine, currency || "PKR")}</p>
          <p className="mt-3 text-sm text-muted">
            The database view <span className="font-mono">loan_accounts</span> uses this same formula, with the return date or today as the “as of” date.
          </p>
        </article>
      </div>
    </AppShell>
  );
}
