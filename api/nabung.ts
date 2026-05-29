import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  
  const { nama_penyetor, nominal, metode_pembayaran, catatan, bukti_transfer, target_id } = req.body;
  if (!nama_penyetor || !nominal || !metode_pembayaran)
    return res.status(400).json({ error: "Nama penyetor, nominal, dan metode pembayaran wajib diisi" });

  const finalNominal = Number(nominal);
  const targetId = target_id || "umum";
  const newTx = {
    id: "tx-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
    nama_penyetor, nominal: finalNominal, metode_pembayaran,
    catatan: catatan || "", bukti_transfer: bukti_transfer || "",
    status: "berhasil", target_id: targetId,
    created_at: new Date().toISOString()
  };

  await supabase.from("cs_transactions").insert([newTx]);

  if (targetId !== "umum") {
    const { data: target } = await supabase.from("cs_targets").select("saldo_terkumpul").eq("id", targetId).single();
    if (target) {
      await supabase.from("cs_targets").update({ saldo_terkumpul: target.saldo_terkumpul + finalNominal }).eq("id", targetId);
    }
  }

  res.json({ success: true, transaction: newTx });
}