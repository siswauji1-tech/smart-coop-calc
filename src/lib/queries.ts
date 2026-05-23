import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useList<T = any>(table: string, order = "created_at") {
  return useQuery({
    queryKey: [table],
    queryFn: async (): Promise<T[]> => {
      const { data, error } = await supabase.from(table as any).select("*").order(order, { ascending: false });
      if (error) throw error;
      return (data ?? []) as T[];
    },
  });
}

export function useInsert(table: string, invalidate: string[] = [table]) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: any) => {
      const { data: u } = await supabase.auth.getUser();
      const payload = { ...row, user_id: u.user?.id };
      const { data, error } = await supabase.from(table as any).insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { invalidate.forEach((k) => qc.invalidateQueries({ queryKey: [k] })); toast.success("Tersimpan"); },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useDelete(table: string, invalidate: string[] = [table]) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { invalidate.forEach((k) => qc.invalidateQueries({ queryKey: [k] })); toast.success("Dihapus"); },
    onError: (e: any) => toast.error(e.message),
  });
}