export const rupiah = (n: number | string | null | undefined) => {
  const v = Number(n ?? 0);
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);
};

export const num = (n: number | string | null | undefined) =>
  new Intl.NumberFormat("id-ID").format(Number(n ?? 0));

export const tanggal = (d: string | Date) => new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });