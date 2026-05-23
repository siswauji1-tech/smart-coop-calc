import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useList } from "@/lib/queries";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { rupiah, num } from "@/lib/format";
import { Calculator, TrendingUp, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/_app/hpp")({ component: HPPPage });

function HPPPage() {
  const flocks = useList<any>("flocks");
  const expenses = useList<any>("expenses");
  const productions = useList<any>("productions");
  const assets = useList<any>("assets");

  const [flockId, setFlockId] = useState<string>("");
  const [productType, setProductType] = useState<string>("telur");
  const [margin, setMargin] = useState<number>(25);
  const [allocPct, setAllocPct] = useState<number>(100);

  const flock = flocks.data?.find((f) => f.id === flockId);

  const calc = useMemo(() => {
    if (!flock) return null;
    const flockExp = (expenses.data ?? []).filter((e) => e.flock_id === flock.id);
    const generalExp = (expenses.data ?? []).filter((e) => !e.flock_id);

    const directCost = flockExp.reduce((s, e) => s + Number(e.amount), 0);
    const allocGeneral = generalExp.reduce((s, e) => s + Number(e.amount), 0) * (allocPct / 100);

    // depresiasi: dari tanggal mulai flock sampai sekarang
    const months = Math.max(1, Math.ceil((Date.now() - new Date(flock.start_date).getTime()) / (1000 * 60 * 60 * 24 * 30)));
    const depTotal = (assets.data ?? []).reduce((s, a) => s + ((Number(a.purchase_value) - Number(a.salvage_value)) / Math.max(1, a.useful_life_months)) * months, 0) * (allocPct / 100);

    const totalCost = directCost + allocGeneral + depTotal;

    const prod = (productions.data ?? []).filter((p) => p.flock_id === flock.id && p.type === productType);
    const totalProduced = prod.reduce((s, p) => s + Number(p.quantity), 0);

    const hpp = totalProduced > 0 ? totalCost / totalProduced : 0;
    const sellPrice = hpp * (1 + margin / 100);
    const profitPerUnit = sellPrice - hpp;

    return { directCost, allocGeneral, depTotal, totalCost, totalProduced, hpp, sellPrice, profitPerUnit, months };
  }, [flock, expenses.data, productions.data, assets.data, productType, margin, allocPct]);

  return (
    <div>
      <PageHeader title="Kalkulator HPP" description="Harga Pokok Produksi berbasis aktivitas — supaya harga jual tidak menebak-nebak." />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="rounded-2xl border bg-card p-6 space-y-4 h-fit">
          <div className="flex items-center gap-2 text-primary"><Calculator className="h-5 w-5" /><h3 className="font-semibold">Parameter</h3></div>

          <div><Label>Kawanan</Label>
            <Select value={flockId} onValueChange={setFlockId}>
              <SelectTrigger><SelectValue placeholder="Pilih kawanan..." /></SelectTrigger>
              <SelectContent>{(flocks.data ?? []).map((f) => <SelectItem key={f.id} value={f.id}>{f.code} — {f.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div><Label>Jenis Produk yang Dihitung</Label>
            <Select value={productType} onValueChange={setProductType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="telur">Telur (per butir)</SelectItem>
                <SelectItem value="doc">DOC (per ekor)</SelectItem>
                <SelectItem value="daging">Daging (per kg)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div><Label>Alokasi Biaya Umum & Aset (%)</Label>
            <Input type="number" value={allocPct} onChange={(e) => setAllocPct(Number(e.target.value))} />
            <p className="text-xs text-muted-foreground mt-1">Persentase biaya umum/aset yang dialokasikan ke kawanan ini.</p>
          </div>

          <div><Label>Target Margin Keuntungan (%)</Label>
            <Input type="number" value={margin} onChange={(e) => setMargin(Number(e.target.value))} />
          </div>
        </div>

        <div className="space-y-4">
          {!flock && (
            <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-60" />
              Pilih kawanan dulu untuk melihat kalkulasi HPP.
            </div>
          )}
          {flock && calc && (
            <>
              <div className="rounded-2xl border bg-card p-6">
                <h3 className="font-semibold mb-4">Komponen Biaya — periode {calc.months} bulan</h3>
                <div className="space-y-2 text-sm">
                  <Row label="Biaya langsung (pakan, obat, dll terikat kawanan)" value={rupiah(calc.directCost)} />
                  <Row label={`Alokasi biaya umum (${allocPct}%)`} value={rupiah(calc.allocGeneral)} />
                  <Row label={`Depresiasi aset (${allocPct}%)`} value={rupiah(calc.depTotal)} />
                  <div className="border-t pt-2 mt-2"><Row label="Total Biaya Produksi" value={rupiah(calc.totalCost)} bold /></div>
                </div>
              </div>

              <div className="rounded-2xl border bg-card p-6">
                <h3 className="font-semibold mb-4">Produksi & HPP</h3>
                <div className="space-y-2 text-sm">
                  <Row label={`Total produksi (${productType})`} value={`${num(calc.totalProduced)} unit`} />
                  {calc.totalProduced === 0 && (
                    <p className="text-xs text-destructive bg-destructive/10 p-3 rounded-lg mt-2">⚠ Belum ada catatan produksi untuk kawanan ini. Tambah data produksi dulu.</p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border-2 border-primary bg-primary/5 p-6">
                <div className="flex items-center gap-2 text-primary mb-4"><TrendingUp className="h-5 w-5" /><h3 className="font-semibold">Rekomendasi Harga</h3></div>
                <div className="grid grid-cols-3 gap-4">
                  <Metric label="HPP / unit" value={rupiah(calc.hpp)} />
                  <Metric label={`Harga Jual (+${margin}%)`} value={rupiah(calc.sellPrice)} highlight />
                  <Metric label="Untung / unit" value={rupiah(calc.profitPerUnit)} />
                </div>
                <p className="text-xs text-muted-foreground mt-4">Jual di bawah <strong>{rupiah(calc.hpp)}</strong> berarti rugi. Harga jual rekomendasi di atas sudah memasukkan margin keuntungan {margin}%.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return <div className={`flex justify-between ${bold ? "font-semibold text-base" : ""}`}><span className={bold ? "" : "text-muted-foreground"}>{label}</span><span>{value}</span></div>;
}
function Metric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-xl font-bold mt-1 ${highlight ? "text-primary" : "text-foreground"}`}>{value}</div>
    </div>
  );
}