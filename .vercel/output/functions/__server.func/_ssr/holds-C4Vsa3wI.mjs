import { o as __toESM } from "../_runtime.mjs";
import { J as require_react, b as useRouter, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AppShell, y as setHoldStatus } from "./library.functions-KIbu8AHY.mjs";
import { a as Route$4 } from "./router-gIPqeKvf.mjs";
import { c as formatDay, i as PageHead, r as Notice } from "./bits-C1HPm7sd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/holds-C4Vsa3wI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HoldsPage() {
	const { holds } = Route$4.useLoaderData();
	const router = useRouter();
	const [notice, setNotice] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function update(id, status) {
		setBusy(true);
		setError(null);
		const result = await setHoldStatus({ data: {
			id,
			status
		} });
		setBusy(false);
		if (result.ok) setNotice(result.message);
		else setError(result.message);
		await router.invalidate();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHead, {
			title: "Holds",
			lede: "A hold reserves a title, not one barcode, because any free copy of that work can satisfy it. Cancelling does not delete the request."
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
			className: "grid gap-2",
			children: holds.map((hold) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "card flex flex-col gap-2 p-3 sm:flex-row sm:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-wide text-muted uppercase",
							children: hold.status
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-serif text-lg font-semibold",
							children: hold.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								hold.memberName,
								" (",
								hold.memberId,
								") · placed ",
								formatDay(hold.placedOn),
								" · ",
								hold.available,
								" copies in"
							]
						})
					]
				}), hold.status === "waiting" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn btn-line",
						type: "button",
						disabled: busy,
						onClick: () => void update(hold.id, "fulfilled"),
						children: "Fulfill"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn btn-line",
						type: "button",
						disabled: busy,
						onClick: () => void update(hold.id, "cancelled"),
						children: "Cancel"
					})]
				}) : null]
			}, hold.id))
		})
	] });
}
//#endregion
export { HoldsPage as component };
