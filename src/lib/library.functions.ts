import { createServerFn } from "@tanstack/react-start";
import { getSql, type Sql } from "@/lib/db";
import type {
  CatalogRow,
  CopyRow,
  HoldRow,
  LoanRow,
  MemberRow,
  Settings,
  Suggestion,
  Summary,
} from "@/lib/library-types";

function int(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : 0;
}

function num(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
}

function flag(value: unknown) {
  return value === true || value === "t" || value === "true" || value === 1;
}

function text(value: unknown) {
  return value == null ? "" : String(value);
}

function day(value: unknown) {
  if (value == null || value === "") return null;
  return String(value).slice(0, 10);
}

function clip(value: unknown, max: number) {
  return text(value).trim().slice(0, max);
}

function likePattern(q: string) {
  return `%${q.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_")}%`;
}

type LoanSql = {
  id: unknown;
  copy_id: unknown;
  member_id: unknown;
  member_name: unknown;
  title_id: unknown;
  title: unknown;
  author: unknown;
  category: unknown;
  shelf: unknown;
  issued_on: unknown;
  due_on: unknown;
  returned_on: unknown;
  is_open: unknown;
  is_overdue: unknown;
  days_past_due: unknown;
  chargeable_days: unknown;
  fine: unknown;
  paid: unknown;
};

function mapLoan(row: LoanSql): LoanRow {
  const fine = num(row.fine);
  const paid = num(row.paid);
  return {
    id: int(row.id),
    copyId: text(row.copy_id),
    memberId: text(row.member_id),
    memberName: text(row.member_name),
    titleId: int(row.title_id),
    title: text(row.title),
    author: text(row.author),
    category: text(row.category),
    shelf: text(row.shelf),
    issuedOn: day(row.issued_on) ?? "",
    dueOn: day(row.due_on) ?? "",
    returnedOn: day(row.returned_on),
    isOpen: flag(row.is_open),
    isOverdue: flag(row.is_overdue),
    daysPastDue: int(row.days_past_due),
    chargeableDays: int(row.chargeable_days),
    fine,
    paid,
    balance: Math.max(0, Math.round((fine - paid) * 100) / 100),
  };
}

async function loadSettings(sql: Sql): Promise<Settings> {
  const rows = await sql<{
    loan_days: unknown;
    grace_days: unknown;
    fine_per_day: unknown;
    max_fine: unknown;
    currency: unknown;
  }>`
    select loan_days::int as loan_days, grace_days::int as grace_days,
           fine_per_day::float8 as fine_per_day, max_fine::float8 as max_fine, currency
    from settings where id = 1
  `;
  const row = rows[0];
  if (!row) throw new Error("Fine rule is missing. The settings table has no row.");
  return {
    loanDays: int(row.loan_days),
    graceDays: int(row.grace_days),
    finePerDay: num(row.fine_per_day),
    maxFine: num(row.max_fine),
    currency: text(row.currency) || "PKR",
  };
}

function toCsv(headers: string[], rows: unknown[][]) {
  const cell = (value: unknown) => {
    const s = value == null ? "" : String(value);
    return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
  };
  return [headers.join(","), ...rows.map((row) => row.map(cell).join(","))].join("\n") + "\n";
}

export const getSummary = createServerFn({ method: "GET" }).handler(async (): Promise<Summary> => {
  const sql = await getSql();
  const [counts] = await sql<{
    titles: unknown;
    total: unknown;
    available: unknown;
    issued: unknown;
    overdue: unknown;
    members: unknown;
    balance: unknown;
  }>`
    select
      (select count(*) from titles)::int as titles,
      (select count(*) from copies)::int as total,
      (select count(*) from copy_status where status = 'available')::int as available,
      (select count(*) from copy_status where status = 'issued')::int as issued,
      (select count(*) from copy_status where is_overdue)::int as overdue,
      (select count(*) from members)::int as members,
      coalesce((
        select sum(greatest(0, fine - paid))
        from loan_accounts
        where is_open and fine > paid
      ), 0)::float8 as balance
  `;
  const recentRows = await sql<LoanSql>`
    select id, copy_id, member_id, member_name, title_id, title, author, category, shelf,
           issued_on, due_on, returned_on, is_open, is_overdue, days_past_due, chargeable_days, fine, paid
    from loan_accounts
    order by id desc
    limit 8
  `;
  const byCategory = await sql<{ category: unknown; loans: unknown }>`
    select category, count(*)::int as loans
    from loan_accounts
    group by category
    order by loans desc, category
  `;
  return {
    titles: int(counts?.titles),
    totalCopies: int(counts?.total),
    availableCopies: int(counts?.available),
    issuedCopies: int(counts?.issued),
    overdueCopies: int(counts?.overdue),
    members: int(counts?.members),
    outstandingFines: num(counts?.balance),
    settings: await loadSettings(sql),
    recent: recentRows.map(mapLoan),
    byCategory: byCategory.map((row) => ({ category: text(row.category), loans: int(row.loans) })),
  };
});

