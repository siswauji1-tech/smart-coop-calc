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
import { rupiah, tanggal } from "@/lib/format";
import { FlockSelect } from "@/components/flock-select";

const CATS = ["pakan","obat","vitamin","alat","kandang","tenaga_kerja","modal_awal","listrik_air","transport","lain"] as const;

export const Route = createFileRoute("/_app/expenses")({ component: Page });

function Page() {
  const list = useList<any>("expenses", "expense_date");
  const flocks = useList<any>("flocks");
  const insert = useInsert("expenses");
  const del = useDelete("expenses");
  const [open, setOpen] = useState(false);
  const [cat, setCat] = useState<string>("pakan");
  const [flock, setFlock] = useState("__none");

  const flockName = (id: string) => flocks.data?.find((f) => f.id === id)?.code ?? "—";

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const qty = Number(fd.get("quantity")) || null;
    const price = Number(fd.get("unit_price")) || null;
    const amount = Number(fd.get("amount")) || (qty && price ? qty * price : 0);
    await insert.mutateAsync({
      category: cat,
      description: fd.get("description"),
      quantity: qty, unit: fd.get("unit") || null, unit_price: price, amount,
      expense_date: fd.get("expense_date") || new Date().toISOString().slice(0, 10),
      flock_id: flock === "__none" ? null : flock,
    });
    setOpen(false); setFlock("__none");
  };

  return (
    <div>
      <PageHeader title="Pengeluaran" description="Catat pakan, obat, alat, modal, dan biaya lain."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Tambah Pengeluaran</Button></DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Pengeluaran Baru</DialogTitle></DialogHeader>
              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Kategori</Label>
                    <Select value={cat} onValueChange={setCat}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{CATS.map((c) => <SelectItem key={c} value={c} className="capitalize">{c.replace("_", " ")}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Tanggal</Label><Input name="expense_date" type="date" /></div>
                </div>
                <div><Label>Deskripsi</Label><Input name="description" required placeholder="cth: Pakan starter 5 sak" /></div>
                <div className="grid grid-cols-3 gap-3">
                  <div><Label>Qty</Label><Input name="quantity" type="number" step="0.01" /></div>
                  <div><Label>Satuan</Label><Input name="unit" placeholder="sak/kg" /></div>
                  <div><Label>Harga Satuan</Label><Input name="unit_price" type="number" /></div>
                </div>
                <div><Label>Total (Rp)</Label><Input name="amount" type="number" required placeholder="Kosongkan untuk auto qty×harga" /></div>
                <div><Label>Alokasikan ke Kawanan</Label><FlockSelect value={flock} onChange={setFlock} /></div>
                <Button type="submit" className="w-full" disabled={insert.isPending}>Simpan</Button>
              </form>
            </DialogContent>
          </Dialog>
        } />

      <div className="rounded-2xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr><th className="p-3">Tanggal</th><th className="p-3">Kategori</th><th className="p-3">Deskripsi</th><th className="p-3">Kawanan</th><th className="p-3 text-right">Jumlah</th><th /></tr>
          </thead>
          <tbody>
            {(list.data ?? []).map((e) => (
              <tr key={e.id} className="border-t">
                <td className="p-3 whitespace-nowrap">{tanggal(e.expense_date)}</td>
                <td className="p-3 capitalize">{e.category.replace("_"," ")}</td>
                <td className="p-3">{e.description}</td>
                <td className="p-3 text-muted-foreground">{e.flock_id ? flockName(e.flock_id) : "Umum"}</td>
                <td className="p-3 text-right font-medium">{rupiah(e.amount)}</td>
                <td className="p-3"><Button variant="ghost" size="icon" onClick={() => confirm("Hapus?") && del.mutate(e.id)}><Trash2 className="h-4 w-4" /></Button></td>
              </tr>
            ))}
            {(list.data ?? []).length === 0 && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Belum ada pengeluaran.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}