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

export const Route = createFileRoute("/_app/flocks")({ component: FlocksPage });

function FlocksPage() {
  const list = useList<any>("flocks");
  const insert = useInsert("flocks");
  const del = useDelete("flocks");
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("pembesaran");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const initial = Number(fd.get("initial_count"));
    await insert.mutateAsync({
      code: fd.get("code"), name: fd.get("name"), type,
      initial_count: initial, current_count: initial,
      start_date: fd.get("start_date") || new Date().toISOString().slice(0, 10),
      notes: fd.get("notes") || null,
    });
    setOpen(false);
  };

  return (
    <div>
      <PageHeader title="Kawanan Ternak" description="Kelola batch indukan, pembesaran, DOC, atau petelur."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Tambah Kawanan</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Kawanan Baru</DialogTitle></DialogHeader>
              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Kode</Label><Input name="code" required placeholder="A-001" /></div>
                  <div><Label>Jenis</Label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="indukan">Indukan</SelectItem>
                        <SelectItem value="pembesaran">Pembesaran</SelectItem>
                        <SelectItem value="doc">DOC</SelectItem>
                        <SelectItem value="petelur">Petelur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div><Label>Nama</Label><Input name="name" required placeholder="cth: Kandang A Broiler" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Jumlah Awal (ekor)</Label><Input name="initial_count" type="number" required /></div>
                  <div><Label>Tanggal Mulai</Label><Input name="start_date" type="date" /></div>
                </div>
                <div><Label>Catatan</Label><Input name="notes" /></div>
                <Button type="submit" className="w-full" disabled={insert.isPending}>Simpan</Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(list.data ?? []).map((f) => (
          <div key={f.id} className="rounded-2xl border bg-card p-5">
            <div className="flex justify-between">
              <div>
                <div className="text-xs text-muted-foreground">{f.code}</div>
                <h3 className="font-semibold">{f.name}</h3>
                <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground capitalize">{f.type}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => confirm("Hapus kawanan?") && del.mutate(f.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div><div className="text-muted-foreground text-xs">Aktif</div><div className="font-medium">{num(f.current_count)} ekor</div></div>
              <div><div className="text-muted-foreground text-xs">Awal</div><div className="font-medium">{num(f.initial_count)} ekor</div></div>
              <div className="col-span-2"><div className="text-muted-foreground text-xs">Mulai</div><div>{tanggal(f.start_date)}</div></div>
            </div>
          </div>
        ))}
        {(list.data ?? []).length === 0 && !list.isLoading && (
          <div className="col-span-full text-center py-12 text-muted-foreground border border-dashed rounded-2xl">Belum ada kawanan. Mulai dengan menambahkan kawanan pertama Anda.</div>
        )}
      </div>
    </div>
  );
}