export const getSettings = createServerFn({ method: "GET" }).handler(async () => {
  return loadSettings(await getSql());
});

const PAGE_SIZE = 12;

export const searchCatalog = createServerFn({ method: "GET" })
  .validator((input: { q?: string; category?: string; availability?: string; page?: number }) => {
    const availability =
      input?.availability === "available" || input?.availability === "issued"
        ? input.availability
        : "all";
    const page = int(input?.page);
    return {
      q: clip(input?.q, 80),
      category: clip(input?.category, 40),
      availability,
      page: page > 0 ? page : 1,
    };
  })
  .handler(async ({ data }) => {
    const sql = await getSql();
    const pattern = likePattern(data.q);
    const [countRow] = await sql<{ n: unknown }>`
      select count(*)::int as n
      from titles t
      where (${data.q} = '' or t.title ilike ${pattern} escape '\\'
            or t.author ilike ${pattern} escape '\\'
            or t.category ilike ${pattern} escape '\\'
            or coalesce(t.isbn, '') ilike ${pattern} escape '\\'
            or exists (
              select 1 from copies cx
              where cx.title_id = t.id and cx.id ilike ${pattern} escape '\\'
            ))
        and (${data.category} = '' or t.category = ${data.category})
        and (
          ${data.availability} = 'all'
          or (${data.availability} = 'available' and exists (
            select 1 from copy_status cs where cs.title_id = t.id and cs.status = 'available'
          ))
          or (${data.availability} = 'issued' and exists (
            select 1 from copy_status cs where cs.title_id = t.id and cs.status = 'issued'
          ))
        )
    `;
    const total = int(countRow?.n);
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const page = Math.min(data.page, pages);
    const offset = (page - 1) * PAGE_SIZE;
    const rows = await sql<{
      id: unknown;
      title: unknown;
      author: unknown;
      category: unknown;
      isbn: unknown;
      year: unknown;
      copies: unknown;
      available: unknown;
      issued: unknown;
    }>`
      select t.id, t.title, t.author, t.category, t.isbn, t.year,
        (select count(*) from copies c where c.title_id = t.id)::int as copies,
        (select count(*) from copy_status cs where cs.title_id = t.id and cs.status = 'available')::int as available,
        (select count(*) from copy_status cs where cs.title_id = t.id and cs.status = 'issued')::int as issued
      from titles t
      where (${data.q} = '' or t.title ilike ${pattern} escape '\\'
            or t.author ilike ${pattern} escape '\\'
            or t.category ilike ${pattern} escape '\\'
            or coalesce(t.isbn, '') ilike ${pattern} escape '\\'
            or exists (
              select 1 from copies cx
              where cx.title_id = t.id and cx.id ilike ${pattern} escape '\\'
            ))
        and (${data.category} = '' or t.category = ${data.category})
        and (
          ${data.availability} = 'all'
          or (${data.availability} = 'available' and exists (
            select 1 from copy_status cs where cs.title_id = t.id and cs.status = 'available'
          ))
          or (${data.availability} = 'issued' and exists (
            select 1 from copy_status cs where cs.title_id = t.id and cs.status = 'issued'
          ))
        )
      order by t.title
      limit ${PAGE_SIZE} offset ${offset}
    `;
    const categories = await sql<{ category: unknown; n: unknown }>`
      select category, count(*)::int as n from titles group by category order by category
    `;
    const catalog: CatalogRow[] = rows.map((row) => ({
      id: int(row.id),
      title: text(row.title),
      author: text(row.author),
      category: text(row.category),
      isbn: row.isbn == null ? null : text(row.isbn),
      year: row.year == null ? null : int(row.year),
      copies: int(row.copies),
      available: int(row.available),
      issued: int(row.issued),
    }));
    return {
      rows: catalog,
      total,
      page,
      pageSize: PAGE_SIZE,
      categories: categories.map((row) => ({ category: text(row.category), n: int(row.n) })),
    };
  });

