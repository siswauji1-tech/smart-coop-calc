import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Egg, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({ component: AuthPage });

function AuthPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!authLoading && user) return <Navigate to="/dashboard" />;

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: String(fd.get("name")), farm_name: String(fd.get("farm")) },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Akun dibuat! Mengarahkan...");
    navigate({ to: "/dashboard" });
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-sidebar text-sidebar-foreground p-12">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Egg className="h-5 w-5" />
          </div>
          <span className="font-bold">Smart Poultry Manager</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold leading-tight">Peternakan modern dimulai dari catatan yang rapi.</h2>
          <p className="mt-4 text-sm opacity-80 max-w-md">Hitung HPP otomatis, tentukan harga jual dengan percaya diri, dan ketahui setiap rupiah modal Anda menghasilkan apa.</p>
        </div>
        <div className="text-xs opacity-60">© Smart Poultry Manager</div>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Masuk</TabsTrigger>
              <TabsTrigger value="signup">Daftar</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="mt-6 space-y-4">
                <div><Label>Email</Label><Input name="email" type="email" required /></div>
                <div><Label>Password</Label><Input name="password" type="password" required minLength={6} /></div>
                <Button type="submit" className="w-full" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Masuk</Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="mt-6 space-y-4">
                <div><Label>Nama Lengkap</Label><Input name="name" required /></div>
                <div><Label>Nama Peternakan</Label><Input name="farm" placeholder="cth: Peternakan Maju Jaya" required /></div>
                <div><Label>Email</Label><Input name="email" type="email" required /></div>
                <div><Label>Password</Label><Input name="password" type="password" required minLength={6} /></div>
                <Button type="submit" className="w-full" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Buat Akun</Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}