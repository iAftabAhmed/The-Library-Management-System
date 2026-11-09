import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Notice, PageHead } from "@/components/bits";
import { formatDay } from "@/lib/format";
import { listHolds, setHoldStatus } from "@/lib/library.functions";

export const Route = createFileRoute("/holds")({
  loader: () => listHolds(),
  component: HoldsPage,
});

function HoldsPage() {
  const { holds } = Route.useLoaderData();
  const router = useRouter();
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function update(id: number, status: "cancelled" | "fulfilled") {
    setBusy(true);
    setError(null);
    const result = await setHoldStatus({ data: { id, status } });
    setBusy(false);
    if (result.ok) setNotice(result.message);
    else setError(result.message);
    await router.invalidate();
  }

  return (
    <AppShell>
      <PageHead
        title="Holds"
        lede="A hold reserves a title, not one barcode, because any free copy of that work can satisfy it. Cancelling does not delete the request."
      />
      <div className="mb-3 grid gap-2">
        {notice ? <Notice tone="ok">{notice}</Notice> : null}
        {error ? <Notice tone="bad">{error}</Notice> : null}
      </div>
      <ul className="grid gap-2">
        {holds.map((hold) => (
          <li key={hold.id} className="card flex flex-col gap-2 p-3 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold tracking-wide text-muted uppercase">{hold.status}</p>
              <p className="font-serif text-lg font-semibold">{hold.title}</p>
              <p className="text-sm text-muted">
                {hold.memberName} ({hold.memberId}) · placed {formatDay(hold.placedOn)} · {hold.available} copies in
              </p>
            </div>
            {hold.status === "waiting" ? (
              <div className="flex gap-2">
                <button className="btn btn-line" type="button" disabled={busy} onClick={() => void update(hold.id, "fulfilled")}>
                  Fulfill
                </button>
                <button className="btn btn-line" type="button" disabled={busy} onClick={() => void update(hold.id, "cancelled")}>
                  Cancel
                </button>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
