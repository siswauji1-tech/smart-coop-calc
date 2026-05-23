import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useList, useInsert, useDelete } from "@/lib/queries";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { rupiah, tanggal } from "@/lib/format";

export const Route = createFileRoute("/_app/assets")({ component: Page });

function Page() {
  const list = useList<any>("assets");
  const insert = useInsert("assets");
  const del = useDelete("assets");
  const [open, setOpen] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await insert.mutateAsync({
      name: fd.get("name"),
      purchase_value: Number(fd.get("purchase_value")),
      salvage_value: Number(fd.get("salvage_value") || 0),
      useful_life_months: Number(fd.get("useful_life_months") || 60),
      purchase_date: fd.get("purchase_date") || new Date().toISOString().slice(0, 10),
      notes: fd.get("notes") || null,
    });
    setOpen(false);
  };

  const depPerMonth = (a: any) => (Number(a.purchase_value) - Number(a.salvage_value)) / Math.max(1, a.useful_life_months);

  return (
    <div>
      <PageHeader title="Aset & Fasilitas" description="Kandang, alat besar. Dipakai menghitung depresiasi bulanan untuk komponen HPP."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Tambah Aset</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Aset Baru</DialogTitle></DialogHeader>
              <form onSubmit={submit} className="space-y-4">
                <div><Label>Nama Aset</Label><Input name="name" required placeholder="cth: Kandang A" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Nilai Beli (Rp)</Label><Input name="purchase_value" type="number" required /></div>
                  <div><Label>Nilai Sisa (Rp)</Label><Input name="salvage_value" type="number" defaultValue={0} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Umur (bulan)</Label><Input name="useful_life_months" type="number" defaultValue={60} required /></div>
                  <div><Label>Tanggal Beli</Label><Input name="purchase_date" type="date" /></div>
                </div>
                <div><Label>Catatan</Label><Input name="notes" /></div>
                <Button type="submit" className="w-full" disabled={insert.isPending}>Simpan</Button>
              </form>
            </DialogContent>
          </Dialog>
        } />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(list.data ?? []).map((a) => (
          <div key={a.id} className="rounded-2xl border bg-card p-5">
            <div className="flex justify-between">
              <h3 className="font-semibold">{a.name}</h3>
              <Button variant="ghost" size="icon" onClick={() => confirm("Hapus?") && del.mutate(a.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Nilai beli</span><span>{rupiah(a.purchase_value)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Umur</span><span>{a.useful_life_months} bulan</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tanggal</span><span>{tanggal(a.purchase_date)}</span></div>
              <div className="flex justify-between pt-2 border-t mt-2"><span className="text-muted-foreground">Depresiasi / bulan</span><span className="font-medium text-primary">{rupiah(depPerMonth(a))}</span></div>
            </div>
          </div>
        ))}
        {(list.data ?? []).length === 0 && <div className="col-span-full text-center py-12 text-muted-foreground border border-dashed rounded-2xl">Belum ada aset.</div>}
      </div>
    </div>
  );
}