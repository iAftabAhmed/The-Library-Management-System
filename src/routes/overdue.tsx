import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHead } from "@/components/bits";
import { formatDay, money } from "@/lib/format";
import { listOverdue } from "@/lib/library.functions";

export const Route = createFileRoute("/overdue")({
  loader: () => listOverdue(),
  component: OverduePage,
});

function OverduePage() {
  const { rows, settings } = Route.useLoaderData();
  return (
    <AppShell>
      <PageHead
        title="Overdue"
        lede={`A copy is overdue when it is still out and today is after the due date. The fine uses chargeable days, which subtract the ${settings.graceDays}-day grace. During grace the row is listed and the fine is zero.`}
      />
      <p className="mb-3 text-sm tabular-nums text-muted">{rows.length} copies</p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-muted">
            <tr>
              <th className="py-2 pr-3 font-medium">Copy</th>
              <th className="py-2 pr-3 font-medium">Title</th>
              <th className="py-2 pr-3 font-medium">Member</th>
              <th className="py-2 pr-3 font-medium">Due</th>
              <th className="py-2 pr-3 font-medium">Past due</th>
              <th className="py-2 pr-3 font-medium">Chargeable</th>
              <th className="py-2 font-medium">Balance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-line">
                <td className="py-2 pr-3 font-mono text-xs">
                  <Link to="/desk" className="underline decoration-line underline-offset-2">{row.copyId}</Link>
                </td>
                <td className="py-2 pr-3">{row.title}</td>
                <td className="py-2 pr-3">
                  {row.memberName}
                  <span className="block text-xs text-muted">{row.memberId}</span>
                </td>
                <td className="py-2 pr-3 whitespace-nowrap tabular-nums">{formatDay(row.dueOn)}</td>
                <td className="py-2 pr-3 tabular-nums">{row.daysPastDue}</td>
                <td className="py-2 pr-3 tabular-nums">{row.chargeableDays}</td>
                <td className="py-2 tabular-nums">{money(row.balance, settings.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!rows.length ? <p className="mt-3 text-sm text-muted">Nothing is overdue.</p> : null}
    </AppShell>
  );
}
