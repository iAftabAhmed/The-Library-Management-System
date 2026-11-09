import { o as __toESM } from "../_runtime.mjs";
import { J as require_react, b as useRouter, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as placeHold, i as exportCsv, r as addTitle, t as AppShell } from "./library.functions-KIbu8AHY.mjs";
import { c as Route$7 } from "./router-gIPqeKvf.mjs";
import { c as formatDay, i as PageHead, n as LoanTable, o as StatusPill, r as Notice, s as downloadText, t as Barcode, u as yearLabel } from "./bits-C1HPm7sd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-BIQlGrIq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CatalogPage() {
	const { list, detail } = Route$7.useLoaderData();
	const search = Route$7.useSearch();
	const navigate = Route$7.useNavigate();
	const router = useRouter();
	const [q, setQ] = (0, import_react.useState)(search.q);
	const [picked, setPicked] = (0, import_react.useState)([]);
	const [notice, setNotice] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const pages = Math.max(1, Math.ceil(list.total / list.pageSize));
	function go(next) {
		navigate({ search: (prev) => ({
			...prev,
			...next
		}) });
	}
	async function onExportSelected() {
		setError(null);
		const result = await exportCsv({ data: {
			kind: "selected",
			ids: picked
		} });
		if (!result.ok) {
			setError(result.message);
			return;
		}
		downloadText(result.filename, result.csv);
		setNotice(`Exported ${picked.length} selected title${picked.length === 1 ? "" : "s"}.`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHead, {
			title: "Catalog",
			lede: "Search by title, author, subject, demo ISBN, or copy id. A title can have several physical copies. Only a copy can be issued."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "grid gap-2 sm:grid-cols-[minmax(0,1fr)_12rem_10rem_auto]",
			onSubmit: (event) => {
				event.preventDefault();
				go({
					q,
					page: 1
				});
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field",
					value: q,
					placeholder: "Title, author, C-00042, DEM-0007",
					"aria-label": "Search the catalog",
					onChange: (event) => setQ(event.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "field",
					value: search.category,
					"aria-label": "Subject",
					onChange: (event) => go({
						category: event.target.value,
						page: 1
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "All subjects"
					}), list.categories.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: row.category,
						children: [
							row.category,
							" (",
							row.n,
							")"
						]
					}, row.category))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "field",
					value: search.availability,
					"aria-label": "Availability",
					onChange: (event) => go({
						availability: event.target.value,
						page: 1
					}),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "Any status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "available",
							children: "Has a copy in"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "issued",
							children: "Has a copy out"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn btn-primary",
					type: "submit",
					children: "Search"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex flex-wrap items-center gap-2 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-muted tabular-nums",
					children: [
						list.total,
						" titles · page ",
						list.page,
						" of ",
						pages
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn btn-line",
					type: "button",
					disabled: list.page <= 1,
					onClick: () => go({ page: list.page - 1 }),
					children: "Previous"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn btn-line",
					type: "button",
					disabled: list.page >= pages,
					onClick: () => go({ page: list.page + 1 }),
					children: "Next"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn btn-line",
					type: "button",
					onClick: () => void onExportSelected(),
					children: "Export selected"
				})
			]
		}),
		notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, {
				tone: "ok",
				children: notice
			})
		}) : null,
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, {
				tone: "bad",
				children: error
			})
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid items-start gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "grid gap-2",
				children: [list.rows.map((row) => {
					const active = search.title === row.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: `card ${active ? "border-binding" : ""}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								className: "mt-1 size-5 accent-binding",
								checked: picked.includes(row.id),
								"aria-label": `Select ${row.title}`,
								onChange: () => setPicked((current) => current.includes(row.id) ? current.filter((id) => id !== row.id) : [...current, row.id])
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "min-w-0 flex-1 text-left",
								onClick: () => go({ title: row.id }),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block font-serif text-lg leading-snug font-semibold",
										children: row.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mt-1 block text-sm text-muted",
										children: [
											row.author,
											" · ",
											row.category,
											row.year != null ? ` · ${yearLabel(row.year)}` : ""
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mt-2 flex flex-wrap items-center gap-2 text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
												status: row.available > 0 ? "available" : "issued",
												overdue: row.available === 0 && row.issued > 0
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "tabular-nums text-muted",
												children: [
													row.available,
													" of ",
													row.copies,
													" in"
												]
											}),
											row.isbn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-muted",
												children: row.isbn
											}) : null
										]
									})
								]
							})]
						})
					}, row.id);
				}), !list.rows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-sm text-muted",
					children: "Nothing matches that search."
				}) : null]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				id: "title-detail",
				children: [detail?.found ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleDetail, {
					detail,
					busy,
					onBusy: setBusy,
					onDone: async (message, tone) => {
						if (tone === "ok") setNotice(message);
						else setError(message);
						await router.invalidate();
					}
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
					className: "card p-4 text-sm text-muted",
					children: "Select a title to see each physical copy, whether it is in or out, and the circulation history. History stays after a return."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddTitle, {
					categories: list.categories.map((row) => row.category),
					onDone: async (message, titleId) => {
						setNotice(message);
						await router.invalidate();
						go({
							title: titleId,
							q: "",
							page: 1
						});
					},
					onError: setError
				})]
			})]
		})
	] });
}
function TitleDetail({ detail, busy, onBusy, onDone }) {
	const [memberId, setMemberId] = (0, import_react.useState)("M-1001");
	const { title } = detail;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "card p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl font-semibold",
				children: title.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					title.author,
					" · ",
					title.category,
					title.year != null ? ` · ${yearLabel(title.year)}` : "",
					title.isbn ? ` · ${title.isbn}` : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-4 text-sm font-semibold",
				children: "Physical copies"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 grid gap-3",
				children: detail.copies.map((copy) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl border border-line p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-sm",
								children: copy.id
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: ["Shelf ", copy.shelf]
							}),
							copy.status === "issued" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm",
								children: [
									"Out to ",
									copy.memberName,
									" (",
									copy.memberId,
									") until ",
									formatDay(copy.dueOn)
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm",
								children: "On the shelf."
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
							status: copy.status,
							overdue: copy.isOverdue
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Barcode, { value: copy.id })]
				}, copy.id))
			}),
			detail.waiting.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm",
				children: ["Waiting holds: ", detail.waiting.map((hold) => `${hold.memberName} (${hold.memberId})`).join(", ")]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-3 flex flex-wrap gap-2",
				onSubmit: async (event) => {
					event.preventDefault();
					onBusy(true);
					const result = await placeHold({ data: {
						titleId: title.id,
						memberId
					} });
					onBusy(false);
					await onDone(result.ok ? result.message : result.message, result.ok ? "ok" : "bad");
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field max-w-40",
					value: memberId,
					"aria-label": "Member id for a hold",
					onChange: (event) => setMemberId(event.target.value.toUpperCase())
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn btn-line",
					type: "submit",
					disabled: busy,
					children: "Place hold"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-5 text-sm font-semibold",
				children: "Circulation history"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-xs text-muted",
				children: "Returned rows are still here. The book coming back does not erase the transaction."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoanTable, {
				rows: detail.history,
				currency: "PKR"
			}),
			detail.suggestions.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-5 text-sm font-semibold",
				children: "Suggestions"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 grid gap-2 text-sm",
				children: detail.suggestions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: item.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-muted",
					children: [
						" · ",
						item.author,
						". ",
						item.reason,
						"."
					]
				})] }, item.id))
			})] }) : null
		]
	});
}
function AddTitle({ categories, onDone, onError }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [title, setTitle] = (0, import_react.useState)("");
	const [author, setAuthor] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)(categories[0] ?? "Computer Science");
	const [year, setYear] = (0, import_react.useState)("");
	const [isbn, setIsbn] = (0, import_react.useState)("");
	const [copies, setCopies] = (0, import_react.useState)(1);
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (!open) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: "btn btn-line mt-3",
		type: "button",
		onClick: () => setOpen(true),
		children: "Add a title"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "card mt-3 grid gap-2 p-4",
		onSubmit: async (event) => {
			event.preventDefault();
			setBusy(true);
			const result = await addTitle({ data: {
				title,
				author,
				category,
				year,
				isbn,
				copies
			} });
			setBusy(false);
			if (!result.ok) {
				onError(result.message);
				return;
			}
			setTitle("");
			setAuthor("");
			setIsbn("");
			await onDone(result.message, result.titleId);
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-serif text-lg font-semibold",
				children: "New title"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "field",
				placeholder: "Title",
				value: title,
				required: true,
				onChange: (event) => setTitle(event.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "field",
				placeholder: "Author",
				value: author,
				required: true,
				onChange: (event) => setAuthor(event.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "field",
				placeholder: "Subject",
				list: "subjects",
				value: category,
				required: true,
				onChange: (event) => setCategory(event.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
				id: "subjects",
				children: categories.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: item }, item))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field",
					placeholder: "Year",
					inputMode: "numeric",
					value: year,
					onChange: (event) => setYear(event.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field",
					placeholder: "ISBN optional",
					value: isbn,
					onChange: (event) => setIsbn(event.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "text-sm text-muted",
				children: ["Copies", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field mt-1",
					type: "number",
					min: 1,
					max: 5,
					value: copies,
					onChange: (event) => setCopies(Number(event.target.value))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "btn btn-primary",
				type: "submit",
				disabled: busy,
				children: "Save title"
			})
		]
	});
}
//#endregion
export { CatalogPage as component };
