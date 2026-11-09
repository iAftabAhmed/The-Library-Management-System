import { o as __toESM } from "../_runtime.mjs";
import { J as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as exportCsv, t as AppShell } from "./library.functions-KIbu8AHY.mjs";
import { i as PageHead, r as Notice, s as downloadText } from "./bits-C1HPm7sd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-DCzdtya_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var REPORTS = [
	{
		kind: "catalog",
		title: "Full catalog",
		body: "Every physical copy, with title, author, subject, demo ISBN, shelf, and whether it is in or out."
	},
	{
		kind: "open",
		title: "Open loans",
		body: "Copies that are issued right now, with due date, fine, and balance."
	},
	{
		kind: "overdue",
		title: "Overdue list",
		body: "The same rows as the Overdue screen, as a file you can attach to the report."
	},
	{
		kind: "circulation",
		title: "Circulation history",
		body: "Every loan, including returned ones. This is the evidence that history is not deleted."
	},
	{
		kind: "members",
		title: "Member register",
		body: "Member id, display name, and how many loans are open or overdue."
	}
];
function ReportsPage() {
	const [notice, setNotice] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHead, {
			title: "Reports",
			lede: "Export CSV files for the submission. Selected titles are exported from the Catalog page. These buttons export a whole set."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 grid gap-2",
			children: [notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, {
				tone: "ok",
				children: notice
			}) : null, error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, {
				tone: "bad",
				children: error
			}) : null]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid gap-3",
			children: REPORTS.map((report) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "card flex flex-col gap-3 p-4 sm:flex-row sm:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-xl font-semibold",
						children: report.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-pretty text-muted",
						children: report.body
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn btn-primary",
					type: "button",
					disabled: busy !== null,
					onClick: async () => {
						setBusy(report.kind);
						setError(null);
						const result = await exportCsv({ data: {
							kind: report.kind,
							ids: []
						} });
						setBusy(null);
						if (!result.ok) {
							setError(result.message);
							return;
						}
						downloadText(result.filename, result.csv);
						setNotice(`Downloaded ${result.filename}.`);
					},
					children: busy === report.kind ? "Preparing…" : "Download CSV"
				})]
			}, report.kind))
		})
	] });
}
//#endregion
export { ReportsPage as component };