export const getTitle = createServerFn({ method: "GET" })
  .validator((input: { id?: number }) => ({ id: int(input?.id) }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const [title] = await sql<{
      id: unknown;
      title: unknown;
      author: unknown;
      category: unknown;
      isbn: unknown;
      year: unknown;
    }>`
      select id, title, author, category, isbn, year from titles where id = ${data.id}
    `;
    if (!title) return { found: false as const };
    const copyRows = await sql<{
      id: unknown;
      shelf: unknown;
      status: unknown;
      loan_id: unknown;
      member_id: unknown;
      member_name: unknown;
      due_on: unknown;
      is_overdue: unknown;
    }>`
      select id, shelf, status, loan_id, member_id, member_name, due_on, is_overdue
      from copy_status where title_id = ${data.id} order by id
    `;
    const history = await sql<LoanSql>`
      select id, copy_id, member_id, member_name, title_id, title, author, category, shelf,
             issued_on, due_on, returned_on, is_open, is_overdue, days_past_due, chargeable_days, fine, paid
      from loan_accounts where title_id = ${data.id}
      order by issued_on desc, id desc
      limit 40
    `;
    const together = await sql<{ id: unknown; title: unknown; author: unknown; category: unknown; times: unknown }>`
      select t.id, t.title, t.author, t.category, count(distinct l2.member_id)::int as times
      from loans l1
      join copies c1 on c1.id = l1.copy_id and c1.title_id = ${data.id}
      join loans l2 on l2.member_id = l1.member_id
      join copies c2 on c2.id = l2.copy_id and c2.title_id <> ${data.id}
      join titles t on t.id = c2.title_id
      group by t.id
      order by times desc, t.title
      limit 4
    `;
    let suggestions: Suggestion[];
    if (together.length) {
      suggestions = together.map((row) => ({
        id: int(row.id),
        title: text(row.title),
        author: text(row.author),
        category: text(row.category),
        reason: `Borrowed by ${int(row.times)} reader${int(row.times) === 1 ? "" : "s"} of this title`,
      }));
    } else {
      const same = await sql<{ id: unknown; title: unknown; author: unknown; category: unknown }>`
        select id, title, author, category from titles
        where category = ${text(title.category)} and id <> ${data.id}
        order by title
        limit 4
      `;
      suggestions = same.map((row) => ({
        id: int(row.id),
        title: text(row.title),
        author: text(row.author),
        category: text(row.category),
        reason: "Same subject",
      }));
    }
    const holds = await sql<{ member_id: unknown; member_name: unknown }>`
      select h.member_id, m.name as member_name
      from holds h
      join members m on m.id = h.member_id
      where h.title_id = ${data.id} and h.status = 'waiting'
      order by h.created_at
    `;
    const copies: CopyRow[] = copyRows.map((row) => ({
      id: text(row.id),
      shelf: text(row.shelf),
      status: text(row.status) === "issued" ? "issued" : "available",
      loanId: row.loan_id == null ? null : int(row.loan_id),
      memberId: row.member_id == null ? null : text(row.member_id),
      memberName: row.member_name == null ? null : text(row.member_name),
      dueOn: day(row.due_on),
      isOverdue: flag(row.is_overdue),
    }));
    return {
      found: true as const,
      title: {
        id: int(title.id),
        title: text(title.title),
        author: text(title.author),
        category: text(title.category),
        isbn: title.isbn == null ? null : text(title.isbn),
        year: title.year == null ? null : int(title.year),
      },
      copies,
      history: history.map(mapLoan),
      suggestions,
      waiting: holds.map((row) => ({ memberId: text(row.member_id), memberName: text(row.member_name) })),
    };
  });

export const getDesk = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const members = await sql<{ id: unknown; name: unknown }>`
    select id, name from members order by id
  `;
  const overdue = await sql<LoanSql>`
    select id, copy_id, member_id, member_name, title_id, title, author, category, shelf,
           issued_on, due_on, returned_on, is_open, is_overdue, days_past_due, chargeable_days, fine, paid
    from loan_accounts
    where is_overdue
    order by due_on, id
    limit 12
  `;
  const [available] = await sql<{ id: unknown }>`
    select id from copy_status where status = 'available' order by id limit 1
  `;
  const [issued] = await sql<{ id: unknown }>`
    select id from copy_status where status = 'issued' and is_overdue order by id limit 1
  `;
  return {
    settings: await loadSettings(sql),
    members: members.map((row) => ({ id: text(row.id), name: text(row.name) })),
    overdue: overdue.map(mapLoan),
    samples: {
      availableId: available ? text(available.id) : null,
      issuedId: issued ? text(issued.id) : null,
    },
  };
});

