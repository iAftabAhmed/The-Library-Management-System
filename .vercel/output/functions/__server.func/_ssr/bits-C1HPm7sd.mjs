import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bits-C1HPm7sd.js
var import_jsx_runtime = require_jsx_runtime();
function money(amount, currency) {
	const [whole, frac] = (Math.round((Number(amount) || 0) * 100) / 100).toFixed(2).split(".");
	const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return `${currency} ${frac === "00" ? withCommas : `${withCommas}.${frac}`}`;
}
function yearLabel(year) {
	if (year == null) return "";
	if (year < 0) return `${-year} BCE`;
	return String(year);
}
var MONTHS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
];
function formatDay(iso) {
	if (!iso) return "—";
	const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
	if (!y || !m || !d) return iso;
	return `${d} ${MONTHS[m - 1]} ${y}`;
}
function downloadText(filename, text) {
	const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}
function PageHead({ title, lede }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mb-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-serif text-3xl font-semibold tracking-tight",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 max-w-2xl text-pretty text-muted",
			children: lede
		})]
	});
}
function Notice({ tone, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		role: "status",
		className: tone === "ok" ? "rounded-xl bg-binding-soft px-3 py-2 text-sm text-binding" : "rounded-xl bg-overdue-soft px-3 py-2 text-sm text-overdue",
		children
	});
}
function StatusPill({ status, overdue = false }) {
	if (overdue) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-flex rounded-full bg-overdue-soft px-2 py-0.5 text-xs font-semibold text-overdue",
		children: "Overdue"
	});
	if (status === "available") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-flex rounded-full bg-binding-soft px-2 py-0.5 text-xs font-semibold text-binding",
		children: "Available"
	});
	if (status === "returned") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-flex rounded-full bg-paper px-2 py-0.5 text-xs font-semibold text-muted",
		children: "Returned"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-flex rounded-full bg-line px-2 py-0.5 text-xs font-semibold text-ink",
		children: "Issued"
	});
}
function Stat({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "card px-4 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold tracking-wide text-muted uppercase",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-serif text-3xl tabular-nums",
				children: value
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: hint
			}) : null
		]
	});
}
function Barcode({ value }) {
	const bars = [];
	const widths = [];
	for (const ch of value) {
		const n = ch.charCodeAt(0);
		[
			n & 1 ? "w-0.5" : "w-px",
			"w-px",
			n & 2 ? "w-1" : "w-px",
			"w-0.5",
			n & 4 ? "w-0.5" : "w-px",
			"w-px"
		].forEach((width, index) => {
			bars.push(index % 2 === 0 ? "ink" : "gap");
			widths.push(width);
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-10 items-stretch",
		"aria-hidden": true,
		children: bars.map((kind, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `${widths[index]} ${kind === "ink" ? "bg-ink" : "bg-transparent"}` }, `${value}-${index}`))
	});
}
function LoanTable({ rows, currency }) {
	if (!rows.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "No loans on record."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
						children: "Issued"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-2 pr-3 font-medium",
						children: "Due"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-2 pr-3 font-medium",
						children: "Returned"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-2 pr-3 font-medium",
						children: "Fine"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-2 font-medium",
						children: "Balance"
					})
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-t border-line align-top",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-2 pr-3 font-mono text-xs",
						children: row.copyId
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
						children: formatDay(row.issuedOn)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-2 pr-3 whitespace-nowrap tabular-nums",
						children: formatDay(row.dueOn)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-2 pr-3 whitespace-nowrap",
						children: row.returnedOn ? formatDay(row.returnedOn) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
							status: "issued",
							overdue: row.isOverdue
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-2 pr-3 tabular-nums",
						children: money(row.fine, currency)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-2 tabular-nums",
						children: money(row.balance, currency)
					})
				]
			}, row.id)) })]
		})
	});
}
//#endregion
export { Stat as a, formatDay as c, PageHead as i, money as l, LoanTable as n, StatusPill as o, Notice as r, downloadText as s, Barcode as t, yearLabel as u };
