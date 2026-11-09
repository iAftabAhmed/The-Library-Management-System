import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Notice, PageHead } from "@/components/bits";
import { downloadText } from "@/lib/format";
import { exportCsv } from "@/lib/library.functions";

const REPORTS = [
  { kind: "catalog", title: "Full catalog", body: "Every physical copy, with title, author, subject, demo ISBN, shelf, and whether it is in or out." },
  { kind: "open", title: "Open loans", body: "Copies that are issued right now, with due date, fine, and balance." },
  { kind: "overdue", title: "Overdue list", body: "The same rows as the Overdue screen, as a file you can attach to the report." },
  { kind: "circulation", title: "Circulation history", body: "Every loan, including returned ones. This is the evidence that history is not deleted." },
  { kind: "members", title: "Member register", body: "Member id, display name, and how many loans are open or overdue." },
] as const;

export const Route = createFileRoute("/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  return (
    <AppShell>
      <PageHead
        title="Reports"
        lede="Export CSV files for the submission. Selected titles are exported from the Catalog page. These buttons export a whole set."
      />
      <div className="mb-3 grid gap-2">
        {notice ? <Notice tone="ok">{notice}</Notice> : null}
        {error ? <Notice tone="bad">{error}</Notice> : null}
      </div>
      <ul className="grid gap-3">
        {REPORTS.map((report) => (
          <li key={report.kind} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <h2 className="font-serif text-xl font-semibold">{report.title}</h2>
              <p className="text-sm text-pretty text-muted">{report.body}</p>
            </div>
            <button
              className="btn btn-primary"
              type="button"
              disabled={busy !== null}
              onClick={async () => {
                setBusy(report.kind);
                setError(null);
                const result = await exportCsv({ data: { kind: report.kind, ids: [] } });
                setBusy(null);
                if (!result.ok) {
                  setError(result.message);
                  return;
                }
                downloadText(result.filename, result.csv);
                setNotice(`Downloaded ${result.filename}.`);
              }}
            >
              {busy === report.kind ? "Preparing…" : "Download CSV"}
            </button>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
