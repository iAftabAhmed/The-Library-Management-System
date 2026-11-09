import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Barcode, LoanTable, Notice, PageHead, StatusPill } from "@/components/bits";
import { downloadText, formatDay, yearLabel } from "@/lib/format";
import { addTitle, exportCsv, getTitle, placeHold, searchCatalog } from "@/lib/library.functions";

type CatalogSearch = {
  q: string;
  category: string;
  availability: "all" | "available" | "issued";
  page: number;
  title: number;
};

function readSearch(search: Record<string, unknown>): CatalogSearch {
  const availability =
    search.availability === "available" || search.availability === "issued" ? search.availability : "all";
  const page = Number(search.page ?? 1);
  const title = Number(search.title ?? 0);
  return {
    q: typeof search.q === "string" ? search.q.slice(0, 80) : "",
    category: typeof search.category === "string" ? search.category.slice(0, 40) : "",
    availability,
    page: Number.isFinite(page) && page > 0 ? Math.floor(page) : 1,
    title: Number.isFinite(title) && title > 0 ? Math.floor(title) : 0,
  };
}

export const Route = createFileRoute("/catalog")({
  validateSearch: readSearch,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const list = await searchCatalog({ data: deps });
    const detail = deps.title ? await getTitle({ data: { id: deps.title } }) : null;
    return { list, detail };
  },
  component: CatalogPage,
});

function CatalogPage() {
  const { list, detail } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const router = useRouter();
  const [q, setQ] = useState(search.q);
  const [picked, setPicked] = useState<number[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const pages = Math.max(1, Math.ceil(list.total / list.pageSize));

  function go(next: Partial<CatalogSearch>) {
    void navigate({ search: (prev) => ({ ...prev, ...next }) });
  }

  async function onExportSelected() {
    setError(null);
    const result = await exportCsv({ data: { kind: "selected", ids: picked } });
    if (!result.ok) {
      setError(result.message);
      return;
    }
    downloadText(result.filename, result.csv);
    setNotice(`Exported ${picked.length} selected title${picked.length === 1 ? "" : "s"}.`);
  }

  return (
    <AppShell>
      <PageHead
        title="Catalog"
        lede="Search by title, author, subject, demo ISBN, or copy id. A title can have several physical copies. Only a copy can be issued."
      />
      <form
        className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_12rem_10rem_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          go({ q, page: 1 });
        }}
      >
        <input
          className="field"
          value={q}
          placeholder="Title, author, C-00042, DEM-0007"
          aria-label="Search the catalog"
          onChange={(event) => setQ(event.target.value)}
        />
        <select
          className="field"
          value={search.category}
          aria-label="Subject"
          onChange={(event) => go({ category: event.target.value, page: 1 })}
        >
          <option value="">All subjects</option>
          {list.categories.map((row) => (
            <option key={row.category} value={row.category}>
              {row.category} ({row.n})
            </option>
          ))}
        </select>
        <select
          className="field"
          value={search.availability}
          aria-label="Availability"
          onChange={(event) =>
            go({ availability: event.target.value as CatalogSearch["availability"], page: 1 })
          }
        >
          <option value="all">Any status</option>
          <option value="available">Has a copy in</option>
          <option value="issued">Has a copy out</option>
        </select>
        <button className="btn btn-primary" type="submit">Search</button>
      </form>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <p className="text-muted tabular-nums">
          {list.total} titles · page {list.page} of {pages}
        </p>
        <button className="btn btn-line" type="button" disabled={list.page <= 1} onClick={() => go({ page: list.page - 1 })}>
          Previous
        </button>
        <button className="btn btn-line" type="button" disabled={list.page >= pages} onClick={() => go({ page: list.page + 1 })}>
          Next
        </button>
        <button className="btn btn-line" type="button" onClick={() => void onExportSelected()}>
          Export selected
        </button>
      </div>
      {notice ? <div className="mt-3"><Notice tone="ok">{notice}</Notice></div> : null}
      {error ? <div className="mt-3"><Notice tone="bad">{error}</Notice></div> : null}
      <div className="mt-4 grid items-start gap-4 lg:grid-cols-2">
        <ul className="grid gap-2">
          {list.rows.map((row) => {
            const active = search.title === row.id;
            return (
              <li key={row.id} className={`card ${active ? "border-binding" : ""}`}>
                <div className="flex gap-3 p-3">
                  <input
                    type="checkbox"
                    className="mt-1 size-5 accent-binding"
                    checked={picked.includes(row.id)}
                    aria-label={`Select ${row.title}`}
                    onChange={() =>
                      setPicked((current) =>
                        current.includes(row.id) ? current.filter((id) => id !== row.id) : [...current, row.id],
                      )
                    }
                  />
                  <button type="button" className="min-w-0 flex-1 text-left" onClick={() => go({ title: row.id })}>
                    <span className="block font-serif text-lg leading-snug font-semibold">{row.title}</span>
                    <span className="mt-1 block text-sm text-muted">
                      {row.author} · {row.category}
                      {row.year != null ? ` · ${yearLabel(row.year)}` : ""}
                    </span>
                    <span className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      <StatusPill status={row.available > 0 ? "available" : "issued"} overdue={row.available === 0 && row.issued > 0} />
                      <span className="tabular-nums text-muted">
                        {row.available} of {row.copies} in
                      </span>
                      {row.isbn ? <span className="font-mono text-muted">{row.isbn}</span> : null}
                    </span>
                  </button>
                </div>
              </li>
            );
          })}
          {!list.rows.length ? <li className="text-sm text-muted">Nothing matches that search.</li> : null}
        </ul>
        <div id="title-detail">
          {detail?.found ? (
            <TitleDetail
              detail={detail}
              busy={busy}
              onBusy={setBusy}
              onDone={async (message, tone) => {
                if (tone === "ok") setNotice(message);
                else setError(message);
                await router.invalidate();
              }}
            />
          ) : (
            <article className="card p-4 text-sm text-muted">
              Select a title to see each physical copy, whether it is in or out, and the circulation history.
              History stays after a return.
            </article>
          )}
          <AddTitle
            categories={list.categories.map((row) => row.category)}
            onDone={async (message, titleId) => {
              setNotice(message);
              await router.invalidate();
              go({ title: titleId, q: "", page: 1 });
            }}
            onError={setError}
          />
        </div>
      </div>
    </AppShell>
  );
}

