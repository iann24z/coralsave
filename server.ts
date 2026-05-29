import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ limit: "15mb", extended: true }));

  // GET semua data
  app.get("/api/tabungan", async (req, res) => {
    const { data: targets } = await supabase.from("cs_targets").select("*").order("created_at", { ascending: false });
    const { data: transactions } = await supabase.from("cs_transactions").select("*").order("created_at", { ascending: false });
    const { data: qrisRow } = await supabase.from("cs_targets").select("qris_image").limit(1).single();
    res.json({ targets: targets || [], transactions: transactions || [], qris_image: "" });
  });

  // Nabung / tambah transaksi
  app.post("/api/tabungan/nabung", async (req, res) => {
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
  });

  // Buat target baru
  app.post("/api/tabungan/target", async (req, res) => {
    const { nama_target, target_nominal, deadline } = req.body;
    if (!nama_target || !target_nominal)
      return res.status(400).json({ error: "Nama target dan nominal target wajib diisi" });

    const newTarget = {
      id: "target-" + Date.now(),
      nama_target, target_nominal: Number(target_nominal), saldo_terkumpul: 0,
      deadline: deadline || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      created_at: new Date().toISOString()
    };

    await supabase.from("cs_targets").insert([newTarget]);
    res.json({ success: true, target: newTarget });
  });

  // Update status transaksi
  app.post("/api/tabungan/transaksi/:id/status", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const { data: tx } = await supabase.from("cs_transactions").select("*").eq("id", id).single();
    if (!tx) return res.status(404).json({ error: "Transaksi tidak ditemukan" });

    const oldStatus = tx.status;
    await supabase.from("cs_transactions").update({ status }).eq("id", id);

    if (status === "berhasil" && oldStatus !== "berhasil" && tx.target_id !== "umum") {
      const { data: target } = await supabase.from("cs_targets").select("saldo_terkumpul").eq("id", tx.target_id).single();
      if (target) await supabase.from("cs_targets").update({ saldo_terkumpul: target.saldo_terkumpul + tx.nominal }).eq("id", tx.target_id);
    } else if (status !== "berhasil" && oldStatus === "berhasil" && tx.target_id !== "umum") {
      const { data: target } = await supabase.from("cs_targets").select("saldo_terkumpul").eq("id", tx.target_id).single();
      if (target) await supabase.from("cs_targets").update({ saldo_terkumpul: Math.max(0, target.saldo_terkumpul - tx.nominal) }).eq("id", tx.target_id);
    }

    const { data: targets } = await supabase.from("cs_targets").select("*");
    res.json({ success: true, targets });
  });

  // Hapus target
  app.delete("/api/tabungan/target/:id", async (req, res) => {
    const { id } = req.params;
    await supabase.from("cs_transactions").update({ target_id: "umum" }).eq("target_id", id);
    await supabase.from("cs_targets").delete().eq("id", id);
    const { data: targets } = await supabase.from("cs_targets").select("*");
    const { data: transactions } = await supabase.from("cs_transactions").select("*");
    res.json({ success: true, targets, transactions });
  });

  // Hapus transaksi
  app.delete("/api/tabungan/transaksi/:id", async (req, res) => {
    const { id } = req.params;
    const { data: tx } = await supabase.from("cs_transactions").select("*").eq("id", id).single();
    if (!tx) return res.status(404).json({ error: "Transaksi tidak ditemukan" });

    if (tx.status === "berhasil" && tx.target_id !== "umum") {
      const { data: target } = await supabase.from("cs_targets").select("saldo_terkumpul").eq("id", tx.target_id).single();
      if (target) await supabase.from("cs_targets").update({ saldo_terkumpul: Math.max(0, target.saldo_terkumpul - tx.nominal) }).eq("id", tx.target_id);
    }

    await supabase.from("cs_transactions").delete().eq("id", id);
    const { data: targets } = await supabase.from("cs_targets").select("*");
    const { data: transactions } = await supabase.from("cs_transactions").select("*");
    res.json({ success: true, targets, transactions });
  });

  // Scan bukti transfer dengan Gemini
  app.post("/api/tabungan/scan-bukti", async (req, res) => {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: "Gambar bukti transfer wajib dikirim" });

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let mimeType = "image/jpeg";
      let base64Data = image;
      if (matches) { mimeType = matches[1]; base64Data = matches[2]; }

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          { inlineData: { mimeType, data: base64Data } },
          { text: `Analyze this Indonesian bank transfer receipt. Extract: nama_penyetor (sender name, max 25 chars), nominal (integer amount), metode_pembayaran (bank/wallet name), catatan (brief note).` }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              nama_penyetor: { type: Type.STRING },
              nominal: { type: Type.INTEGER },
              metode_pembayaran: { type: Type.STRING },
              catatan: { type: Type.STRING }
            },
            required: ["nama_penyetor", "nominal"]
          }
        }
      });

      res.json({ success: true, data: JSON.parse(response.text!.trim()) });
    } catch (err: any) {
      res.status(500).json({ error: "Gagal memindai bukti transfer.", details: err.message });
    }
  });

  // Serve frontend
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => console.log(`[CoralSave] Running at http://localhost:${PORT}`));
}

startServer();