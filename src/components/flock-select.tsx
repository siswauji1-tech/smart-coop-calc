import { useList } from "@/lib/queries";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function FlockSelect({ value, onChange, allowEmpty = true }: { value: string; onChange: (v: string) => void; allowEmpty?: boolean }) {
  const { data } = useList<any>("flocks");
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger><SelectValue placeholder="Pilih kawanan..." /></SelectTrigger>
      <SelectContent>
        {allowEmpty && <SelectItem value="__none">— Umum (tidak terikat kawanan) —</SelectItem>}
        {(data ?? []).map((f) => (<SelectItem key={f.id} value={f.id}>{f.code} — {f.name}</SelectItem>))}
      </SelectContent>
    </Select>
  );
}