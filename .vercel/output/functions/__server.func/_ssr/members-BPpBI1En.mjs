import { o as __toESM } from "../_runtime.mjs";
import { J as require_react, b as useRouter, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as addMember, t as AppShell } from "./library.functions-KIbu8AHY.mjs";
import { i as Route$3 } from "./router-gIPqeKvf.mjs";
import { c as formatDay, i as PageHead, l as money, n as LoanTable, r as Notice } from "./bits-C1HPm7sd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/members-BPpBI1En.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MembersPage() {
	const { list, detail, settings } = Route$3.useLoaderData();
	const search = Route$3.useSearch();
	const navigate = Route$3.useNavigate();
	const router = useRouter();
	const [q, setQ] = (0, import_react.useState)(search.q);
	const [id, setId] = (0, import_react.useState)(list.nextId);
	const [name, setName] = (0, import_react.useState)("");
	const [notice, setNotice] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHead, {
			title: "Members",
			lede: "A member card is an id plus a display name. These names are fictional. Borrowing history is the list of loan rows for that id, including books already returned."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "flex flex-col gap-2 sm:flex-row",
			onSubmit: (event) => {
				event.preventDefault();
				navigate({ search: (prev) => ({
					...prev,
					q
				}) });
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "field",
				value: q,
				placeholder: "Name or M-1001",
				"aria-label": "Search members",
				onChange: (event) => setQ(event.target.value)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "btn btn-primary",
				type: "submit",
				children: "Search"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 grid gap-2",
			children: [notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, {
				tone: "ok",
				children: notice
			}) : null, error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, {
				tone: "bad",
				children: error
			}) : null]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid items-start gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-2",
				children: list.members.map((member) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: `card w-full px-3 py-3 text-left ${search.card === member.id ? "border-binding" : ""}`,
					onClick: () => void navigate({ search: (prev) => ({
						...prev,
						card: member.id
					}) }),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs",
							children: member.id
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block font-serif text-lg font-semibold",
							children: member.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted tabular-nums",
							children: [
								"Joined ",
								formatDay(member.joinedOn),
								" · ",
								member.openLoans,
								" open · ",
								member.overdueLoans,
								" overdue"
							]
						})
					]
				}) }, member.id))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [detail?.found ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl font-semibold",
						children: detail.member.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							detail.member.id,
							" · joined ",
							formatDay(detail.member.joinedOn)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm tabular-nums",
						children: [
							"Open balance",
							" ",
							money(detail.history.filter((row) => row.isOpen).reduce((sum, row) => sum + row.balance, 0), settings.currency)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-4 text-sm font-semibold",
						children: "Borrowing history"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoanTable, {
						rows: detail.history,
						currency: settings.currency
					}),
					detail.suggestions.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-4 text-sm font-semibold",
						children: "Worth offering"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 grid gap-1 text-sm",
						children: detail.suggestions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							item.title,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted",
								children: [
									"· ",
									item.reason,
									"."
								]
							})
						] }, item.id))
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "No subject-based suggestion yet. Issue a book first."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
				className: "card p-4 text-sm text-muted",
				children: "Select a card to see every loan, open or returned."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "card mt-3 grid gap-2 p-4",
				onSubmit: async (event) => {
					event.preventDefault();
					setError(null);
					const result = await addMember({ data: {
						id,
						name
					} });
					if (!result.ok) {
						setError(result.message);
						return;
					}
					setNotice(result.message);
					setName("");
					await router.invalidate();
					navigate({ search: (prev) => ({
						...prev,
						card: result.id,
						q: ""
					}) });
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-lg font-semibold",
						children: "New demonstration card"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field font-mono",
						value: id,
						"aria-label": "Member id",
						onChange: (event) => setId(event.target.value.toUpperCase())
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						placeholder: "Display name",
						value: name,
						"aria-label": "Display name",
						onChange: (event) => setName(event.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn btn-primary",
						type: "submit",
						children: "Add member"
					})
				]
			})] })]
		})
	] });
}
//#endregion
export { MembersPage as component };
