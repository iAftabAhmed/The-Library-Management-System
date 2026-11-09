import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AppShell } from "./library.functions-KIbu8AHY.mjs";
import { o as Route$5 } from "./router-gIPqeKvf.mjs";
import { i as PageHead } from "./bits-C1HPm7sd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/guide-bmtaPUqr.js
var import_jsx_runtime = require_jsx_runtime();
function GuidePage() {
	const data = Route$5.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHead, {
		title: "How this system works",
		lede: "Use this page for the report and the viva. It is written against the running database, not a slide."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "grid max-w-3xl gap-8 text-sm leading-relaxed",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl font-semibold",
				children: "Problem"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-pretty",
				children: [
					"A library that only stores “the book” cannot tell two shelf copies apart, so the same object can be promised to two people. Quire keeps the work, the physical copy, the member, and the transaction as separate records. Right now the database holds ",
					data.titles,
					" titles and ",
					data.totalCopies,
					" copies."
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl font-semibold",
					children: "Architecture"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-pretty",
					children: "The browser never talks to the database. It calls server functions. Those functions run the SQL."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "mt-3 grid gap-2 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "card p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold tracking-wide text-muted uppercase",
									children: "Client"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-serif text-lg",
									children: "Browser"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted",
									children: "Desk, catalog, reports."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "hidden items-center text-muted md:flex",
							"aria-hidden": true,
							children: "→"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "card p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold tracking-wide text-muted uppercase",
									children: "Server"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-serif text-lg",
									children: "Server functions"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted",
									children: "Check the rules, then write rows."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "hidden items-center text-muted md:flex",
							"aria-hidden": true,
							children: "→"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "card p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold tracking-wide text-muted uppercase",
									children: "Database"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-serif text-lg",
									children: "PostgreSQL"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted",
									children: "Tables, the fine view, the unique index."
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-pretty text-muted",
					children: [
						"What is the client? The pages in the browser. What is the server? The functions in ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono",
							children: "src/lib/library.functions.ts"
						}),
						". What is the role of the database? It stores the rows and enforces “one open loan per copy” even if two people click Issue together. Does it need the internet? Only to load the typefaces. The data itself is on the app’s database. If that database is the embedded one used for a local run, disconnecting the internet does not wipe the open tab, but a new server cannot be reached."
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl font-semibold",
					children: "Data design"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-2 grid gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "card p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "titles" }),
								" — the work: title, author, subject, optional ISBN, year. One row for ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "Hamlet" }),
								", however many paperbacks you own."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "card p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "copies" }),
								" — one physical object. Primary key ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: "C-00042"
								}),
								". Shelf code. This is the thing you hand to a person."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "card p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "members" }), " — card id and display name. Seed names are fictional."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "card p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "loans" }),
								" — one issue. Copy, member, issued date, due date, and ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: "returned_on"
								}),
								" which stays empty until the book comes back."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "card p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "fine_payments" }), " — money recorded against a loan. Not deleted when the book returns."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "card p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "holds" }), " — a member waiting for a title. Status becomes fulfilled or cancelled. The row stays."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "card p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "settings" }), " — the single fine rule: loan length, grace, rate, cap, currency label."]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-pretty",
					children: [
						"Availability is not a flag someone can forget to update. A copy is issued exactly when it has a loan with no return date. The partial unique index ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono",
							children: "loans_one_open_copy"
						}),
						" makes a second open loan for that copy impossible."
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl font-semibold",
				children: "What happens when you press the button"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-pretty",
				children: [
					"Issue inserts one loan. The due date is today plus ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums",
						children: data.settings.loanDays
					}),
					" days from settings. If that copy already has an open loan, the insert matches zero rows and the desk explains who has it. Return sets ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono",
						children: "returned_on"
					}),
					" to today. It does not delete the loan, so the member history and the book history still show it. That is why a returned book does not destroy the transaction."
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl font-semibold",
					children: "Fine rule"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 font-mono text-xs leading-relaxed",
					children: [
						"days past due = max(0, as-of date − due date)",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"chargeable days = max(0, days past due − grace days)",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"fine = min(max fine, chargeable days × fine per day)",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"balance = max(0, fine − payments)"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-pretty",
					children: [
						"The as-of date is the return date, or today if the copy is still out. The formula lives in the database view ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono",
							children: "loan_accounts"
						}),
						", so the dashboard, the desk, the member page, and the overdue list cannot disagree. Current rate: ",
						data.settings.currency,
						" ",
						data.settings.finePerDay,
						" per chargeable day, grace ",
						data.settings.graceDays,
						", cap ",
						data.settings.maxFine,
						"."
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl font-semibold",
				children: "Where the code lives"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-2 list-disc ps-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono",
						children: "migrations/0002_library.sql"
					}), " — tables, seed, views, the unique index."] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono",
						children: "scripts/generate-library-seed.mjs"
					}), " — rebuilds that seed. The source of the 200+ titles is in this file."] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono",
						children: "src/lib/library.functions.ts"
					}), " — every database operation."] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono",
						children: "src/routes"
					}), " — one screen per file. The route loader calls a server function before paint."] })
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl font-semibold",
				children: "Viva, in one line each"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-2 grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
						q: "Where is the data stored?",
						a: "In PostgreSQL tables. The browser only receives the rows the server functions return."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
						q: "Which table stores this loan?",
						a: "loans. The member’s name is not copied onto it; member_id points at members. The title is reached through copies.title_id."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
						q: "How do you prevent duplicate open loans?",
						a: "The insert checks for an open loan, and a unique index on copy_id where returned_on is null rejects a second one."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
						q: "How do you prevent duplicate members?",
						a: "members.id is the primary key. Adding M-1001 again inserts nothing."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
						q: "What breaks if the internet is disconnected?",
						a: "A hosted database cannot be reached, so issue and return fail. The pages do not keep a second secret copy of the loans."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
						q: "How would you scale to 10,000 users?",
						a: "The hot path is the open-loan index and the copy lookup, not a scan of every title. A real deployment would add accounts so each library’s rows are not world-writable."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
						q: "What did you personally implement?",
						a: "Fill the contribution table in the report. Do not claim the whole system if you owned one part."
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl font-semibold",
				children: "Limits"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-2 list-disc ps-5 text-pretty",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "No accounts and no passwords. The checklist forbids shipping secrets, and a shared class demo should open without a login wall. Anyone who can open the app can issue a book. A real library would add staff accounts first." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Fines follow the current rule, even for old loans. A production desk would store the rate on the loan at issue time." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "There is no email reminder and no card payment. A payment here is a recorded amount, not a bank charge." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Barcode scanning works only in browsers that expose a camera and BarcodeDetector. Typing the copy id is the reliable path." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Demo ISBNs that start with DEM- are not registered ISBNs. Member names in the seed are not real people." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "The embedded database used when no DATABASE_URL is set is wiped when the dev server restarts." })
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl font-semibold",
				children: "Sources and assistance"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-pretty",
				children: "The catalog is an original demonstration list of well-known published works (title, author, year, subject), compiled for EF101-P15. It is not an export from a live library. No external dataset file was imported. The app was built with assistance from Grok, using React, TanStack Start, Tailwind, PostgreSQL, and Recharts. Say that in report section 11, and name which group member checked which screen."
			})] })
		]
	})] });
}
function Item({ q, a }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "card p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "font-semibold",
			children: q
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "mt-1 text-pretty text-muted",
			children: a
		})]
	});
}
//#endregion
export { GuidePage as component };
