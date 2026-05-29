import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default async function handler(req: any, res: any) {
  const path = req.url?.replace("/api/", "") || "";

  // GET /api/tabungan
  if (req.method === "GET" && path === "tabungan") {
    const { data: targets } = await supabase.from("cs_targets").select("*").order("created_at", { ascending: false });
    const { data: transactions } = await supabase.from("cs_transactions").select("*").order("created_at", { ascending: false });
    const { data: settings } = await supabase.from("cs_settings").select("value").eq("key", "qris_image").single();
    return res.json({ targets: targets || [], transactions: transactions || [], qris_image: settings?.value || "" });
  }

  // POST /api/tabungan/nabung
  if (req.method === "POST" && path === "tabungan/nabung") {
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
      if (target) await supabase.from("cs_targets").update({ saldo_terkumpul: target.saldo_terkumpul + finalNominal }).eq("id", targetId);
    }
    return res.json({ success: true, transaction: newTx });
  }

  // POST /api/tabungan/target
  if (req.method === "POST" && path === "tabungan/target") {
    const { nama_target, target_nominal, deadline } = req.body;
    if (!nama_target || !target_nominal)
      return res.status(400).json({ error: "Nama target dan nominal wajib diisi" });

    const newTarget = {
      id: "target-" + Date.now(),
      nama_target, target_nominal: Number(target_nominal), saldo_terkumpul: 0,
      deadline: deadline || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      created_at: new Date().toISOString()
    };
    await supabase.from("cs_targets").insert([newTarget]);
    return res.json({ success: true, target: newTarget });
  }

  // DELETE /api/tabungan/target/:id
  if (req.method === "DELETE" && path.startsWith("tabungan/target/")) {
    const id = path.replace("tabungan/target/", "");
    await supabase.from("cs_transactions").update({ target_id: "umum" }).eq("target_id", id);
    await supabase.from("cs_targets").delete().eq("id", id);
    const { data: targets } = await supabase.from("cs_targets").select("*");
    const { data: transactions } = await supabase.from("cs_transactions").select("*");
    return res.json({ success: true, targets, transactions });
  }

  // DELETE /api/tabungan/transaksi/:id
  if (req.method === "DELETE" && path.startsWith("tabungan/transaksi/") && !path.includes("/status")) {
    const id = path.replace("tabungan/transaksi/", "");
    const { data: tx } = await supabase.from("cs_transactions").select("*").eq("id", id).single();
    if (!tx) return res.status(404).json({ error: "Transaksi tidak ditemukan" });
    if (tx.status === "berhasil" && tx.target_id !== "umum") {
      const { data: target } = await supabase.from("cs_targets").select("saldo_terkumpul").eq("id", tx.target_id).single();
      if (target) await supabase.from("cs_targets").update({ saldo_terkumpul: Math.max(0, target.saldo_terkumpul - tx.nominal) }).eq("id", tx.target_id);
    }
    await supabase.from("cs_transactions").delete().eq("id", id);
    const { data: targets } = await supabase.from("cs_targets").select("*");
    const { data: transactions } = await supabase.from("cs_transactions").select("*");
    return res.json({ success: true, targets, transactions });
  }

  // POST /api/tabungan/transaksi/:id/status
  if (req.method === "POST" && path.includes("/status")) {
    const id = path.replace("tabungan/transaksi/", "").replace("/status", "");
    const { status } = req.body;
    const { data: tx } = await supabase.from("cs_transactions").select("*").eq("id", id).single();
    if (!tx) return res.status(404).json({ error: "Transaksi tidak ditemukan" });
    const oldStatus = tx.status;
    await supabase.from("cs_transactions").update({ status }).eq("id", id);
    if (status === "berhasil" && oldStatus !== "berhasil" && tx.target_id !== "umum") {
      const { data: target } = await supabase.from("cs_targets").select("saldo_terkumpul").eq("id", tx.target_id).single();
      if (target) await supabase.from("cs_targets").update({ saldo_terkumpul: target.saldo_terkumpul + tx.nominal }).eq("id", tx.target_id);
    }
    const { data: targets } = await supabase.from("cs_targets").select("*");
    return res.json({ success: true, targets });
  }

// POST /api/tabungan/qris
  if (req.method === "POST" && path === "tabungan/qris") {
    const { qris_image } = req.body;
    await supabase.from("cs_targets").update({ qris_image: qris_image || "" }).eq("id", "target-1");
    return res.json({ success: true, qris_image: qris_image || "" });
  }

  // GET /api/tabungan/qris
  if (req.method === "GET" && path === "tabungan/qris") {
    const { data } = await supabase.from("cs_targets").select("qris_image").eq("id", "target-1").single();
    return res.json({ success: true, qris_image: data?.qris_image || "" });
  }


  return res.status(404).json({ error: "Route not found" });
}