export const lookupCopy = createServerFn({ method: "GET" })
  .validator((input: { copyId?: string }) => ({ copyId: clip(input?.copyId, 20).toUpperCase() }))
  .handler(async ({ data }) => {
    if (!/^C-\d{5}$/.test(data.copyId)) {
      return { found: false as const, message: "Copy ids look like C-00042." };
    }
    const sql = await getSql();
    const [copy] = await sql<{
      id: unknown;
      title_id: unknown;
      title: unknown;
      author: unknown;
      category: unknown;
      shelf: unknown;
      isbn: unknown;
      status: unknown;
    }>`
      select id, title_id, title, author, category, shelf, isbn, status
      from copy_status where id = ${data.copyId}
    `;
    if (!copy) return { found: false as const, message: `No copy ${data.copyId} is on the shelf list.` };
    const history = (
      await sql<LoanSql>`
        select id, copy_id, member_id, member_name, title_id, title, author, category, shelf,
               issued_on, due_on, returned_on, is_open, is_overdue, days_past_due, chargeable_days, fine, paid
        from loan_accounts where copy_id = ${data.copyId}
        order by issued_on desc, id desc
        limit 6
      `
    ).map(mapLoan);
    const [hold] = await sql<{ member_id: unknown; member_name: unknown }>`
      select h.member_id, m.name as member_name
      from holds h join members m on m.id = h.member_id
      where h.title_id = ${int(copy.title_id)} and h.status = 'waiting'
      order by h.created_at
      limit 1
    `;
    return {
      found: true as const,
      copyId: text(copy.id),
      titleId: int(copy.title_id),
      title: text(copy.title),
      author: text(copy.author),
      category: text(copy.category),
      shelf: text(copy.shelf),
      isbn: copy.isbn == null ? null : text(copy.isbn),
      status: text(copy.status) === "issued" ? ("issued" as const) : ("available" as const),
      openLoan: history.find((row) => row.isOpen) ?? null,
      history,
      nextHold: hold
        ? { memberId: text(hold.member_id), memberName: text(hold.member_name) }
        : null,
    };
  });