function TitleDetail({
  detail,
  busy,
  onBusy,
  onDone,
}: {
  detail: Extract<Awaited<ReturnType<typeof getTitle>>, { found: true }>;
  busy: boolean;
  onBusy: (value: boolean) => void;
  onDone: (message: string, tone: "ok" | "bad") => Promise<void>;
}) {
  const [memberId, setMemberId] = useState("M-1001");
  const { title } = detail;
  return (
    <article className="card p-4">
      <h2 className="font-serif text-2xl font-semibold">{title.title}</h2>
      <p className="text-sm text-muted">
        {title.author} · {title.category}
        {title.year != null ? ` · ${yearLabel(title.year)}` : ""}
        {title.isbn ? ` · ${title.isbn}` : ""}
      </p>
      <h3 className="mt-4 text-sm font-semibold">Physical copies</h3>
      <ul className="mt-2 grid gap-3">
        {detail.copies.map((copy) => (
          <li key={copy.id} className="rounded-xl border border-line p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-sm">{copy.id}</p>
                <p className="text-xs text-muted">Shelf {copy.shelf}</p>
                {copy.status === "issued" ? (
                  <p className="mt-1 text-sm">
                    Out to {copy.memberName} ({copy.memberId}) until {formatDay(copy.dueOn)}
                  </p>
                ) : (
                  <p className="mt-1 text-sm">On the shelf.</p>
                )}
              </div>
              <StatusPill status={copy.status} overdue={copy.isOverdue} />
            </div>
            <Barcode value={copy.id} />
          </li>
        ))}
      </ul>
      {detail.waiting.length ? (
        <p className="mt-3 text-sm">
          Waiting holds: {detail.waiting.map((hold) => `${hold.memberName} (${hold.memberId})`).join(", ")}
        </p>
      ) : null}
      <form
        className="mt-3 flex flex-wrap gap-2"
        onSubmit={async (event) => {
          event.preventDefault();
          onBusy(true);
          const result = await placeHold({ data: { titleId: title.id, memberId } });
          onBusy(false);
          await onDone(result.ok ? result.message : result.message, result.ok ? "ok" : "bad");
        }}
      >
        <input
          className="field max-w-40"
          value={memberId}
          aria-label="Member id for a hold"
          onChange={(event) => setMemberId(event.target.value.toUpperCase())}
        />
        <button className="btn btn-line" type="submit" disabled={busy}>Place hold</button>
      </form>
      <h3 className="mt-5 text-sm font-semibold">Circulation history</h3>
      <p className="mb-2 text-xs text-muted">Returned rows are still here. The book coming back does not erase the transaction.</p>
      <LoanTable rows={detail.history} currency="PKR" />
      {detail.suggestions.length ? (
        <>
          <h3 className="mt-5 text-sm font-semibold">Suggestions</h3>
          <ul className="mt-2 grid gap-2 text-sm">
            {detail.suggestions.map((item) => (
              <li key={item.id}>
                <span className="font-medium">{item.title}</span>
                <span className="text-muted"> · {item.author}. {item.reason}.</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </article>
  );
}

function AddTitle({
  categories,
  onDone,
  onError,
}: {
  categories: string[];
  onDone: (message: string, titleId: number) => Promise<void>;
  onError: (message: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState(categories[0] ?? "Computer Science");
  const [year, setYear] = useState("");
  const [isbn, setIsbn] = useState("");
  const [copies, setCopies] = useState(1);
  const [busy, setBusy] = useState(false);
  if (!open) {
    return (
      <button className="btn btn-line mt-3" type="button" onClick={() => setOpen(true)}>
        Add a title
      </button>
    );
  }
  return (
    <form
      className="card mt-3 grid gap-2 p-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        const result = await addTitle({ data: { title, author, category, year, isbn, copies } });
        setBusy(false);
        if (!result.ok) {
          onError(result.message);
          return;
        }
        setTitle("");
        setAuthor("");
        setIsbn("");
        await onDone(result.message, result.titleId);
      }}
    >
      <h3 className="font-serif text-lg font-semibold">New title</h3>
      <input className="field" placeholder="Title" value={title} required onChange={(event) => setTitle(event.target.value)} />
      <input className="field" placeholder="Author" value={author} required onChange={(event) => setAuthor(event.target.value)} />
      <input className="field" placeholder="Subject" list="subjects" value={category} required onChange={(event) => setCategory(event.target.value)} />
      <datalist id="subjects">
        {categories.map((item) => (
          <option key={item} value={item} />
        ))}
      </datalist>
      <div className="grid grid-cols-2 gap-2">
        <input className="field" placeholder="Year" inputMode="numeric" value={year} onChange={(event) => setYear(event.target.value)} />
        <input className="field" placeholder="ISBN optional" value={isbn} onChange={(event) => setIsbn(event.target.value)} />
      </div>
      <label className="text-sm text-muted">
        Copies
        <input
          className="field mt-1"
          type="number"
          min={1}
          max={5}
          value={copies}
          onChange={(event) => setCopies(Number(event.target.value))}
        />
      </label>
      <button className="btn btn-primary" type="submit" disabled={busy}>Save title</button>
    </form>
  );
}
