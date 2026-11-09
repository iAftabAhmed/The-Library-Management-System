import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AlarmClock,
  ArrowLeftRight,
  BookMarked,
  Compass,
  Download,
  LayoutDashboard,
  Library,
  SlidersHorizontal,
  Users,
} from "lucide-react";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/catalog", label: "Catalog", icon: Library },
  { to: "/desk", label: "Desk", icon: ArrowLeftRight },
  { to: "/members", label: "Members", icon: Users },
  { to: "/overdue", label: "Overdue", icon: AlarmClock },
  { to: "/holds", label: "Holds", icon: BookMarked },
  { to: "/reports", label: "Reports", icon: Download },
  { to: "/rules", label: "Fine rule", icon: SlidersHorizontal },
  { to: "/guide", label: "How it works", icon: Compass },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const [operator, setOperator] = useState("");

  useEffect(() => {
    setOperator(window.localStorage.getItem("quire-operator") ?? "");
  }, []);

  function saveOperator(value: string) {
    setOperator(value);
    window.localStorage.setItem("quire-operator", value.slice(0, 40));
  }

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-binding text-on-binding">
              <Library className="size-4" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block font-serif text-xl leading-none font-semibold">Quire</span>
              <span className="block truncate text-xs text-muted">EF101-P15 · circulation desk</span>
            </span>
          </Link>
          <label className="ms-auto flex min-w-0 items-center gap-2 text-xs text-muted">
            <span className="shrink-0">On duty</span>
            <input
              className="field min-h-9 w-24 py-1 text-sm sm:w-36"
              value={operator}
              maxLength={40}
              placeholder="Your name"
              aria-label="Librarian on duty, stored only on this device"
              onChange={(event) => saveOperator(event.target.value)}
            />
          </label>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3 pb-3" aria-label="Sections">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="nav-link"
              >
                <Icon className="size-4" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
      <footer className="mx-auto max-w-6xl px-4 pb-10 text-xs text-pretty text-muted">
        Demonstration catalog for EF101-P15. Titles are well-known published works. Identifiers
        starting with DEM- are synthetic, not registered ISBNs. Member names are fictional. Do not
        enter real student records. The name in “On duty” stays in this browser only.
      </footer>
    </div>
  );
}