export const issueCopy = createServerFn({ method: "POST" })
  .validator((input: { copyId?: string; memberId?: string }) => ({
    copyId: clip(input?.copyId, 20).toUpperCase(),
    memberId: clip(input?.memberId, 20).toUpperCase(),
  }))
  .handler(async ({ data }) => {
    if (!/^C-\d{5}$/.test(data.copyId)) return { ok: false as const, message: "Copy ids look like C-00042." };
    if (!/^M-\d{4,6}$/.test(data.memberId)) {
      return { ok: false as const, message: "Member ids look like M-1001." };
    }
    const sql = await getSql();
    try {
      const inserted = await sql<{ id: unknown; due_on: unknown }>`
        insert into loans (copy_id, member_id, issued_on, due_on)
        select ${data.copyId}, ${data.memberId}, current_date, current_date + s.loan_days
        from settings s
        where s.id = 1
          and exists (select 1 from copies where id = ${data.copyId})
          and exists (select 1 from members where id = ${data.memberId})
          and not exists (
            select 1 from loans where copy_id = ${data.copyId} and returned_on is null
          )
        returning id, due_on
      `;
      if (!inserted.length) {
        const [copy] = await sql<{ status: unknown; member_name: unknown; due_on: unknown }>`
          select status, member_name, due_on from copy_status where id = ${data.copyId}
        `;
        if (!copy) return { ok: false as const, message: `No copy ${data.copyId}.` };
        const [member] = await sql<{ id: unknown }>`select id from members where id = ${data.memberId}`;
        if (!member) return { ok: false as const, message: `No member ${data.memberId}.` };
        return {
          ok: false as const,
          message: `Copy ${data.copyId} is already issued to ${text(copy.member_name)} until ${day(copy.due_on)}. One physical copy cannot be out twice.`,
        };
      }
      const [titleRow] = await sql<{ title_id: unknown }>`
        select title_id from copies where id = ${data.copyId}
      `;
      const fulfilled = await sql<{ id: unknown }>`
        update holds set status = 'fulfilled'
        where title_id = ${int(titleRow?.title_id)}
          and member_id = ${data.memberId}
          and status = 'waiting'
        returning id
      `;
      const dueOn = day(inserted[0].due_on) ?? "";
      const holdNote = fulfilled.length ? " Their waiting hold on this title was marked fulfilled." : "";
      return {
        ok: true as const,
        message: `Issued ${data.copyId} to ${data.memberId}. Due ${dueOn}.${holdNote}`,
        dueOn,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (/loans_one_open_copy|duplicate key|unique/i.test(message)) {
        return { ok: false as const, message: "That copy is already on loan." };
      }
      throw err;
    }
  });

export const returnCopy = createServerFn({ method: "POST" })
  .validator((input: { copyId?: string }) => ({ copyId: clip(input?.copyId, 20).toUpperCase() }))
  .handler(async ({ data }) => {
    if (!/^C-\d{5}$/.test(data.copyId)) return { ok: false as const, message: "Copy ids look like C-00042." };
    const sql = await getSql();
    const updated = await sql<{ id: unknown }>`
      update loans set returned_on = current_date
      where copy_id = ${data.copyId} and returned_on is null
      returning id
    `;
    if (!updated.length) {
      return { ok: false as const, message: `${data.copyId} is not out on loan. Nothing was changed.` };
    }
    const [loan] = await sql<LoanSql>`
      select id, copy_id, member_id, member_name, title_id, title, author, category, shelf,
             issued_on, due_on, returned_on, is_open, is_overdue, days_past_due, chargeable_days, fine, paid
      from loan_accounts where id = ${int(updated[0].id)}
    `;
    const row = loan ? mapLoan(loan) : null;
    const fineNote =
      row && row.balance > 0
        ? ` Outstanding fine ${row.balance.toFixed(2)} remains on the loan record until a payment is entered.`
        : " No balance is left on this loan.";
    return {
      ok: true as const,
      message: `Returned ${data.copyId}. The loan row is kept so the history is not destroyed.${fineNote}`,
    };
  });

export const recordPayment = createServerFn({ method: "POST" })
  .validator((input: { loanId?: number; amount?: number; note?: string }) => ({
    loanId: int(input?.loanId),
    amount: num(input?.amount),
    note: clip(input?.note, 140),
  }))
  .handler(async ({ data }) => {
    if (data.loanId <= 0) return { ok: false as const, message: "Choose a loan first." };
    if (data.amount <= 0) return { ok: false as const, message: "Enter a payment greater than zero." };
    const sql = await getSql();
    const [loan] = await sql<LoanSql>`
      select id, copy_id, member_id, member_name, title_id, title, author, category, shelf,
             issued_on, due_on, returned_on, is_open, is_overdue, days_past_due, chargeable_days, fine, paid
      from loan_accounts where id = ${data.loanId}
    `;
    if (!loan) return { ok: false as const, message: "That loan does not exist." };
    const row = mapLoan(loan);
    if (row.balance <= 0) return { ok: false as const, message: "Nothing is owed on this loan." };
    if (data.amount - row.balance > 0.001) {
      return {
        ok: false as const,
        message: `Amount is above the outstanding fine (${row.balance.toFixed(2)}).`,
      };
    }
    await sql`
      insert into fine_payments (loan_id, amount, paid_on, note)
      values (${data.loanId}, ${data.amount}, current_date, ${data.note || "Desk payment"})
    `;
    return {
      ok: true as const,
      message: `Recorded ${data.amount.toFixed(2)} against loan ${data.loanId}. The loan row was not removed.`,
    };
  });

export const listMembers = createServerFn({ method: "GET" })
  .validator((input: { q?: string }) => ({ q: clip(input?.q, 80) }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const pattern = likePattern(data.q);
    const rows = await sql<{
      id: unknown;
      name: unknown;
      joined_on: unknown;
      open_loans: unknown;
      overdue_loans: unknown;
    }>`
      select m.id, m.name, m.joined_on,
        count(l.id) filter (where l.is_open)::int as open_loans,
        count(l.id) filter (where l.is_overdue)::int as overdue_loans
      from members m
      left join loan_accounts l on l.member_id = m.id
      where (${data.q} = '' or m.name ilike ${pattern} escape '\\' or m.id ilike ${pattern} escape '\\')
      group by m.id
      order by m.id
    `;
    const members: MemberRow[] = rows.map((row) => ({
      id: text(row.id),
      name: text(row.name),
      joinedOn: day(row.joined_on) ?? "",
      openLoans: int(row.open_loans),
      overdueLoans: int(row.overdue_loans),
    }));
    const nextNumber =
      members.reduce((max, member) => {
        const match = /^M-(\d+)$/.exec(member.id);
        return match ? Math.max(max, Number(match[1])) : max;
      }, 1000) + 1;
    return { members, nextId: `M-${nextNumber}` };
  });

export const getMember = createServerFn({ method: "GET" })
  .validator((input: { id?: string }) => ({ id: clip(input?.id, 20).toUpperCase() }))
  .handler(async ({ data }) => {
    if (!data.id) return { found: false as const };
    const sql = await getSql();
    const [member] = await sql<{ id: unknown; name: unknown; joined_on: unknown }>`
      select id, name, joined_on from members where id = ${data.id}
    `;
    if (!member) return { found: false as const };
    const history = (
      await sql<LoanSql>`
        select id, copy_id, member_id, member_name, title_id, title, author, category, shelf,
               issued_on, due_on, returned_on, is_open, is_overdue, days_past_due, chargeable_days, fine, paid
        from loan_accounts where member_id = ${data.id}
        order by issued_on desc, id desc
      `
    ).map(mapLoan);
    const suggestions = await sql<{ id: unknown; title: unknown; author: unknown; category: unknown }>`
      select t.id, t.title, t.author, t.category
      from titles t
      where t.category in (
        select t2.category
        from loans l
        join copies c on c.id = l.copy_id
        join titles t2 on t2.id = c.title_id
        where l.member_id = ${data.id}
        group by t2.category
        order by count(*) desc
        limit 2
      )
      and not exists (
        select 1 from loans l
        join copies c on c.id = l.copy_id
        where l.member_id = ${data.id} and c.title_id = t.id
      )
      and exists (
        select 1 from copy_status cs where cs.title_id = t.id and cs.status = 'available'
      )
      order by t.title
      limit 4
    `;
    return {
      found: true as const,
      member: {
        id: text(member.id),
        name: text(member.name),
        joinedOn: day(member.joined_on) ?? "",
      },
      history,
      suggestions: suggestions.map((row) => ({
        id: int(row.id),
        title: text(row.title),
        author: text(row.author),
        category: text(row.category),
        reason: "Matches subjects this card already borrows, and a copy is in",
      })) satisfies Suggestion[],
    };
  });

export const addMember = createServerFn({ method: "POST" })
  .validator((input: { id?: string; name?: string }) => ({
    id: clip(input?.id, 20).toUpperCase(),
    name: clip(input?.name, 60),
  }))
  .handler(async ({ data }) => {
    if (!/^M-\d{4,6}$/.test(data.id)) {
      return { ok: false as const, message: "Member id must look like M-1029." };
    }
    if (data.name.length < 2) return { ok: false as const, message: "Enter a display name (at least 2 letters)." };
    if (data.name.includes("@")) {
      return { ok: false as const, message: "Do not store email addresses. This desk keeps only an id and a display name." };
    }
    const sql = await getSql();
    const inserted = await sql<{ id: unknown }>`
      insert into members (id, name)
      select ${data.id}, ${data.name}
      where not exists (select 1 from members where id = ${data.id})
      returning id
    `;
    if (!inserted.length) return { ok: false as const, message: `${data.id} is already on the register.` };
    return { ok: true as const, message: `Added ${data.id}.`, id: data.id };
  });

export const addTitle = createServerFn({ method: "POST" })
  .validator(
    (input: {
      title?: string;
      author?: string;
      category?: string;
      year?: string;
      isbn?: string;
      copies?: number;
      shelf?: string;
    }) => ({
      title: clip(input?.title, 160),
      author: clip(input?.author, 160),
      category: clip(input?.category, 40),
      year: clip(input?.year, 8),
      isbn: clip(input?.isbn, 24),
      copies: Math.min(5, Math.max(1, int(input?.copies) || 1)),
      shelf: clip(input?.shelf, 16).toUpperCase(),
    }),
  )
  .handler(async ({ data }) => {
    if (data.title.length < 2 || data.author.length < 2 || data.category.length < 2) {
      return { ok: false as const, message: "Title, author, and subject are required." };
    }
    let year: number | null = null;
    if (data.year) {
      year = Number(data.year);
      if (!Number.isInteger(year) || year < -2000 || year > 2100) {
        return { ok: false as const, message: "Year must be a whole number, or left blank." };
      }
    }
    const shelf = data.shelf || `${data.category.slice(0, 2).toUpperCase()}-1`;
    const sql = await getSql();
    const [created] = await sql<{ id: unknown }>`
      insert into titles (id, title, author, category, isbn, year)
      select coalesce(max(id), 0) + 1, ${data.title}, ${data.author}, ${data.category},
             ${data.isbn || null}, ${year}
      from titles
      returning id
    `;
    const titleId = int(created?.id);
    const copyRows = await sql<{ id: unknown }>`
      insert into copies (id, title_id, shelf)
      select 'C-' || lpad((base.n + g.i)::text, 5, '0'), ${titleId}, ${shelf}
      from (select coalesce(max(substring(id from 3)::int), 0) as n from copies) base
      cross join generate_series(1, ${data.copies}) as g(i)
      returning id
    `;
    return {
      ok: true as const,
      message: `Added “${data.title}” with ${copyRows.map((row) => text(row.id)).join(", ")}.`,
      titleId,
    };
  });

export const listOverdue = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<LoanSql>`
    select id, copy_id, member_id, member_name, title_id, title, author, category, shelf,
           issued_on, due_on, returned_on, is_open, is_overdue, days_past_due, chargeable_days, fine, paid
    from loan_accounts
    where is_overdue
    order by due_on, id
  `;
  return { settings: await loadSettings(sql), rows: rows.map(mapLoan) };
});

