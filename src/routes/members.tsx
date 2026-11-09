import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { LoanTable, Notice, PageHead } from "@/components/bits";
import { formatDay, money } from "@/lib/format";
import { addMember, getMember, getSettings, listMembers } from "@/lib/library.functions";

export const Route = createFileRoute("/members")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q.slice(0, 80) : "",
    card: typeof search.card === "string" ? search.card.slice(0, 20).toUpperCase() : "",
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const list = await listMembers({ data: { q: deps.q } });
    const detail = deps.card ? await getMember({ data: { id: deps.card } }) : null;
    const settings = await getSettings();
    return { list, detail, settings };
  },
  component: MembersPage,
});

function MembersPage() {
  const { list, detail, settings } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const router = useRouter();
  const [q, setQ] = useState(search.q);
  const [id, setId] = useState<string>(list.nextId);
  const [name, setName] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <AppShell>
      <PageHead
        title="Members"
        lede="A member card is an id plus a display name. These names are fictional. Borrowing history is the list of loan rows for that id, including books already returned."
      />
      <form
        className="flex flex-col gap-2 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          void navigate({ search: (prev) => ({ ...prev, q }) });
        }}
      >
        <input className="field" value={q} placeholder="Name or M-1001" aria-label="Search members" onChange={(event) => setQ(event.target.value)} />
        <button className="btn btn-primary" type="submit">Search</button>
      </form>
      <div className="mt-3 grid gap-2">
        {notice ? <Notice tone="ok">{notice}</Notice> : null}
        {error ? <Notice tone="bad">{error}</Notice> : null}
      </div>
      <div className="mt-4 grid items-start gap-4 lg:grid-cols-2">
        <ul className="grid gap-2">
          {list.members.map((member) => (
            <li key={member.id}>
              <button
                type="button"
                className={`card w-full px-3 py-3 text-left ${search.card === member.id ? "border-binding" : ""}`}
                onClick={() => void navigate({ search: (prev) => ({ ...prev, card: member.id }) })}
              >
                <span className="font-mono text-xs">{member.id}</span>
                <span className="mt-1 block font-serif text-lg font-semibold">{member.name}</span>
                <span className="text-xs text-muted tabular-nums">
                  Joined {formatDay(member.joinedOn)} · {member.openLoans} open · {member.overdueLoans} overdue
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div>
          {detail?.found ? (
            <article className="card p-4">
              <h2 className="font-serif text-2xl font-semibold">{detail.member.name}</h2>
              <p className="text-sm text-muted">
                {detail.member.id} · joined {formatDay(detail.member.joinedOn)}
              </p>
              <p className="mt-2 text-sm tabular-nums">
                Open balance{" "}
                {money(
                  detail.history.filter((row) => row.isOpen).reduce((sum, row) => sum + row.balance, 0),
                  settings.currency,
                )}
              </p>
              <h3 className="mt-4 text-sm font-semibold">Borrowing history</h3>
              <LoanTable rows={detail.history} currency={settings.currency} />
              {detail.suggestions.length ? (
                <>
                  <h3 className="mt-4 text-sm font-semibold">Worth offering</h3>
                  <ul className="mt-2 grid gap-1 text-sm">
                    {detail.suggestions.map((item) => (
                      <li key={item.id}>
                        {item.title} <span className="text-muted">· {item.reason}.</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="mt-3 text-sm text-muted">No subject-based suggestion yet. Issue a book first.</p>
              )}
            </article>
          ) : (
            <article className="card p-4 text-sm text-muted">Select a card to see every loan, open or returned.</article>
          )}
          <form
            className="card mt-3 grid gap-2 p-4"
            onSubmit={async (event) => {
              event.preventDefault();
              setError(null);
              const result = await addMember({ data: { id, name } });
              if (!result.ok) {
                setError(result.message);
                return;
              }
              setNotice(result.message);
              setName("");
              await router.invalidate();
              void navigate({ search: (prev) => ({ ...prev, card: result.id, q: "" }) });
            }}
          >
            <h3 className="font-serif text-lg font-semibold">New demonstration card</h3>
            <input className="field font-mono" value={id} aria-label="Member id" onChange={(event) => setId(event.target.value.toUpperCase())} />
            <input className="field" placeholder="Display name" value={name} aria-label="Display name" onChange={(event) => setName(event.target.value)} />
            <button className="btn btn-primary" type="submit">Add member</button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
