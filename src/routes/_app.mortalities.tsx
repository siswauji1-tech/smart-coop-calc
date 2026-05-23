import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useList, useInsert, useDelete } from "@/lib/queries";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { num, tanggal } from "@/lib/format";
import { FlockSelect } from "@/components/flock-select";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_app/mortalities")({ component: Page });

function Page() {
  const list = useList<any>("mortalities", "event_date");
  const flocks = useList<any>("flocks");
  const insert = useInsert("mortalities", ["mortalities", "flocks"]);
  const del = useDelete("mortalities", ["mortalities", "flocks"]);
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [flock, setFlock] = useState("");

  const flockName = (id: string) => flocks.data?.find((f) => f.id === id);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!flock || flock === "__none") return;
    const fd = new FormData(e.currentTarget);
    const count = Number(fd.get("count"));
    await insert.mutateAsync({
      flock_id: flock, count, cause: fd.get("cause") || null,
      event_date: fd.get("event_date") || new Date().toISOString().slice(0, 10),
    });
    // decrement flock current_count
    const f = flockName(flock);
    if (f) await supabase.from("flocks").update({ current_count: Math.max(0, f.current_count - count) }).eq("id", flock);
    qc.invalidateQueries({ queryKey: ["flocks"] });
    setOpen(false); setFlock("");
  };

  return (
    <div>
      <PageHeader title="Kematian Ternak" description="Catat kematian ayam. Jumlah ekor aktif kawanan akan ikut berkurang."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Catat Kematian</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Catat Kematian</DialogTitle></DialogHeader>
              <form onSubmit={submit} className="space-y-4">
                <div><Label>Kawanan</Label><FlockSelect value={flock} onChange={setFlock} allowEmpty={false} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Jumlah Mati</Label><Input name="count" type="number" required min={1} /></div>
                  <div><Label>Tanggal</Label><Input name="event_date" type="date" /></div>
                </div>
                <div><Label>Sebab</Label><Input name="cause" placeholder="cth: sakit / cuaca" /></div>
                <Button type="submit" className="w-full" disabled={insert.isPending}>Simpan</Button>
              </form>
            </DialogContent>
          </Dialog>
        } />

      <div className="rounded-2xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr><th className="p-3">Tanggal</th><th className="p-3">Kawanan</th><th className="p-3">Sebab</th><th className="p-3 text-right">Jumlah</th><th /></tr>
          </thead>
          <tbody>
            {(list.data ?? []).map((m) => (
              <tr key={m.id} className="border-t">
                <td className="p-3">{tanggal(m.event_date)}</td>
                <td className="p-3">{flockName(m.flock_id)?.code ?? "—"}</td>
                <td className="p-3 text-muted-foreground">{m.cause ?? "—"}</td>
                <td className="p-3 text-right font-medium">{num(m.count)} ekor</td>
                <td className="p-3"><Button variant="ghost" size="icon" onClick={() => confirm("Hapus?") && del.mutate(m.id)}><Trash2 className="h-4 w-4" /></Button></td>
              </tr>
            ))}
            {(list.data ?? []).length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Belum ada catatan.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}