import { o as __toESM } from "../_runtime.mjs";
import { J as require_react, b as useRouter, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as updateSettings, t as AppShell } from "./library.functions-KIbu8AHY.mjs";
import { n as Route } from "./router-gIPqeKvf.mjs";
import { i as PageHead, l as money, r as Notice } from "./bits-C1HPm7sd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rules-Dd0WRFuT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RulesPage() {
	const saved = Route.useLoaderData();
	const router = useRouter();
	const [loanDays, setLoanDays] = (0, import_react.useState)(saved.loanDays);
	const [graceDays, setGraceDays] = (0, import_react.useState)(saved.graceDays);
	const [finePerDay, setFinePerDay] = (0, import_react.useState)(saved.finePerDay);
	const [maxFine, setMaxFine] = (0, import_react.useState)(saved.maxFine);
	const [currency, setCurrency] = (0, import_react.useState)(saved.currency);
	const [daysLate, setDaysLate] = (0, import_react.useState)(10);
	const [notice, setNotice] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const chargeable = Math.max(0, daysLate - graceDays);
	const fine = Math.min(maxFine, chargeable * finePerDay);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHead, {
		title: "Fine rule",
		lede: "One settings row drives every screen. Fines are calculated when you look at a loan. They are not copied onto the loan, so changing the rule changes the numbers you see. Payments already taken stay as their own rows."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "card grid gap-3 p-4",
			onSubmit: async (event) => {
				event.preventDefault();
				setBusy(true);
				setError(null);
				const result = await updateSettings({ data: {
					loanDays,
					graceDays,
					finePerDay,
					maxFine,
					currency
				} });
				setBusy(false);
				if (!result.ok) {
					setError(result.message);
					return;
				}
				setNotice(result.message);
				await router.invalidate();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm",
					children: ["Loan length (days)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field mt-1",
						type: "number",
						min: 1,
						max: 90,
						value: loanDays,
						onChange: (event) => setLoanDays(Number(event.target.value))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm",
					children: ["Grace days with no charge", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field mt-1",
						type: "number",
						min: 0,
						max: 30,
						value: graceDays,
						onChange: (event) => setGraceDays(Number(event.target.value))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm",
					children: ["Fine per chargeable day", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field mt-1",
						type: "number",
						min: 0,
						step: "0.5",
						value: finePerDay,
						onChange: (event) => setFinePerDay(Number(event.target.value))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm",
					children: ["Maximum fine on one loan", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field mt-1",
						type: "number",
						min: 0,
						step: "1",
						value: maxFine,
						onChange: (event) => setMaxFine(Number(event.target.value))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm",
					children: ["Currency label", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field mt-1",
						value: currency,
						maxLength: 8,
						onChange: (event) => setCurrency(event.target.value.toUpperCase())
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn btn-primary",
					type: "submit",
					disabled: busy,
					children: "Save rule"
				}),
				notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, {
					tone: "ok",
					children: notice
				}) : null,
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, {
					tone: "bad",
					children: error
				}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "card p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-xl font-semibold",
					children: "Worked example"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-pretty",
					children: "Suppose a copy is still out, or was returned, this many days after the due date."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-3 block text-sm",
					children: [
						"Days after the due date: ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: daysLate
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "mt-2 w-full accent-binding",
							type: "range",
							min: 0,
							max: 40,
							value: daysLate,
							onChange: (event) => setDaysLate(Number(event.target.value))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 font-mono text-sm leading-relaxed",
					children: [
						"chargeable = max(0, ",
						daysLate,
						" − ",
						graceDays,
						") = ",
						chargeable,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"fine = min(",
						maxFine,
						", ",
						chargeable,
						" × ",
						finePerDay,
						") = ",
						fine
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-lg tabular-nums",
					children: money(fine, currency || "PKR")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm text-muted",
					children: [
						"The database view ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono",
							children: "loan_accounts"
						}),
						" uses this same formula, with the return date or today as the “as of” date."
					]
				})
			]
		})]
	})] });
}
//#endregion
export { RulesPage as component };
