import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { Download, BookOpen } from "lucide-react";
import jsPDF from "jspdf";

export const Route = createFileRoute("/_app/guide")({
  head: () => ({ meta: [{ title: "Panduan — Smart Poultry Manager" }] }),
  component: GuidePage,
});

const sections: { title: string; body: string[] }[] = [
  {
    title: "1. Pendahuluan",
    body: [
      "Smart Poultry Manager adalah sistem ERP mikro untuk peternakan unggas. Aplikasi ini membantu Anda mencatat kawanan (flock), pengeluaran, produksi, penjualan, kematian, dan aset, lalu menghitung Harga Pokok Produksi (HPP) berbasis aktivitas agar Anda tahu harga jual minimum yang tidak merugi.",
    ],
  },
  {
    title: "2. Memulai",
    body: [
      "1) Buka halaman /auth dan daftar akun baru dengan email & kata sandi.",
      "2) Verifikasi email Anda (jika diminta), lalu masuk.",
      "3) Anda akan diarahkan ke Dashboard. Gunakan sidebar untuk berpindah modul.",
    ],
  },
  {
    title: "3. Modul Kawanan (Flocks)",
    body: [
      "Catat setiap batch unggas: nama batch, jenis (indukan/pembesaran/petelur), tanggal masuk, jumlah awal, dan harga beli per ekor.",
      "Sistem otomatis melacak jumlah saat ini berdasarkan data kematian & penjualan.",
    ],
  },
  {
    title: "4. Modul Pengeluaran (Expenses)",
    body: [
      "Catat semua biaya: pakan, obat, vaksin, listrik, tenaga kerja, transport, dll.",
      "Pilih kategori dan kaitkan ke kawanan tertentu (biaya langsung) atau biarkan kosong untuk overhead umum yang akan dialokasikan otomatis di HPP.",
    ],
  },
  {
    title: "5. Modul Produksi",
    body: [
      "Catat hasil produksi harian: jumlah telur, DOC, atau berat panen.",
      "Data ini menjadi pembagi pada rumus HPP per unit.",
    ],
  },
  {
    title: "6. Modul Penjualan",
    body: [
      "Catat penjualan telur, DOC, indukan, atau ayam pedaging. Masukkan jumlah & harga jual.",
      "Sistem menghitung pendapatan & laba kotor terhadap HPP.",
    ],
  },
  {
    title: "7. Modul Kematian",
    body: [
      "Catat kematian per kawanan. Sistem otomatis mengurangi populasi aktif sehingga laporan tetap akurat.",
    ],
  },
  {
    title: "8. Modul Aset",
    body: [
      "Daftarkan kandang, mesin tetas, tempat pakan, dll beserta harga & umur ekonomis.",
      "Penyusutan bulanan dihitung otomatis dan ikut dialokasikan ke HPP.",
    ],
  },
  {
    title: "9. Kalkulator HPP",
    body: [
      "Rumus: Total Biaya = Biaya Langsung Kawanan + (Overhead Umum × %alokasi) + (Penyusutan Aset × durasi × %alokasi).",
      "HPP per unit = Total Biaya ÷ Jumlah Unit Produksi.",
      "Harga Jual Disarankan = HPP × (1 + margin target). Atur margin sesuai keinginan untuk melihat skenario harga.",
    ],
  },
  {
    title: "10. Tips Penggunaan",
    body: [
      "• Catat transaksi setiap hari agar HPP akurat.",
      "• Pisahkan biaya langsung (terkait satu kawanan) dan overhead (umum) dengan benar.",
      "• Tinjau dashboard mingguan untuk memantau mortalitas & margin.",
    ],
  },
];

function GuidePage() {
  const handleDownload = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 48;
    let y = margin;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Panduan Smart Poultry Manager", margin, y);
    y += 24;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(110);
    doc.text("Sistem ERP Peternakan Unggas Skala Mikro/Menengah", margin, y);
    doc.setTextColor(0);
    y += 24;

    sections.forEach((s) => {
      if (y > pageH - margin - 60) { doc.addPage(); y = margin; }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(s.title, margin, y);
      y += 16;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      s.body.forEach((p) => {
        const lines = doc.splitTextToSize(p, pageW - margin * 2);
        lines.forEach((line: string) => {
          if (y > pageH - margin) { doc.addPage(); y = margin; }
          doc.text(line, margin, y);
          y += 15;
        });
        y += 4;
      });
      y += 8;
    });

    doc.save("Panduan-Smart-Poultry-Manager.pdf");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Panduan Pengguna"
        description="Dokumentasi lengkap penggunaan Smart Poultry Manager."
        action={
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" /> Unduh PDF
          </Button>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" /> Daftar Isi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm list-decimal pl-5">
            {sections.map((s) => (
              <li key={s.title}>
                <a href={`#${slug(s.title)}`} className="hover:underline">{s.title.replace(/^\d+\.\s*/, "")}</a>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {sections.map((s) => (
        <Card key={s.title} id={slug(s.title)}>
          <CardHeader><CardTitle className="text-lg">{s.title}</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            {s.body.map((p, i) => <p key={i}>{p}</p>)}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}