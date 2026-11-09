import { createRouter } from "@tanstack/react-router";
import { AppErrorComponent } from "@/lib/error-component";
import { previewPathRewrite } from "@/lib/preview-path-prefix";
import { AppShell } from "@/components/app-shell";
import { routeTree } from "./routeTree.gen";

function Pending() {
  return (
    <AppShell>
      <p className="text-muted">Loading the desk…</p>
    </AppShell>
  );
}

export function getRouter() {
  return createRouter({
    routeTree,
    rewrite: previewPathRewrite(),
    defaultErrorComponent: AppErrorComponent,
    defaultPendingComponent: Pending,
  });
}
