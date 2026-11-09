import { o as __toESM } from "../_runtime.mjs";
import { J as require_react, x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as LayoutDashboard, c as BookMarked, i as Library, l as ArrowLeftRight, o as Download, r as SlidersHorizontal, s as Compass, t as Users, u as AlarmClock } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/library.functions-KIbu8AHY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		to: "/",
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		to: "/catalog",
		label: "Catalog",
		icon: Library
	},
	{
		to: "/desk",
		label: "Desk",
		icon: ArrowLeftRight
	},
	{
		to: "/members",
		label: "Members",
		icon: Users
	},
	{
		to: "/overdue",
		label: "Overdue",
		icon: AlarmClock
	},
	{
		to: "/holds",
		label: "Holds",
		icon: BookMarked
	},
	{
		to: "/reports",
		label: "Reports",
		icon: Download
	},
	{
		to: "/rules",
		label: "Fine rule",
		icon: SlidersHorizontal
	},
	{
		to: "/guide",
		label: "How it works",
		icon: Compass
	}
];
function AppShell({ children }) {
	const [operator, setOperator] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		setOperator(window.localStorage.getItem("quire-operator") ?? "");
	}, []);
	function saveOperator(value) {
		setOperator(value);
		window.localStorage.setItem("quire-operator", value.slice(0, 40));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center gap-3 px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex min-w-0 items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-9 shrink-0 place-items-center rounded-lg bg-binding text-on-binding",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Library, {
								className: "size-4",
								"aria-hidden": true
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-serif text-xl leading-none font-semibold",
								children: "Quire"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-xs text-muted",
								children: "EF101-P15 · circulation desk"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "ms-auto hidden min-w-0 items-center gap-2 text-xs text-muted sm:flex",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0",
							children: "On duty"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field min-h-9 w-36 py-1 text-sm",
							value: operator,
							maxLength: 40,
							placeholder: "Your name",
							"aria-label": "Librarian on duty, stored only on this device",
							onChange: (event) => saveOperator(event.target.value)
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3 pb-3",
					"aria-label": "Sections",
					children: NAV.map((item) => {
						const Icon = item.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							activeOptions: { exact: item.to === "/" },
							className: "nav-link",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "size-4",
								"aria-hidden": true
							}), item.label]
						}, item.to);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto w-full max-w-6xl px-4 py-6",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "mx-auto max-w-6xl px-4 pb-10 text-xs text-pretty text-muted",
				children: "Demonstration catalog for EF101-P15. Titles are well-known published works. Identifiers starting with DEM- are synthetic, not registered ISBNs. Member names are fictional. Do not enter real student records. The name in “On duty” stays in this browser only."
			})
		]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function int(value) {
	const n = typeof value === "number" ? value : Number(value);
	return Number.isFinite(n) ? Math.trunc(n) : 0;
}
function num(value) {
	const n = typeof value === "number" ? value : Number(value);
	return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
}
function text(value) {
	return value == null ? "" : String(value);
}
function clip(value, max) {
	return text(value).trim().slice(0, max);
}
var getSummary = createServerFn({ method: "GET" }).handler(createSsrRpc("c71d3a614d4459a4764a0d053696e16c4ecfdfdfbba6ec70b00bb50c35b8fc91"));
var getSettings = createServerFn({ method: "GET" }).handler(createSsrRpc("abdd78e94f6ec692573e011dc4bdabb6fa001dc083166da4e02287fc8e79f292"));
var searchCatalog = createServerFn({ method: "GET" }).validator((input) => {
	const availability = input?.availability === "available" || input?.availability === "issued" ? input.availability : "all";
	const page = int(input?.page);
	return {
		q: clip(input?.q, 80),
		category: clip(input?.category, 40),
		availability,
		page: page > 0 ? page : 1
	};
}).handler(createSsrRpc("1b6665aae3c263473b4e16f6b95fb6e73a755a36c3baca9aa9c798447bb9c805"));
var getTitle = createServerFn({ method: "GET" }).validator((input) => ({ id: int(input?.id) })).handler(createSsrRpc("b6302c78072b7341a91452d98e6dc5f69e30af1680ceaa400d754ac44c5c08bc"));
var getDesk = createServerFn({ method: "GET" }).handler(createSsrRpc("f0bf751d2e23e91195d5f612eb95b0093ed365871b060ddddce5584900fbd6e8"));
var lookupCopy = createServerFn({ method: "GET" }).validator((input) => ({ copyId: clip(input?.copyId, 20).toUpperCase() })).handler(createSsrRpc("20054a704ddd6ce387a88834e2bc117544be2c324b9d1d2069dfad361b05e8af"));
var issueCopy = createServerFn({ method: "POST" }).validator((input) => ({
	copyId: clip(input?.copyId, 20).toUpperCase(),
	memberId: clip(input?.memberId, 20).toUpperCase()
})).handler(createSsrRpc("8689f11819a4867ee6c38bb6a131cbf692757e9ef1c248ff54c0ad4200ce3def"));
var returnCopy = createServerFn({ method: "POST" }).validator((input) => ({ copyId: clip(input?.copyId, 20).toUpperCase() })).handler(createSsrRpc("b33f3a1a78f00db34ded4badfa42ffcc86627489699332a2a1de8f21332fa307"));
var recordPayment = createServerFn({ method: "POST" }).validator((input) => ({
	loanId: int(input?.loanId),
	amount: num(input?.amount),
	note: clip(input?.note, 140)
})).handler(createSsrRpc("85ba0391e46407304e615605fe89626bd33a9809035165d0eb95e566a955ee8f"));
var listMembers = createServerFn({ method: "GET" }).validator((input) => ({ q: clip(input?.q, 80) })).handler(createSsrRpc("c4acfa2225c13a363c3e2a0ef255912522ac58ed8f6bc4f03c2abf489831121b"));
var getMember = createServerFn({ method: "GET" }).validator((input) => ({ id: clip(input?.id, 20).toUpperCase() })).handler(createSsrRpc("8eb65d666e9657095707b1cd8c9ca774730508361c1d2b08ea9ab2068ca443dc"));
var addMember = createServerFn({ method: "POST" }).validator((input) => ({
	id: clip(input?.id, 20).toUpperCase(),
	name: clip(input?.name, 60)
})).handler(createSsrRpc("15e2b277eac36ee2533b71d912c959c3ac68c1e593e7f2439c53e1fcfc7e6916"));
var addTitle = createServerFn({ method: "POST" }).validator((input) => ({
	title: clip(input?.title, 160),
	author: clip(input?.author, 160),
	category: clip(input?.category, 40),
	year: clip(input?.year, 8),
	isbn: clip(input?.isbn, 24),
	copies: Math.min(5, Math.max(1, int(input?.copies) || 1)),
	shelf: clip(input?.shelf, 16).toUpperCase()
})).handler(createSsrRpc("79bfce0002c6339ef6e9b0c52e8abdcde2e0a0bb0b1addb0462e5b80d03166cd"));
var listOverdue = createServerFn({ method: "GET" }).handler(createSsrRpc("d397b3e108dd2634fe21b7a0c565a17fc8658b83d4a0b4902d2c6f8cf81d6712"));
var listHolds = createServerFn({ method: "GET" }).handler(createSsrRpc("894c05fdf93557618ffc7903a9339dc54ba0b53a982fec53143aca01ce1593dd"));
var placeHold = createServerFn({ method: "POST" }).validator((input) => ({
	titleId: int(input?.titleId),
	memberId: clip(input?.memberId, 20).toUpperCase()
})).handler(createSsrRpc("4c7e749b061eb74cd9bfae29d7ee72a58d07dd184f1fb97e0c6ccad076164f80"));
var setHoldStatus = createServerFn({ method: "POST" }).validator((input) => ({
	id: int(input?.id),
	status: input?.status === "fulfilled" ? "fulfilled" : "cancelled"
})).handler(createSsrRpc("75b52e1e4e92c82938b171043187b81c3f93eba36b8f7359b63dc6cbd01e2430"));
var updateSettings = createServerFn({ method: "POST" }).validator((input) => ({
	loanDays: int(input?.loanDays),
	graceDays: int(input?.graceDays),
	finePerDay: num(input?.finePerDay),
	maxFine: num(input?.maxFine),
	currency: clip(input?.currency, 8).toUpperCase()
})).handler(createSsrRpc("98056a4c4800aa7fd4e8f3a4351f57334017a49c482dadbc3d509e55480f5e67"));
var exportCsv = createServerFn({ method: "POST" }).validator((input) => ({
	kind: clip(input?.kind, 20),
	ids: Array.isArray(input?.ids) ? input.ids.map((id) => int(id)).filter((id) => id > 0).slice(0, 80) : []
})).handler(createSsrRpc("afc2a8e183487aa28e32f7b4c7947dfd42fe2298c3034b5f33906680b810522e"));
//#endregion
export { returnCopy as _, getDesk as a, updateSettings as b, getSummary as c, listHolds as d, listMembers as f, recordPayment as g, placeHold as h, exportCsv as i, getTitle as l, lookupCopy as m, addMember as n, getMember as o, listOverdue as p, addTitle as r, getSettings as s, AppShell as t, issueCopy as u, searchCatalog as v, setHoldStatus as y };