export const listHolds = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<{
    id: unknown;
    status: unknown;
    placed_on: unknown;
    title_id: unknown;
    title: unknown;
    author: unknown;
    member_id: unknown;
    member_name: unknown;
    available: unknown;
  }>`
    select h.id, h.status, to_char(h.created_at, 'YYYY-MM-DD') as placed_on,
           h.title_id, t.title, t.author, h.member_id, m.name as member_name,
           (select count(*) from copy_status cs where cs.title_id = h.title_id and cs.status = 'available')::int as available
    from holds h
    join titles t on t.id = h.title_id
    join members m on m.id = h.member_id
    order by case h.status when 'waiting' then 0 when 'fulfilled' then 1 else 2 end, h.created_at
  `;
  const holds: HoldRow[] = rows.map((row) => ({
    id: int(row.id),
    status: text(row.status),
    placedOn: day(row.placed_on) ?? "",
    titleId: int(row.title_id),
    title: text(row.title),
    author: text(row.author),
    memberId: text(row.member_id),
    memberName: text(row.member_name),
    available: int(row.available),
  }));
  return { holds };
});

export const placeHold = createServerFn({ method: "POST" })
  .validator((input: { titleId?: number; memberId?: string }) => ({
    titleId: int(input?.titleId),
    memberId: clip(input?.memberId, 20).toUpperCase(),
  }))
  .handler(async ({ data }) => {
    if (data.titleId <= 0) return { ok: false as const, message: "Choose a title." };
    if (!/^M-\d{4,6}$/.test(data.memberId)) {
      return { ok: false as const, message: "Member ids look like M-1001." };
    }
    const sql = await getSql();
    try {
      const inserted = await sql<{ id: unknown }>`
        insert into holds (title_id, member_id, status)
        select ${data.titleId}, ${data.memberId}, 'waiting'
        where exists (select 1 from titles where id = ${data.titleId})
          and exists (select 1 from members where id = ${data.memberId})
          and not exists (
            select 1 from holds
            where title_id = ${data.titleId} and member_id = ${data.memberId} and status = 'waiting'
          )
        returning id
      `;
      if (!inserted.length) {
        return { ok: false as const, message: "Could not place that hold. The title, member, or an existing wait may be the reason." };
      }
      return { ok: true as const, message: `Hold placed for ${data.memberId}.` };
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (/holds_one_waiting|duplicate key|unique/i.test(message)) {
        return { ok: false as const, message: "That member is already waiting for this title." };
      }
      throw err;
    }
  });

