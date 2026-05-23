import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useList, useInsert, useDelete } from "@/lib/queries";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { rupiah, num, tanggal } from "@/lib/format";
import { FlockSelect } from "@/components/flock-select";

const TYPES = ["telur","doc","indukan","ayam_afkir","daging","pupuk_kandang"] as const;

export const Route = createFileRoute("/_app/sales")({ component: Page });

function Page() {
  const list = useList<any>("sales", "sale_date");
  const insert = useInsert("sales");
  const del = useDelete("sales");
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("telur");
  const [flock, setFlock] = useState("__none");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const qty = Number(fd.get("quantity"));
    const price = Number(fd.get("unit_price"));
    await insert.mutateAsync({
      type, quantity: qty, unit: fd.get("unit") || "butir",
      unit_price: price, total: qty * price,
      buyer: fd.get("buyer") || null,
      sale_date: fd.get("sale_date") || new Date().toISOString().slice(0, 10),
      flock_id: flock === "__none" ? null : flock, notes: fd.get("notes") || null,
    });
    setOpen(false); setFlock("__none");
  };

  return (
    <div>
      <PageHeader title="Penjualan" description="Catat penjualan telur, DOC, indukan, atau ayam afkir."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Tambah Penjualan</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Penjualan Baru</DialogTitle></DialogHeader>
              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Jenis Produk</Label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t.replace("_"," ")}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Tanggal</Label><Input name="sale_date" type="date" /></div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div><Label>Qty</Label><Input name="quantity" type="number" step="0.01" required /></div>
                  <div><Label>Satuan</Label><Input name="unit" defaultValue="butir" required /></div>
                  <div><Label>Harga/Satuan</Label><Input name="unit_price" type="number" required /></div>
                </div>
                <div><Label>Pembeli</Label><Input name="buyer" /></div>
                <div><Label>Dari Kawanan</Label><FlockSelect value={flock} onChange={setFlock} /></div>
                <div><Label>Catatan</Label><Input name="notes" /></div>
                <Button type="submit" className="w-full" disabled={insert.isPending}>Simpan</Button>
              </form>
            </DialogContent>
          </Dialog>
        } />

      <div className="rounded-2xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr><th className="p-3">Tanggal</th><th className="p-3">Produk</th><th className="p-3">Pembeli</th><th className="p-3 text-right">Qty</th><th className="p-3 text-right">Harga</th><th className="p-3 text-right">Total</th><th /></tr>
          </thead>
          <tbody>
            {(list.data ?? []).map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-3">{tanggal(s.sale_date)}</td>
                <td className="p-3 capitalize">{s.type.replace("_"," ")}</td>
                <td className="p-3 text-muted-foreground">{s.buyer ?? "—"}</td>
                <td className="p-3 text-right">{num(s.quantity)} {s.unit}</td>
                <td className="p-3 text-right">{rupiah(s.unit_price)}</td>
                <td className="p-3 text-right font-medium">{rupiah(s.total)}</td>
                <td className="p-3"><Button variant="ghost" size="icon" onClick={() => confirm("Hapus?") && del.mutate(s.id)}><Trash2 className="h-4 w-4" /></Button></td>
              </tr>
            ))}
            {(list.data ?? []).length === 0 && <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Belum ada penjualan.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}