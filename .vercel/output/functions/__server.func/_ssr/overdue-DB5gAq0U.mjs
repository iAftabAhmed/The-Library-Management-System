import { x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AppShell } from "./library.functions-KIbu8AHY.mjs";
import { r as Route$2 } from "./router-gIPqeKvf.mjs";
import { c as formatDay, i as PageHead, l as money } from "./bits-C1HPm7sd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/overdue-DB5gAq0U.js
var import_jsx_runtime = require_jsx_runtime();
function OverduePage() {
	const { rows, settings } = Route$2.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHead, {
			title: "Overdue",
			lede: `A copy is overdue when it is still out and today is after the due date. The fine uses chargeable days, which subtract the ${settings.graceDays}-day grace. During grace the row is listed and the fine is zero.`
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-3 text-sm tabular-nums text-muted",
			children: [rows.length, " copies"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "text-xs text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 pr-3 font-medium",
							children: "Copy"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 pr-3 font-medium",
							children: "Title"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 pr-3 font-medium",
							children: "Member"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 pr-3 font-medium",
							children: "Due"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 pr-3 font-medium",
							children: "Past due"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 pr-3 font-medium",
							children: "Chargeable"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 font-medium",
							children: "Balance"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-line",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2 pr-3 font-mono text-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/desk",
								className: "underline decoration-line underline-offset-2",
								children: row.copyId
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2 pr-3",
							children: row.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "py-2 pr-3",
							children: [row.memberName, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs text-muted",
								children: row.memberId
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2 pr-3 whitespace-nowrap tabular-nums",
							children: formatDay(row.dueOn)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2 pr-3 tabular-nums",
							children: row.daysPastDue
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2 pr-3 tabular-nums",
							children: row.chargeableDays
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2 tabular-nums",
							children: money(row.balance, settings.currency)
						})
					]
				}, row.id)) })]
			})
		}),
		!rows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted",
			children: "Nothing is overdue."
		}) : null
	] });
}
//#endregion
export { OverduePage as component };
