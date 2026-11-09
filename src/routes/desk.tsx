import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Barcode, Notice, PageHead, StatusPill } from "@/components/bits";
import { formatDay, money } from "@/lib/format";
import { getDesk, issueCopy, lookupCopy, recordPayment, returnCopy } from "@/lib/library.functions";

export const Route = createFileRoute("/desk")({
  loader: () => getDesk(),
  component: DeskPage,
});

type Preview = Awaited<ReturnType<typeof lookupCopy>>;

function DeskPage() {
  const data = Route.useLoaderData();
  const router = useRouter();
  const [copyId, setCopyId] = useState("");
  const [memberId, setMemberId] = useState(data.members[0]?.id ?? "");
  const [memberFilter, setMemberFilter] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const { settings } = data;
  const members = data.members.filter((member) => {
    const q = memberFilter.trim().toLowerCase();
    if (!q) return true;
    return member.name.toLowerCase().includes(q) || member.id.toLowerCase().includes(q);
  });

  async function lookup(id: string) {
    const code = id.trim().toUpperCase();
    setCopyId(code);
    setError(null);
    setNotice(null);
    setBusy(true);
    const result = await lookupCopy({ data: { copyId: code } });
    setPreview(result);
    setBusy(false);
    if (!result.found) setError(result.message);
  }

  async function afterChange(message: string, ok: boolean) {
    if (ok) setNotice(message);
    else setError(message);
    if (ok) {
      const fresh = await lookupCopy({ data: { copyId } });
      setPreview(fresh);
    }
    await router.invalidate();
  }

  const payable =
    preview?.found
      ? preview.openLoan && preview.openLoan.balance > 0
        ? preview.openLoan
        : preview.history.find((row) => row.balance > 0) ?? null
      : null;

  return (
    <AppShell>
      <PageHead
        title="Circulation desk"
        lede="Look up one physical copy, issue it to one member, or take it back. A second issue of the same copy is rejected. The loan row stays after the return."
      />
      <form
        className="flex flex-col gap-2 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          void lookup(copyId);
        }}
      >
        <input
          className="field font-mono text-lg"
          value={copyId}
          placeholder="C-00042"
          aria-label="Copy id"
          autoCapitalize="characters"
          onChange={(event) => setCopyId(event.target.value.toUpperCase())}
        />
        <button className="btn btn-primary" type="submit" disabled={busy}>Look up</button>
        <ScanButton
          onCode={(code) => {
            void lookup(code);
          }}
        />
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        {data.samples.availableId ? (
          <button className="btn btn-line" type="button" onClick={() => void lookup(data.samples.availableId!)}>
            Try in: {data.samples.availableId}
          </button>
        ) : null}
        {data.samples.issuedId ? (
          <button className="btn btn-line" type="button" onClick={() => void lookup(data.samples.issuedId!)}>
            Try out: {data.samples.issuedId}
          </button>
        ) : null}
      </div>
      <div className="mt-3 grid gap-2">
        {notice ? <Notice tone="ok">{notice}</Notice> : null}
        {error ? <Notice tone="bad">{error}</Notice> : null}
      </div>
      {preview?.found ? (
        <article className="card mt-4 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-mono text-sm">{preview.copyId}</p>
              <h2 className="font-serif text-2xl font-semibold">{preview.title}</h2>
              <p className="text-sm text-muted">
                {preview.author} · {preview.category} · shelf {preview.shelf}
              </p>
            </div>
            <StatusPill status={preview.status} overdue={preview.openLoan?.isOverdue ?? false} />
          </div>
          <Barcode value={preview.copyId} />
          <p className="text-xs text-muted">The bars are a shelf label. The unique key is the copy id itself.</p>
          {preview.status === "available" ? (
            <form
              className="mt-4 grid gap-2"
              onSubmit={async (event) => {
                event.preventDefault();
                setBusy(true);
                setError(null);
                const result = await issueCopy({ data: { copyId: preview.copyId, memberId } });
                setBusy(false);
                await afterChange(result.message, result.ok);
              }}
            >
              <p className="text-sm">
                Due {settings.loanDays} days after today if you issue it now ({money(settings.finePerDay, settings.currency)} / day after {settings.graceDays} grace day{settings.graceDays === 1 ? "" : "s"}).
              </p>
              {preview.nextHold && preview.nextHold.memberId !== memberId ? (
                <Notice tone="bad">
                  {preview.nextHold.memberName} ({preview.nextHold.memberId}) is first in the hold queue for this title. Issuing to someone else jumps that queue.
                </Notice>
              ) : null}
              <input
                className="field"
                placeholder="Filter members"
                value={memberFilter}
                aria-label="Filter members"
                onChange={(event) => setMemberFilter(event.target.value)}
              />
              <select className="field" value={memberId} aria-label="Member" onChange={(event) => setMemberId(event.target.value)}>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.id} · {member.name}
                  </option>
                ))}
              </select>
              <button className="btn btn-primary" type="submit" disabled={busy || !memberId}>
                Issue this copy
              </button>
            </form>
          ) : preview.openLoan ? (
            <div className="mt-4 grid gap-2 text-sm">
              <p>
                Out to <strong>{preview.openLoan.memberName}</strong> ({preview.openLoan.memberId}) since {formatDay(preview.openLoan.issuedOn)}. Due {formatDay(preview.openLoan.dueOn)}.
              </p>
              <p className="tabular-nums">
                {preview.openLoan.daysPastDue} days past due · {preview.openLoan.chargeableDays} chargeable · fine {money(preview.openLoan.fine, settings.currency)} · balance {money(preview.openLoan.balance, settings.currency)}
              </p>
              <button
                className="btn btn-primary"
                type="button"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  setError(null);
                  const result = await returnCopy({ data: { copyId: preview.copyId } });
                  setBusy(false);
                  await afterChange(result.message, result.ok);
                }}
              >
                Return this copy
              </button>
            </div>
          ) : null}
          {payable ? (
            <form
              className="mt-4 grid gap-2 sm:grid-cols-[8rem_minmax(0,1fr)_auto]"
              onSubmit={async (event) => {
                event.preventDefault();
                setBusy(true);
                setError(null);
                const result = await recordPayment({
                  data: { loanId: payable.id, amount: Number(amount), note },
                });
                setBusy(false);
                if (result.ok) setAmount("");
                await afterChange(result.message, result.ok);
              }}
            >
              <input
                className="field"
                inputMode="decimal"
                placeholder="Amount"
                aria-label="Payment amount"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
              <input
                className="field"
                placeholder="Note, optional"
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
              <button className="btn btn-line" type="submit" disabled={busy}>
                Record payment
              </button>
            </form>
          ) : null}
          {preview.history.length ? (
            <div className="mt-5">
              <h3 className="text-sm font-semibold">This copy’s loans</h3>
              <ul className="mt-2 grid gap-2 text-sm">
                {preview.history.map((row) => (
                  <li key={row.id} className="border-t border-line pt-2">
                    Loan {row.id}: {row.memberName}, issued {formatDay(row.issuedOn)}, due {formatDay(row.dueOn)}, {row.returnedOn ? `returned ${formatDay(row.returnedOn)}` : "still out"}. Balance {money(row.balance, settings.currency)}.
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">This copy has never been issued. There is no history to delete.</p>
          )}
        </article>
      ) : null}
      <section className="mt-6">
        <h2 className="font-serif text-xl font-semibold">Overdue on the desk</h2>
        <ul className="mt-2 grid gap-2">
          {data.overdue.map((row) => (
            <li key={row.id}>
              <button className="card w-full px-3 py-2 text-left" type="button" onClick={() => void lookup(row.copyId)}>
                <span className="font-mono text-xs">{row.copyId}</span>
                <span className="mt-1 block text-sm">{row.title}</span>
                <span className="text-xs text-muted">
                  {row.memberName} · {row.chargeableDays} chargeable days · {money(row.balance, settings.currency)} balance
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}

function ScanButton({ onCode }: { onCode: (code: string) => void }) {
  const [on, setOn] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!on) return;
    let stop = false;
    let stream: MediaStream | null = null;
    let timer = 0;
    const video = document.getElementById("quire-scan") as HTMLVideoElement | null;
    (async () => {
      const Detector = (
        window as unknown as {
          BarcodeDetector?: new (opts: { formats: string[] }) => {
            detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue: string }>>;
          };
        }
      ).BarcodeDetector;
      if (!Detector || !navigator.mediaDevices?.getUserMedia) {
        setMessage("This browser cannot scan. Type the copy id.");
        setOn(false);
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (stop || !video) return;
        video.srcObject = stream;
        await video.play();
        const detector = new Detector({ formats: ["code_128", "code_39", "qr_code", "ean_13"] });
        const tick = async () => {
          if (stop || !video) return;
          try {
            const codes = await detector.detect(video);
            const hit = codes
              .map((code) => code.rawValue.toUpperCase().match(/C-\d{5}/)?.[0])
              .find(Boolean);
            if (hit) {
              onCode(hit);
              setOn(false);
              return;
            }
          } catch {
            // A single frame can fail. Keep trying.
          }
          timer = window.setTimeout(() => void tick(), 350);
        };
        timer = window.setTimeout(() => void tick(), 350);
      } catch {
        setMessage("Camera permission was blocked. Type the copy id.");
        setOn(false);
      }
    })();
    return () => {
      stop = true;
      window.clearTimeout(timer);
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [on, onCode]);

  return (
    <div className="flex flex-col gap-2">
      <button className="btn btn-line" type="button" onClick={() => { setMessage(null); setOn((value) => !value); }}>
        {on ? "Stop camera" : "Scan barcode"}
      </button>
      {on ? <video id="quire-scan" className="h-36 w-full rounded-xl bg-ink object-cover" muted playsInline /> : null}
      {message ? <p className="text-xs text-muted">{message}</p> : null}
    </div>
  );
}