export const setHoldStatus = createServerFn({ method: "POST" })
  .validator((input: { id?: number; status?: string }) => ({
    id: int(input?.id),
    status: input?.status === "fulfilled" ? "fulfilled" : "cancelled",
  }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const updated = await sql<{ id: unknown }>`
      update holds set status = ${data.status}
      where id = ${data.id} and status = 'waiting'
      returning id
    `;
    if (!updated.length) {
      return { ok: false as const, message: "That hold is no longer waiting. It was not deleted." };
    }
    return {
      ok: true as const,
      message:
        data.status === "cancelled"
          ? "Hold cancelled. The row stays in the list so the request is still on record."
          : "Hold marked fulfilled.",
    };
  });

export const updateSettings = createServerFn({ method: "POST" })
  .validator(
    (input: {
      loanDays?: number;
      graceDays?: number;
      finePerDay?: number;
      maxFine?: number;
      currency?: string;
    }) => ({
      loanDays: int(input?.loanDays),
      graceDays: int(input?.graceDays),
      finePerDay: num(input?.finePerDay),
      maxFine: num(input?.maxFine),
      currency: clip(input?.currency, 8).toUpperCase(),
    }),
  )
  .handler(async ({ data }) => {
    if (data.loanDays < 1 || data.loanDays > 90) {
      return { ok: false as const, message: "Loan length must be between 1 and 90 days." };
    }
    if (data.graceDays < 0 || data.graceDays > 30) {
      return { ok: false as const, message: "Grace days must be between 0 and 30." };
    }
    if (data.finePerDay < 0 || data.finePerDay > 10000 || data.maxFine < 0 || data.maxFine > 1000000) {
      return { ok: false as const, message: "Fine amounts are out of the allowed range." };
    }
    if (!/^[A-Z]{3,8}$/.test(data.currency)) {
      return { ok: false as const, message: "Currency should be 3 to 8 letters, such as PKR." };
    }
    const sql = await getSql();
    await sql`
      update settings
      set loan_days = ${data.loanDays},
          grace_days = ${data.graceDays},
          fine_per_day = ${data.finePerDay},
          max_fine = ${data.maxFine},
          currency = ${data.currency}
      where id = 1
    `;
    return { ok: true as const, message: "Fine rule saved. Every screen reads this one row.", settings: await loadSettings(sql) };
  });

