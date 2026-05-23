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
import { num, tanggal } from "@/lib/format";
import { FlockSelect } from "@/components/flock-select";

export const Route = createFileRoute("/_app/productions")({ component: Page });

function Page() {
  const list = useList<any>("productions", "production_date");
  const flocks = useList<any>("flocks");
  const insert = useInsert("productions");
  const del = useDelete("productions");
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("telur");
  const [flock, setFlock] = useState("__none");

  const flockName = (id: string) => flocks.data?.find((f) => f.id === id)?.code ?? "—";

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await insert.mutateAsync({
      type, quantity: Number(fd.get("quantity")),
      unit: fd.get("unit") || (type === "telur" ? "butir" : type === "doc" ? "ekor" : "kg"),
      production_date: fd.get("production_date") || new Date().toISOString().slice(0, 10),
      flock_id: flock === "__none" ? null : flock, notes: fd.get("notes") || null,
    });
    setOpen(false); setFlock("__none");
  };

  return (
    <div>
      <PageHeader title="Produksi" description="Catat telur, DOC, atau hasil produksi lain per hari."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Tambah Produksi</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Catat Produksi</DialogTitle></DialogHeader>
              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Jenis</Label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="telur">Telur</SelectItem>
                        <SelectItem value="doc">DOC</SelectItem>
                        <SelectItem value="daging">Daging</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Tanggal</Label><Input name="production_date" type="date" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Jumlah</Label><Input name="quantity" type="number" step="0.01" required /></div>
                  <div><Label>Satuan</Label><Input name="unit" placeholder="butir/ekor/kg" /></div>
                </div>
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
            <tr><th className="p-3">Tanggal</th><th className="p-3">Jenis</th><th className="p-3">Kawanan</th><th className="p-3 text-right">Jumlah</th><th /></tr>
          </thead>
          <tbody>
            {(list.data ?? []).map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{tanggal(p.production_date)}</td>
                <td className="p-3 capitalize">{p.type}</td>
                <td className="p-3 text-muted-foreground">{p.flock_id ? flockName(p.flock_id) : "—"}</td>
                <td className="p-3 text-right font-medium">{num(p.quantity)} {p.unit}</td>
                <td className="p-3"><Button variant="ghost" size="icon" onClick={() => confirm("Hapus?") && del.mutate(p.id)}><Trash2 className="h-4 w-4" /></Button></td>
              </tr>
            ))}
            {(list.data ?? []).length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Belum ada catatan produksi.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}