import { o as __toESM } from "../_runtime.mjs";
import { J as require_react, b as useRouter, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as returnCopy, g as recordPayment, m as lookupCopy, t as AppShell, u as issueCopy } from "./library.functions-KIbu8AHY.mjs";
import { s as Route$6 } from "./router-gIPqeKvf.mjs";
import { c as formatDay, i as PageHead, l as money, o as StatusPill, r as Notice, t as Barcode } from "./bits-C1HPm7sd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/desk-pFuBcXLB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DeskPage() {
	const data = Route$6.useLoaderData();
	const router = useRouter();
	const [copyId, setCopyId] = (0, import_react.useState)("");
	const [memberId, setMemberId] = (0, import_react.useState)(data.members[0]?.id ?? "");
	const [memberFilter, setMemberFilter] = (0, import_react.useState)("");
	const [preview, setPreview] = (0, import_react.useState)(null);
	const [notice, setNotice] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [amount, setAmount] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const { settings } = data;
	const members = data.members.filter((member) => {
		const q = memberFilter.trim().toLowerCase();
		if (!q) return true;
		return member.name.toLowerCase().includes(q) || member.id.toLowerCase().includes(q);
	});
	async function lookup(id) {
		const code = id.trim().toUpperCase();
		setCopyId(code);
		setError(null);
		setNotice(null);
		setBusy(true);
		const result = await lookupCopy({ data: { copyId: code } });
		setPreview(result);
		setBusy(false);
		if (!result.found) setError(result.message);
	}
	async function afterChange(message, ok) {
		if (ok) setNotice(message);
		else setError(message);
		if (ok) {
			const fresh = await lookupCopy({ data: { copyId } });
			setPreview(fresh);
		}
		await router.invalidate();
	}
	const payable = preview?.found ? preview.openLoan && preview.openLoan.balance > 0 ? preview.openLoan : preview.history.find((row) => row.balance > 0) ?? null : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHead, {
			title: "Circulation desk",
			lede: "Look up one physical copy, issue it to one member, or take it back. A second issue of the same copy is rejected. The loan row stays after the return."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "flex flex-col gap-2 sm:flex-row",
			onSubmit: (event) => {
				event.preventDefault();
				lookup(copyId);
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field font-mono text-lg",
					value: copyId,
					placeholder: "C-00042",
					"aria-label": "Copy id",
					autoCapitalize: "characters",
					onChange: (event) => setCopyId(event.target.value.toUpperCase())
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn btn-primary",
					type: "submit",
					disabled: busy,
					children: "Look up"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanButton, { onCode: (code) => {
					lookup(code);
				} })
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex flex-wrap gap-2",
			children: [data.samples.availableId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "btn btn-line",
				type: "button",
				onClick: () => void lookup(data.samples.availableId),
				children: ["Try in: ", data.samples.availableId]
			}) : null, data.samples.issuedId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "btn btn-line",
				type: "button",
				onClick: () => void lookup(data.samples.issuedId),
				children: ["Try out: ", data.samples.issuedId]
			}) : null]
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
		preview?.found ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "card mt-4 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-sm",
							children: preview.copyId
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-2xl font-semibold",
							children: preview.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								preview.author,
								" · ",
								preview.category,
								" · shelf ",
								preview.shelf
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
						status: preview.status,
						overdue: preview.openLoan?.isOverdue ?? false
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Barcode, { value: preview.copyId }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "The bars are a shelf label. The unique key is the copy id itself."
				}),
				preview.status === "available" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-4 grid gap-2",
					onSubmit: async (event) => {
						event.preventDefault();
						setBusy(true);
						setError(null);
						const result = await issueCopy({ data: {
							copyId: preview.copyId,
							memberId
						} });
						setBusy(false);
						await afterChange(result.message, result.ok);
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm",
							children: [
								"Due ",
								settings.loanDays,
								" days after today if you issue it now (",
								money(settings.finePerDay, settings.currency),
								" / day after ",
								settings.graceDays,
								" grace day",
								settings.graceDays === 1 ? "" : "s",
								")."
							]
						}),
						preview.nextHold && preview.nextHold.memberId !== memberId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Notice, {
							tone: "bad",
							children: [
								preview.nextHold.memberName,
								" (",
								preview.nextHold.memberId,
								") is first in the hold queue for this title. Issuing to someone else jumps that queue."
							]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field",
							placeholder: "Filter members",
							value: memberFilter,
							"aria-label": "Filter members",
							onChange: (event) => setMemberFilter(event.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "field",
							value: memberId,
							"aria-label": "Member",
							onChange: (event) => setMemberId(event.target.value),
							children: members.map((member) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: member.id,
								children: [
									member.id,
									" · ",
									member.name
								]
							}, member.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn btn-primary",
							type: "submit",
							disabled: busy || !memberId,
							children: "Issue this copy"
						})
					]
				}) : preview.openLoan ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"Out to ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: preview.openLoan.memberName }),
							" (",
							preview.openLoan.memberId,
							") since ",
							formatDay(preview.openLoan.issuedOn),
							". Due ",
							formatDay(preview.openLoan.dueOn),
							"."
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "tabular-nums",
							children: [
								preview.openLoan.daysPastDue,
								" days past due · ",
								preview.openLoan.chargeableDays,
								" chargeable · fine ",
								money(preview.openLoan.fine, settings.currency),
								" · balance ",
								money(preview.openLoan.balance, settings.currency)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn btn-primary",
							type: "button",
							disabled: busy,
							onClick: async () => {
								setBusy(true);
								setError(null);
								const result = await returnCopy({ data: { copyId: preview.copyId } });
								setBusy(false);
								await afterChange(result.message, result.ok);
							},
							children: "Return this copy"
						})
					]
				}) : null,
				payable ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-4 grid gap-2 sm:grid-cols-[8rem_minmax(0,1fr)_auto]",
					onSubmit: async (event) => {
						event.preventDefault();
						setBusy(true);
						setError(null);
						const result = await recordPayment({ data: {
							loanId: payable.id,
							amount: Number(amount),
							note
						} });
						setBusy(false);
						if (result.ok) setAmount("");
						await afterChange(result.message, result.ok);
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field",
							inputMode: "decimal",
							placeholder: "Amount",
							"aria-label": "Payment amount",
							value: amount,
							onChange: (event) => setAmount(event.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field",
							placeholder: "Note, optional",
							value: note,
							onChange: (event) => setNote(event.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn btn-line",
							type: "submit",
							disabled: busy,
							children: "Record payment"
						})
					]
				}) : null,
				preview.history.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold",
						children: "This copy’s loans"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 grid gap-2 text-sm",
						children: preview.history.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "border-t border-line pt-2",
							children: [
								"Loan ",
								row.id,
								": ",
								row.memberName,
								", issued ",
								formatDay(row.issuedOn),
								", due ",
								formatDay(row.dueOn),
								", ",
								row.returnedOn ? `returned ${formatDay(row.returnedOn)}` : "still out",
								". Balance ",
								money(row.balance, settings.currency),
								"."
							]
						}, row.id))
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted",
					children: "This copy has never been issued. There is no history to delete."
				})
			]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-xl font-semibold",
				children: "Overdue on the desk"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 grid gap-2",
				children: data.overdue.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "card w-full px-3 py-2 text-left",
					type: "button",
					onClick: () => void lookup(row.copyId),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs",
							children: row.copyId
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-sm",
							children: row.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted",
							children: [
								row.memberName,
								" · ",
								row.chargeableDays,
								" chargeable days · ",
								money(row.balance, settings.currency),
								" balance"
							]
						})
					]
				}) }, row.id))
			})]
		})
	] });
}
function ScanButton({ onCode }) {
	const [on, setOn] = (0, import_react.useState)(false);
	const [message, setMessage] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!on) return;
		let stop = false;
		let stream = null;
		let timer = 0;
		const video = document.getElementById("quire-scan");
		(async () => {
			const Detector = window.BarcodeDetector;
			if (!Detector || !navigator.mediaDevices?.getUserMedia) {
				setMessage("This browser cannot scan. Type the copy id.");
				setOn(false);
				return;
			}
			try {
				stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
				if (stop || !video) return;
				video.srcObject = stream;
				await video.play();
				const detector = new Detector({ formats: [
					"code_128",
					"code_39",
					"qr_code",
					"ean_13"
				] });
				const tick = async () => {
					if (stop || !video) return;
					try {
						const hit = (await detector.detect(video)).map((code) => code.rawValue.toUpperCase().match(/C-\d{5}/)?.[0]).find(Boolean);
						if (hit) {
							onCode(hit);
							setOn(false);
							return;
						}
					} catch {}
					timer = window.setTimeout(() => void tick(), 350);
				};
				timer = window.setTimeout(() => void tick(), 350);
			} catch {
				setMessage("Camera permission was blocked. Type the copy id.");
				setOn(false);
			}
		})();
		return () => {
			stop = true;
			window.clearTimeout(timer);
			stream?.getTracks().forEach((track) => track.stop());
		};
	}, [on, onCode]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "btn btn-line",
				type: "button",
				onClick: () => {
					setMessage(null);
					setOn((value) => !value);
				},
				children: on ? "Stop camera" : "Scan barcode"
			}),
			on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				id: "quire-scan",
				className: "h-36 w-full rounded-xl bg-ink object-cover",
				muted: true,
				playsInline: true
			}) : null,
			message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: message
			}) : null
		]
	});
}
//#endregion
export { DeskPage as component };