export const exportCsv = createServerFn({ method: "POST" })
  .validator((input: { kind?: string; ids?: number[] }) => ({
    kind: clip(input?.kind, 20),
    ids: Array.isArray(input?.ids) ? input.ids.map((id) => int(id)).filter((id) => id > 0).slice(0, 80) : [],
  }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    if (data.kind === "catalog" || data.kind === "selected") {
      const selected = data.kind === "selected";
      if (selected && !data.ids.length) {
        return { ok: false as const, message: "Select at least one title." };
      }
      const rows = await sql<{
        copy_id: unknown;
        title: unknown;
        author: unknown;
        category: unknown;
        isbn: unknown;
        year: unknown;
        shelf: unknown;
        status: unknown;
        member_id: unknown;
        due_on: unknown;
      }>`
        select cs.id as copy_id, cs.title, cs.author, cs.category, cs.isbn, cs.year, cs.shelf,
               cs.status, cs.member_id, cs.due_on
        from copy_status cs
        where (${selected} = false or cs.title_id = any(${data.ids}))
        order by cs.title, cs.id
      `;
      return {
        ok: true as const,
        filename: selected ? "quire-selected-copies.csv" : "quire-catalog.csv",
        csv: toCsv(
          ["copy_id", "title", "author", "category", "isbn", "year", "shelf", "status", "issued_to", "due_on"],
          rows.map((row) => [
            text(row.copy_id),
            text(row.title),
            text(row.author),
            text(row.category),
            row.isbn == null ? "" : text(row.isbn),
            row.year == null ? "" : int(row.year),
            text(row.shelf),
            text(row.status),
            row.member_id == null ? "" : text(row.member_id),
            day(row.due_on) ?? "",
          ]),
        ),
      };
    }
    if (data.kind === "circulation" || data.kind === "overdue" || data.kind === "open") {
      const rows = await sql<LoanSql>`
        select id, copy_id, member_id, member_name, title_id, title, author, category, shelf,
               issued_on, due_on, returned_on, is_open, is_overdue, days_past_due, chargeable_days, fine, paid
        from loan_accounts
        where (${data.kind} = 'circulation')
           or (${data.kind} = 'overdue' and is_overdue)
           or (${data.kind} = 'open' and is_open)
        order by issued_on, id
      `;
      const mapped = rows.map(mapLoan);
      const filename =
        data.kind === "overdue"
          ? "quire-overdue.csv"
          : data.kind === "open"
            ? "quire-open-loans.csv"
            : "quire-circulation.csv";
      return {
        ok: true as const,
        filename,
        csv: toCsv(
          [
            "loan_id",
            "copy_id",
            "member_id",
            "member_name",
            "title",
            "author",
            "category",
            "issued_on",
            "due_on",
            "returned_on",
            "status",
            "days_past_due",
            "chargeable_days",
            "fine",
            "paid",
            "balance",
          ],
          mapped.map((row) => [
            row.id,
            row.copyId,
            row.memberId,
            row.memberName,
            row.title,
            row.author,
            row.category,
            row.issuedOn,
            row.dueOn,
            row.returnedOn ?? "",
            row.isOpen ? (row.isOverdue ? "overdue" : "issued") : "returned",
            row.daysPastDue,
            row.chargeableDays,
            row.fine,
            row.paid,
            row.balance,
          ]),
        ),
      };
    }
    if (data.kind !== "members") {
      return { ok: false as const, message: "Unknown report." };
    }
    const members = await sql<{
      id: unknown;
      name: unknown;
      joined_on: unknown;
      open_loans: unknown;
      overdue_loans: unknown;
    }>`
      select m.id, m.name, m.joined_on,
        count(l.id) filter (where l.is_open)::int as open_loans,
        count(l.id) filter (where l.is_overdue)::int as overdue_loans
      from members m
      left join loan_accounts l on l.member_id = m.id
      group by m.id
      order by m.id
    `;
    return {
      ok: true as const,
      filename: "quire-members.csv",
      csv: toCsv(
        ["member_id", "name", "joined_on", "open_loans", "overdue_loans"],
        members.map((row) => [
          text(row.id),
          text(row.name),
          day(row.joined_on) ?? "",
          int(row.open_loans),
          int(row.overdue_loans),
        ]),
      ),
    };
  });

