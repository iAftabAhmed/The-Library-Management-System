import type { LoanRow } from "@/lib/library-types";
import { formatDay, money } from "@/lib/format";

export function PageHead({ title, lede }: { title: string; lede: string }) {
  return (
    <header className="mb-5">
      <h1 className="font-serif text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-1 max-w-2xl text-pretty text-muted">{lede}</p>
    </header>
  );
}

export function Notice({ tone, children }: { tone: "ok" | "bad"; children: React.ReactNode }) {
  return (
    <p
      role="status"
      className={
        tone === "ok"
          ? "rounded-xl bg-binding-soft px-3 py-2 text-sm text-binding"
          : "rounded-xl bg-overdue-soft px-3 py-2 text-sm text-overdue"
      }
    >
      {children}
    </p>
  );
}

export function StatusPill({
  status,
  overdue = false,
}: {
  status: "available" | "issued" | "returned";
  overdue?: boolean;
}) {
  if (overdue) {
    return <span className="inline-flex rounded-full bg-overdue-soft px-2 py-0.5 text-xs font-semibold text-overdue">Overdue</span>;
  }
  if (status === "available") {
    return <span className="inline-flex rounded-full bg-binding-soft px-2 py-0.5 text-xs font-semibold text-binding">Available</span>;
  }
  if (status === "returned") {
    return <span className="inline-flex rounded-full bg-paper px-2 py-0.5 text-xs font-semibold text-muted">Returned</span>;
  }
  return <span className="inline-flex rounded-full bg-line px-2 py-0.5 text-xs font-semibold text-ink">Issued</span>;
}

export function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <article className="card px-4 py-3">
      <p className="text-xs font-semibold tracking-wide text-muted uppercase">{label}</p>
      <p className="mt-1 font-serif text-3xl tabular-nums">{value}</p>
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </article>
  );
}

export function Barcode({ value }: { value: string }) {
  const bars: Array<"ink" | "gap"> = [];
  const widths: string[] = [];
  for (const ch of value) {
    const n = ch.charCodeAt(0);
    const pattern = [n & 1 ? "w-0.5" : "w-px", "w-px", n & 2 ? "w-1" : "w-px", "w-0.5", n & 4 ? "w-0.5" : "w-px", "w-px"];
    pattern.forEach((width, index) => {
      bars.push(index % 2 === 0 ? "ink" : "gap");
      widths.push(width);
    });
  }
  return (
    <div className="flex h-10 items-stretch" aria-hidden>
      {bars.map((kind, index) => (
        <span key={`${value}-${index}`} className={`${widths[index]} ${kind === "ink" ? "bg-ink" : "bg-transparent"}`} />
      ))}
    </div>
  );
}

export function LoanTable({ rows, currency }: { rows: LoanRow[]; currency: string }) {
  if (!rows.length) return <p className="text-sm text-muted">No loans on record.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-xs text-muted">
          <tr>
            <th className="py-2 pr-3 font-medium">Copy</th>
            <th className="py-2 pr-3 font-medium">Title</th>
            <th className="py-2 pr-3 font-medium">Member</th>
            <th className="py-2 pr-3 font-medium">Issued</th>
            <th className="py-2 pr-3 font-medium">Due</th>
            <th className="py-2 pr-3 font-medium">Returned</th>
            <th className="py-2 pr-3 font-medium">Fine</th>
            <th className="py-2 font-medium">Balance</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-line align-top">
              <td className="py-2 pr-3 font-mono text-xs">{row.copyId}</td>
              <td className="py-2 pr-3">{row.title}</td>
              <td className="py-2 pr-3">
                {row.memberName}
                <span className="block text-xs text-muted">{row.memberId}</span>
              </td>
              <td className="py-2 pr-3 whitespace-nowrap tabular-nums">{formatDay(row.issuedOn)}</td>
              <td className="py-2 pr-3 whitespace-nowrap tabular-nums">{formatDay(row.dueOn)}</td>
              <td className="py-2 pr-3 whitespace-nowrap">
                {row.returnedOn ? (
                  formatDay(row.returnedOn)
                ) : (
                  <StatusPill status="issued" overdue={row.isOverdue} />
                )}
              </td>
              <td className="py-2 pr-3 tabular-nums">{money(row.fine, currency)}</td>
              <td className="py-2 tabular-nums">{money(row.balance, currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
