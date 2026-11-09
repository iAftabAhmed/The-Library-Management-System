import { x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AppShell } from "./library.functions-KIbu8AHY.mjs";
import { l as Route$8 } from "./router-gIPqeKvf.mjs";
import { a as Stat, c as formatDay, i as PageHead, l as money, n as LoanTable, o as StatusPill } from "./bits-C1HPm7sd.mjs";
import { a as ResponsiveContainer, i as Bar, n as YAxis, o as Tooltip, r as XAxis, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-7jp5KPZn.js
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const data = Route$8.useLoaderData();
	const { settings } = data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHead, {
			title: "Reading room",
			lede: "One desk for the catalog, the copies on the shelf, and every issue and return. Counts below are the four the brief asks for, read live from the database."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Total copies",
					value: String(data.totalCopies),
					hint: `${data.titles} titles`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Available",
					value: String(data.availableCopies),
					hint: "No open loan"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Issued",
					value: String(data.issuedCopies),
					hint: "Out right now"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Overdue",
					value: String(data.overdueCopies),
					hint: "Still out, past due"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-3 grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-xl font-semibold",
						children: "Loans by subject"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 text-sm text-muted",
						children: "Every loan ever recorded, including ones already returned."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-64 w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: data.byCategory,
								margin: {
									left: 0,
									right: 8,
									top: 8,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "category",
										hide: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										allowDecimals: false,
										width: 32,
										stroke: "var(--color-muted)",
										fontSize: 12
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										cursor: { fill: "var(--color-paper)" },
										contentStyle: {
											background: "var(--color-surface)",
											border: "1px solid var(--color-line)",
											borderRadius: 12,
											color: "var(--color-ink)"
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "loans",
										fill: "var(--color-binding)",
										radius: [
											6,
											6,
											0,
											0
										]
									})
								]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 flex flex-wrap gap-2 text-xs text-muted",
						children: data.byCategory.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							row.category,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums text-ink",
								children: row.loans
							})
						] }, row.category))
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-xl font-semibold",
						children: "Fine rule"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-pretty",
						children: [
							"Loan length ",
							settings.loanDays,
							" days. Grace ",
							settings.graceDays,
							" day",
							settings.graceDays === 1 ? "" : "s",
							". Then ",
							money(settings.finePerDay, settings.currency),
							" per day, capped at ",
							money(settings.maxFine, settings.currency),
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: ["Outstanding on open loans: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums text-ink",
							children: money(data.outstandingFines, settings.currency)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/desk",
							className: "btn btn-primary",
							children: "Open the desk"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/overdue",
							className: "btn btn-line",
							children: "Review overdue"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-xs text-muted",
						children: [data.members, " demonstration member cards."]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "card mt-3 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-xl font-semibold",
						children: "Latest transactions"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: "returned" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-3 text-sm text-muted",
					children: ["A return fills in the date. It does not remove the row. Newest loan id first.", data.recent[0] ? ` Latest due ${formatDay(data.recent[0].dueOn)}.` : ""]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoanTable, {
					rows: data.recent,
					currency: settings.currency
				})
			]
		})
	] });
}
//#endregion
export { Dashboard as component };
