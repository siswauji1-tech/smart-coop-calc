import { createFileRoute } from "@tanstack/react-router";
import { useList } from "@/lib/queries";
import { rupiah, num } from "@/lib/format";
import { PageHeader } from "@/components/page-header";
import { Users, Egg, Wallet, TrendingUp, Skull, ShoppingCart } from "lucide-react";

export const Route = createFileRoute("/_app/dashboard")({ component: Dashboard });

function Stat({ icon: Icon, label, value, tone = "primary" }: any) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className={`grid h-9 w-9 place-items-center rounded-lg bg-${tone}/10 text-${tone}`}><Icon className="h-4 w-4" /></div>
      </div>
      <div className="mt-3 text-2xl font-bold tracking-tight">{value}</div>
    </div>
  );
}

function Dashboard() {
  const flocks = useList<any>("flocks");
  const expenses = useList<any>("expenses");
  const sales = useList<any>("sales");
  const productions = useList<any>("productions");
  const mortalities = useList<any>("mortalities");

  const totalAyam = (flocks.data ?? []).reduce((s, f) => s + (f.current_count ?? 0), 0);
  const totalExp = (expenses.data ?? []).reduce((s, e) => s + Number(e.amount ?? 0), 0);
  const totalSales = (sales.data ?? []).reduce((s, e) => s + Number(e.total ?? 0), 0);
  const totalTelur = (productions.data ?? []).filter((p) => p.type === "telur").reduce((s, p) => s + Number(p.quantity ?? 0), 0);
  const totalMati = (mortalities.data ?? []).reduce((s, m) => s + (m.count ?? 0), 0);
  const laba = totalSales - totalExp;

  return (
    <div>
      <PageHeader title="Dashboard" description="Ringkasan operasional peternakan Anda." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat icon={Users} label="Total Ayam Aktif" value={num(totalAyam) + " ekor"} />
        <Stat icon={Egg} label="Produksi Telur" value={num(totalTelur) + " butir"} />
        <Stat icon={Skull} label="Total Kematian" value={num(totalMati) + " ekor"} />
        <Stat icon={Wallet} label="Total Pengeluaran" value={rupiah(totalExp)} />
        <Stat icon={ShoppingCart} label="Total Penjualan" value={rupiah(totalSales)} />
        <Stat icon={TrendingUp} label={laba >= 0 ? "Laba Kotor" : "Rugi"} value={rupiah(laba)} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5">
          <h3 className="font-semibold mb-3">Kawanan Aktif</h3>
          {(flocks.data ?? []).filter((f) => f.status === "aktif").slice(0, 5).map((f) => (
            <div key={f.id} className="flex justify-between py-2 border-b last:border-0 text-sm">
              <span>{f.code} — {f.name}</span>
              <span className="text-muted-foreground">{num(f.current_count)} ekor</span>
            </div>
          ))}
          {(flocks.data ?? []).length === 0 && <p className="text-sm text-muted-foreground">Belum ada kawanan. Tambahkan di menu Kawanan.</p>}
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <h3 className="font-semibold mb-3">Pengeluaran Terbaru</h3>
          {(expenses.data ?? []).slice(0, 5).map((e) => (
            <div key={e.id} className="flex justify-between py-2 border-b last:border-0 text-sm">
              <span className="capitalize">{e.category.replace("_", " ")} — {e.description}</span>
              <span className="text-muted-foreground">{rupiah(e.amount)}</span>
            </div>
          ))}
          {(expenses.data ?? []).length === 0 && <p className="text-sm text-muted-foreground">Belum ada pengeluaran tercatat.</p>}
        </div>
      </div>
    </div>
  );
}