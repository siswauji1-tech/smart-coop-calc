import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { Egg, Wallet, Calculator, BarChart3, ShieldCheck, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const { user, loading } = useAuth();
  if (!loading && user) return <Navigate to="/dashboard" />;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Egg className="h-5 w-5" />
            </div>
            <span className="font-bold tracking-tight">Smart Poultry Manager</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/auth"><Button variant="ghost">Masuk</Button></Link>
            <Link to="/auth"><Button>Mulai Gratis</Button></Link>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-6 py-20 md:py-28">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> ERP Peternakan Skala Mikro & Menengah
          </div>
          <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            Tahu persis biaya per <span className="text-primary">telur</span>, <span className="text-accent">DOC</span>, dan ekor.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            Catat indukan, pembesaran, pakan, obat, kematian, dan penjualan. Sistem hitung HPP berbasis aktivitas otomatis — supaya harga jual Anda nggak lagi nebak-nebak.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/auth"><Button size="lg" className="gap-2">Buat Akun Peternak <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Egg, title: "Kawanan Ternak", desc: "Kelola indukan, pembesaran, DOC, dan petelur per batch." },
            { icon: Wallet, title: "Biaya Aktivitas", desc: "Pakan, obat, alat, tenaga, modal — semua dialokasi per kawanan." },
            { icon: Calculator, title: "Kalkulator HPP", desc: "Harga pokok per butir & per ekor. Set margin → harga jual." },
            { icon: BarChart3, title: "Laba Rugi", desc: "Rangkuman pendapatan vs biaya per periode." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-secondary-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/60 mt-10">
        <div className="container mx-auto px-6 py-6 text-xs text-muted-foreground flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" /> Data peternakan Anda terisolasi & aman. copyright by iyonesia381
        </div>
      </footer>
    </div>
  );
}