import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { Egg, LayoutDashboard, Users, Wallet, Skull, PackageOpen, ShoppingCart, Calculator, Hammer, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/flocks", label: "Kawanan", icon: Users },
  { to: "/expenses", label: "Pengeluaran", icon: Wallet },
  { to: "/productions", label: "Produksi", icon: PackageOpen },
  { to: "/sales", label: "Penjualan", icon: ShoppingCart },
  { to: "/mortalities", label: "Kematian", icon: Skull },
  { to: "/assets", label: "Aset", icon: Hammer },
  { to: "/hpp", label: "Kalkulator HPP", icon: Calculator },
] as const;

export function AppShell() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  if (loading) return <div className="min-h-screen grid place-items-center text-muted-foreground">Memuat…</div>;
  if (!user) { navigate({ to: "/auth" }); return null; }

  return (
    <div className="min-h-screen flex bg-background">
      <aside className={cn("fixed lg:static inset-y-0 left-0 z-30 w-64 bg-sidebar text-sidebar-foreground flex-col transition-transform", open ? "flex" : "hidden lg:flex")}>
        <div className="flex items-center justify-between p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"><Egg className="h-5 w-5" /></div>
            <div><div className="font-bold text-sm">Smart Poultry</div><div className="text-xs opacity-60">Manager</div></div>
          </div>
          <button className="lg:hidden" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((n) => {
            const active = path === n.to || path.startsWith(n.to + "/");
            return (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)}
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium" : "hover:bg-sidebar-accent")}>
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <div className="px-3 py-2 text-xs opacity-70 truncate">{user.email}</div>
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent" onClick={async () => { await signOut(); navigate({ to: "/" }); }}>
            <LogOut className="h-4 w-4 mr-2" /> Keluar
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between border-b p-4">
          <button onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button>
          <span className="font-semibold">Smart Poultry</span>
          <div />
        </header>
        <main className="flex-1 p-6 lg:p-8 overflow-x-hidden"><Outlet /></main>
      </div>
    </div>
  );
}