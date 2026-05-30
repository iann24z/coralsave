import React, { useEffect, useState, useRef } from "react";
import { 
  PiggyBank, 
  Plus, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  Users, 
  QrCode, 
  Target as TargetIcon,
  Clock, 
  Search, 
  Filter, 
  Download, 
  Copy, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ChevronRight, 
  Image as ImageIcon,
  Check,
  Calendar,
  Wallet,
  X,
  CreditCard,
  Maximize2,
  Trash2,
  Upload,
  RefreshCw
} from "lucide-react";
import SplashScreen from "./components/SplashScreen";
import QRCode from "react-qr-code";
import { SavingTarget, Transaction } from "./types";

const DEFAULT_QRIS_PAYLOAD = "00020101021126570016ID1020221319760010303UMI51440014ID102022131976020303UMI5204541153033605802ID5912NABUNYUK CO6015KOTA YOGYAKART61055518262070703A0163043150";

const generateMockReceipt = (type: "BCA" | "GOPAY" | "MANDIRI", senderName: string): string => {
  const canvas = document.createElement("canvas");
  canvas.width = 420;
  canvas.height = 580;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Solid White Base Background
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (type === "BCA") {
    // Top Bar - Bank Jago Orange-Yellow Accent
    ctx.fillStyle = "#F5A623";
    ctx.fillRect(0, 0, canvas.width, 70);

    // Header text
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 18px Helvetica, Arial, sans-serif";
    ctx.fillText("Kantong Jago", 30, 30);
    
    ctx.fillStyle = "#FFF4E0";
    ctx.font = "bold 11px Helvetica, Arial, sans-serif";
    ctx.fillText("TRANSFER BERHASIL / SUCCESS", 30, 52);

    // Draw detail entries
    ctx.fillStyle = "#2D3748";
    ctx.font = "bold 13px monospace";
    let y = 110;
    
    ctx.fillText("TANGGAL/JAM : " + new Date().toLocaleString(), 30, y); y += 35;
    ctx.fillText("STATUS      : BERHASIL/SUCCESS", 30, y); y += 35;
    ctx.fillText("PENGIRIM    : " + senderName.toUpperCase(), 30, y); y += 35;
    ctx.fillText("KE REKENING : JAGO - 109543414634", 30, y); y += 35;
    
    // Choose a realistic random amount
    const amounts = [50000, 100000, 150000, 200000, 250000, 350000, 500000];
    const pickedAmount = amounts[Math.floor(Math.random() * amounts.length)];
    ctx.fillText("NOMINAL     : RP " + pickedAmount.toLocaleString("id-ID"), 30, y); y += 35;
    ctx.fillText("REMARK      : NABUNG OTOMATIS CERDAS", 30, y); y += 45;

    // Divider dashed line
    ctx.strokeStyle = "#CBD5E0";
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(35, y);
    ctx.lineTo(385, y);
    ctx.stroke();
    y += 40;

    // Footer info
    ctx.fillStyle = "#718096";
    ctx.font = "italic 11px Helvetica, Arial, sans-serif";
    ctx.fillText("Bank Jago Indonesia Berhasil Diverifikasi", 30, y); y += 18;
    ctx.fillText("Sistem Pindai Instan & Berhasil Terisi.", 30, y);
  } 
  else if (type === "GOPAY") {
    // GoPay Header
    ctx.fillStyle = "#F7FAFC";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Green receipt accent
    ctx.fillStyle = "#00A4CD"; // GoPay Cyan
    ctx.fillRect(0, 0, canvas.width, 14);
    
    ctx.fillStyle = "#319795"; // Gojek Green accent
    ctx.fillRect(0, 14, canvas.width, 4);

    ctx.fillStyle = "#1A202C";
    ctx.font = "bold 15px Helvetica, Arial, sans-serif";
    ctx.fillText("GoPay Transfer", 25, 50);

    ctx.fillStyle = "#38A169"; // Success Green
    ctx.font = "bold 19px Helvetica, Arial, sans-serif";
    ctx.fillText("Transfer Berhasil!", 25, 90);

    ctx.strokeStyle = "#E2E8F0";
    ctx.setLineDash([]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(25, 115);
    ctx.lineTo(395, 115);
    ctx.stroke();

    // Receiver Details
    ctx.fillStyle = "#4A5568";
    ctx.font = "12px Helvetica, Arial, sans-serif";
    ctx.fillText("Penerima:", 25, 145);
    ctx.fillStyle = "#1A202C";
    ctx.font = "bold 14px Helvetica, Arial, sans-serif";
    ctx.fillText("KAS BERSAMA (QRIS)", 25, 168);

    // Sender Details
    ctx.fillStyle = "#4A5568";
    ctx.font = "12px Helvetica, Arial, sans-serif";
    ctx.fillText("Sumber Dana:", 230, 145);
    ctx.fillStyle = "#1A202C";
    ctx.font = "bold 14px Helvetica, Arial, sans-serif";
    ctx.fillText(senderName.toUpperCase(), 230, 168);

    ctx.strokeStyle = "#E2E8F0";
    ctx.beginPath();
    ctx.moveTo(25, 195);
    ctx.lineTo(395, 195);
    ctx.stroke();

    // Selected nominal
    const amounts = [45000, 75000, 125000, 150000, 175000, 220000, 300000];
    const pickedAmount = amounts[Math.floor(Math.random() * amounts.length)];

    ctx.fillStyle = "#4A5568";
    ctx.font = "12px Helvetica, Arial, sans-serif";
    ctx.fillText("Nominal Transfer:", 25, 230);
    ctx.fillStyle = "#1A202C";
    ctx.font = "bold 20px Helvetica, Arial, sans-serif";
    ctx.fillText("Rp " + pickedAmount.toLocaleString("id-ID"), 25, 260);

    ctx.fillStyle = "#4A5568";
    ctx.font = "12px Helvetica, Arial, sans-serif";
    ctx.fillText("Biaya Admin:", 230, 230);
    ctx.fillStyle = "#1A202C";
    ctx.font = "bold 14px Helvetica, Arial, sans-serif";
    ctx.fillText("Rp 0", 230, 255);

    // Details box
    ctx.fillStyle = "#EDF2F7";
    ctx.fillRect(25, 300, 370, 90);
    ctx.strokeStyle = "#CBD5E0";
    ctx.strokeRect(25, 300, 370, 90);

    ctx.fillStyle = "#2D3748";
    ctx.font = "11px Helvetica, Arial, sans-serif";
    ctx.fillText("Waktu: " + new Date().toLocaleString(), 40, 330);
    ctx.fillText("ID Transaksi: GP-" + Math.floor(Math.random() * 899999 + 100000) + "-AI", 40, 355);

    // Message
    ctx.fillStyle = "#718096";
    ctx.font = "italic 11px Helvetica, Arial, sans-serif";
    ctx.fillText("Sistem Pindai Otomatis QRIS / E-wallet Sukses.", 25, 435);
  }
  else {
    // Mandiri Livin
    ctx.fillStyle = "#0D2146"; // Mandiri Blue
    ctx.fillRect(0, 0, canvas.width, 75);
    
    ctx.fillStyle = "#F6C10B"; // Gold stripe
    ctx.fillRect(0, 75, canvas.width, 6);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 20px Arial";
    ctx.fillText("livin' by mandiri", 30, 45);

    ctx.fillStyle = "#1A202C";
    ctx.font = "bold 15px Arial";
    let y = 125;
    ctx.fillText("TRANSFER BERHASIL / SUCCESS", 30, y); y += 35;

    ctx.font = "12px Arial";
    ctx.fillStyle = "#4A5568";
    ctx.fillText("Dari Rekening Pengirim", 30, y);
    ctx.fillText("Rekening Penerima", 220, y); y += 20;

    ctx.fillStyle = "#1A202C";
    ctx.font = "bold 12px Arial";
    ctx.fillText(senderName.toUpperCase() + " (Mandiri)", 30, y);
    ctx.fillText("TABUNGAN KAS BERSAMA", 220, y); y += 35;

    ctx.strokeStyle = "#E2E8F0";
    ctx.beginPath();
    ctx.moveTo(30, y);
    ctx.lineTo(390, y);
    ctx.stroke();
    y += 25;

    const amounts = [30000, 60000, 90000, 120000, 180000, 240000, 400000];
    const pickedAmount = amounts[Math.floor(Math.random() * amounts.length)];

    ctx.fillStyle = "#4A5568";
    ctx.font = "12px Arial";
    ctx.fillText("Jumlah Transfer", 30, y);
    ctx.fillText("Waktu Transaksi", 220, y); y += 20;

    ctx.fillStyle = "#1A202C";
    ctx.font = "bold 18px Arial";
    ctx.fillText("Rp " + pickedAmount.toLocaleString("id-ID"), 30, y);
    ctx.font = "bold 12px Arial";
    ctx.fillText(new Date().toLocaleDateString("id-ID"), 220, y); y += 45;

    // Gray status details
    ctx.fillStyle = "#F7FAFC";
    ctx.fillRect(30, y, 360, 65);
    ctx.strokeStyle = "#E2E8F0";
    ctx.strokeRect(30, y, 360, 65);

    ctx.fillStyle = "#2D3748";
    ctx.font = "11px Arial";
    ctx.fillText("No Resi / Ref - LIVIN-" + Math.floor(Math.random() * 89999 + 10000), 45, y + 25);
    ctx.fillText("Deskripsi: Setor Uang via Livin Mandiri", 45, y + 45);
  }

  return canvas.toDataURL("image/jpeg");
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  
  // App state
  const [targets, setTargets] = useState<SavingTarget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalSaving, setTotalSaving] = useState(0);
  const [bastianSaving, setBastianSaving] = useState(0);
  const [zahraSaving, setZahraSaving] = useState(0);
  const [loading, setLoading] = useState(true);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterTarget, setFilterTarget] = useState<string>("all");

  // Form States for Modals
  const [isNabungOpen, setIsNabungOpen] = useState(false);
  const [isNewTargetOpen, setIsNewTargetOpen] = useState(false);
  const [isQrisZoomOpen, setIsQrisZoomOpen] = useState(false);

  // Direct Saving Form Data
  const [savingForm, setSavingForm] = useState({
    nama_penyetor: "",
    nominal: "",
    metode_pembayaran: "QRIS",
    catatan: "",
    target_id: "umum",
    bukti_transfer: "",
  });

  // Adding Target Form Data
  const [targetForm, setTargetForm] = useState({
    nama_target: "",
    target_nominal: "",
    deadline: "",
  });

  // Toasts State
  const [toasts, setToasts] = useState<{ id: string; message: string; type: "success" | "error" | "info" }[]>([]);

  // Drag and Drop Base64 State
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Custom confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Zoomed Image Lightbox State
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Custom QRIS image state
  const [qrisImage, setQrisImage] = useState<string>("");
  const qrisFileInputRef = useRef<HTMLInputElement>(null);
  const [qrisImage2, setQrisImage2] = useState<string>("");
  const qrisFileInputRef2 = useRef<HTMLInputElement>(null);

  // Fetch initial data from server
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/tabungan");
      if (res.ok) {
        const data = await res.json();
        setTargets(data.targets || []);
        setTransactions(data.transactions || []);
        setQrisImage(data.qris_image || "");
        setQrisImage2(data.qris_image_2 || "");
      } else {
        showToast("Gagal memuat data dari database", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Koneksi gagal ke server", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Recalculate total collected tabungan based on successful transactions list
  useEffect(() => {
    const successTransactions = transactions.filter(tx => tx.status === "berhasil");
    
    const successTotal = successTransactions.reduce((sum, tx) => sum + tx.nominal, 0);
    setTotalSaving(successTotal);

    const bastianTotal = successTransactions
      .filter(tx => tx.nama_penyetor.toLowerCase().includes("bastian"))
      .reduce((sum, tx) => sum + tx.nominal, 0);
    setBastianSaving(bastianTotal);

    const zahraTotal = successTransactions
      .filter(tx => tx.nama_penyetor.toLowerCase().includes("zahra"))
      .reduce((sum, tx) => sum + tx.nominal, 0);
    setZahraSaving(zahraTotal);
  }, [transactions]);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Copy helper
  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} berhasil disalin!`, "success");
  };

  // Drag and Drop file helpers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      showToast("Harap pilih berkas gambar saja", "error");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showToast("Ukuran gambar maksimal 8MB", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result as string;
      setSavingForm(prev => ({ ...prev, bukti_transfer: base64Data }));
      showToast("Bukti transfer manual terpilih!", "success");
    };
    reader.readAsDataURL(file);
  };

  const handleAutoProvideReceipt = async (type: "BCA" | "GOPAY" | "MANDIRI") => {
    try {
      // Choose names matched to Bastian and Zahra
      const names = ["Bastian", "Zahra"];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const chosenName = savingForm.nama_penyetor.trim() || randomName;

      const generatedImg = generateMockReceipt(type, chosenName);
      if (generatedImg) {
        // Generate nice amounts and names
        const amounts = [50000, 100000, 150000, 200000, 250000, 300000, 500000];
        const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
        
        const methodMap = {
          BCA: "Transfer Bank Jago",
          GOPAY: "E-Wallet (OVO/GoPay)",
          MANDIRI: "Transfer Bank Mandiri"
        };

        setSavingForm(prev => ({
          ...prev,
          bukti_transfer: generatedImg,
          nama_penyetor: prev.nama_penyetor || chosenName,
          nominal: prev.nominal || String(randomAmount),
          metode_pembayaran: methodMap[type],
          catatan: prev.catatan || `Setoran otomatis (${type})`
        }));
        showToast(`Bukti transfer ${type} untuk ${chosenName} berhasil dibuat & terisi otomatis! ⚡`, "success");
      }
    } catch (e) {
      console.error(e);
      showToast("Gagal membuat gambar bukti otomatis", "error");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Submit Nabung (Create Transaction)
  const handleNabungSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!savingForm.nama_penyetor.trim()) {
      showToast("Nama penyetor wajib diisi", "error");
      return;
    }
    if (!savingForm.nominal || Number(savingForm.nominal) <= 0) {
      showToast("Nominal tabungan harus lebih besar dari 0", "error");
      return;
    }

    try {
      const res = await fetch("/api/tabungan/nabung", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(savingForm)
      });

      if (res.ok) {
        showToast("Setoran berhasil masuk dan langsung disetujui! 🎉", "success");
        setIsNabungOpen(false);
        // Reset Form
        setSavingForm({
          nama_penyetor: "",
          nominal: "",
          metode_pembayaran: "QRIS",
          catatan: "",
          target_id: "umum",
          bukti_transfer: "",
        });
        fetchData();
      } else {
        const err = await res.json();
        showToast(err.error || "Gagal mengirim setoran", "error");
      }
    } catch {
      showToast("Koneksi gagal ke server", "error");
    }
  };

  // Submit New Target (Create Target)
  const handleTargetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetForm.nama_target.trim()) {
      showToast("Nama target wajib diisi", "error");
      return;
    }
    if (!targetForm.target_nominal || Number(targetForm.target_nominal) <= 0) {
      showToast("Nominal target harus diisi dengan benar", "error");
      return;
    }

    try {
      const res = await fetch("/api/tabungan/target", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(targetForm)
      });

      if (res.ok) {
        showToast("Target tabungan baru berhasil didaftarkan!", "success");
        setIsNewTargetOpen(false);
        setTargetForm({ nama_target: "", target_nominal: "", deadline: "" });
        fetchData();
      } else {
        showToast("Gagal mendaftarkan target baru", "error");
      }
    } catch {
      showToast("Koneksi gagal", "error");
    }
  };

  // Delete Target (Delete Target CRUD)
  const handleTargetDelete = (id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Hapus Rencana Target",
      message: `Apakah Anda yakin ingin menghapus rencana target "${name}"? Seluruh transaksi setoran yang dialokasikan ke target ini akan dikembalikan ke Kas Umum.`,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/tabungan/target/${id}`, {
            method: "DELETE"
          });
          if (res.ok) {
            showToast(`Rencana "${name}" berhasil dihapus dari sistem!`, "success");
            fetchData();
          } else {
            showToast("Gagal menghapus rencana target", "error");
          }
        } catch {
          showToast("Koneksi gagal ke server", "error");
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  // Delete Transaction (Delete Transaction CRUD)
  const handleTransactionDelete = (id: string, sender: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Hapus Riwayat Setoran",
      message: `Apakah Anda yakin ingin menghapus data riwayat setoran dari "${sender}"? Nominal setoran berhasil yang terhapus akan dikurangkan dari akumulasi target terkait.`,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/tabungan/transaksi/${id}`, {
            method: "DELETE"
          });
          if (res.ok) {
            showToast(`Riwayat setoran dari ${sender} berhasil dibersihkan!`, "success");
            fetchData();
          } else {
            showToast("Gagal menghapus riwayat setoran", "error");
          }
        } catch {
          showToast("Koneksi gagal ke server", "error");
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  // Demo status controls toggle status directly
  const handleToggleStatus = async (id: string, newStatus: "berhasil" | "gagal" | "pending") => {
    try {
      const res = await fetch(`/api/tabungan/transaksi/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        showToast(`Status transaksi diubah menjadi ${newStatus.toUpperCase()}`, "info");
        fetchData();
      } else {
        showToast("Gagal memperbarui status setoran", "error");
      }
    } catch {
      showToast("Koneksi gagal", "error");
    }
  };

  // Search and Filter logic inside client
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      tx.nama_penyetor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.catatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.metode_pembayaran.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "all" || tx.status === filterStatus;
    const matchesTarget = filterTarget === "all" || tx.target_id === filterTarget;

    return matchesSearch && matchesStatus && matchesTarget;
  });

  const rupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(val);
  };

  // Simulation download toast
  const handleDownloadQR = () => {
    if (qrisImage) {
      // Create a link element to download QRIS kustom
      const link = document.createElement("a");
      link.href = qrisImage;
      link.download = "QRIS-Pembayaran-NabunYuk.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Unduhan QRIS kustom Anda berhasil dimulai!", "success");
    } else {
      // Get the SVG from the DOM, convert to data URI, and download
      const svgElement = document.getElementById("qris-vector-svg");
      if (svgElement) {
        try {
          const svgString = new XMLSerializer().serializeToString(svgElement);
          const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
          const svgUrl = URL.createObjectURL(svgBlob);
          const downloadLink = document.createElement("a");
          downloadLink.href = svgUrl;
          downloadLink.download = "QRIS-Official-NabunYuk.svg";
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(svgUrl);
          showToast("Unduhan file SVG QRIS resmi berhasil dimulai!", "success");
        } catch {
          showToast("QRIS berhasil disimpan ke folder Galeri!", "success");
        }
      } else {
        showToast("QRIS berhasil disimpan ke folder Galeri!", "success");
      }
    }
  };

  // Handle uploaded custom QRIS image
  const handleQrisUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        showToast("Harap pilih berkas gambar saja", "error");
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        showToast("Ukuran gambar maksimal 8MB", "error");
        return;
      }

      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const res = await fetch("/api/tabungan/qris", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ qris_image: base64 })
          });
          if (res.ok) {
            setQrisImage(base64);
            showToast("Kode QRIS pembayaran berhasil diperbarui!", "success");
          } else {
            showToast("Gagal memperbarui kode QRIS", "error");
          }
        } catch {
          showToast("Koneksi gagal ke server", "error");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle clearing QRIS back to template
  const handleClearQris = () => {
    setConfirmModal({
      isOpen: true,
      title: "Reset QRIS ke Bawaan",
      message: "Apakah Anda yakin ingin menghapus kode QRIS kustom Anda dan mengembalikannya ke template bawaan?",
      onConfirm: async () => {
        try {
          const res = await fetch("/api/tabungan/qris", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ qris_image: "" })
          });
          if (res.ok) {
            setQrisImage("");
            showToast("Kode QRIS telah dikembalikan ke template default", "info");
          } else {
            showToast("Gagal mereset QRIS", "error");
          }
        } catch {
          showToast("Koneksi gagal ke server", "error");
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  // Handle uploaded custom QRIS image 2
const handleQrisUpload2 = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      showToast("Harap pilih berkas gambar saja", "error");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showToast("Ukuran gambar maksimal 8MB", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch("/api/tabungan/qris2", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ qris_image: base64 })
        });
        if (res.ok) {
          setQrisImage2(base64);
          showToast("Kode QRIS 2 berhasil diperbarui!", "success");
        } else {
          showToast("Gagal memperbarui kode QRIS 2", "error");
        }
      } catch {
        showToast("Koneksi gagal ke server", "error");
      }
    };
    reader.readAsDataURL(file);
  }
};

const handleClearQris2 = () => {
  setConfirmModal({
    isOpen: true,
    title: "Reset QRIS 2 ke Bawaan",
    message: "Apakah Anda yakin ingin menghapus QRIS 2?",
    onConfirm: async () => {
      try {
        const res = await fetch("/api/tabungan/qris2", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ qris_image: "" })
        });
        if (res.ok) {
          setQrisImage2("");
          showToast("QRIS 2 telah dihapus", "info");
        }
      } catch {
        showToast("Koneksi gagal ke server", "error");
      } finally {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    }
  });
};

  // Calculate stats metrics
  const totalTransactionsCount = transactions.length;
  const pendingTransactionsCount = transactions.filter(tx => tx.status === "pending").length;
  const targetCompletedCount = targets.filter(t => t.saldo_terkumpul >= t.target_nominal).length;

  return (
    <div className="min-h-screen w-full relative overflow-y-auto px-4 md:px-8 py-6 flex flex-col justify-between" style={{ backgroundColor: "#2D1F1B" }}>
      
      {/* Background Soft Glow Spots - Peach/Coral Gradient Ambient Feeling */}
      <div className="absolute top-12 left-1/4 w-[40rem] h-[40rem] bg-primary rounded-full filter blur-[180px] opacity-15 pointer-events-none animate-float-loop" />
      <div className="absolute bottom-12 right-1/4 w-[45rem] h-[45rem] bg-secondary rounded-full filter blur-[200px] opacity-10 pointer-events-none animate-pulse-glow" />
      
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {/* Main Full-Width Dashboard Container */}
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 relative z-10 flex-1">
        
        {/* BRAND NAVIGATION HEADER */}
        <header className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-3xl bg-[#FFF7F5]/5 border border-[#FFD0C7]/10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 shadow-glow animate-float-loop">
              <PiggyBank className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-[#FFF7F5] tracking-wide">NabunYuk!</h1>
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">DASHBOARD</span>
              </div>
              <p className="text-xs text-[#FFD0C7]/60">Portal Pengelolaan Kas & Target Impian Bersama Tercinta</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setSavingForm(prev => ({ ...prev, target_id: targets[0]?.id || "umum" }));
                setIsNabungOpen(true);
              }}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-zinc-900 px-5 py-2.5 rounded-full text-xs font-extrabold shadow-glow hover:scale-105 transition duration-200 active:scale-95"
            >
              <Plus className="w-4 h-4 text-zinc-900" />
              <span>Setor Uang (Nabung)</span>
            </button>
            
            <button 
              onClick={() => setIsNewTargetOpen(true)}
              className="flex items-center gap-2 bg-[#FFF7F5]/10 hover:bg-[#FFF7F5]/15 text-white border border-[#FFD0C7]/20 px-5 py-2.5 rounded-full text-xs font-semibold hover:scale-105 transition duration-200 active:scale-95"
            >
              <TargetIcon className="w-4 h-4 text-primary" />
              <span>Buat Rencana Impian</span>
            </button>
          </div>
        </header>

        {/* TOP STATUS OVERVIEW STATISTIC BENTO CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Total accumulated savings split for Bastian & Zahra */}
          <div className="bg-[#FFF7F5] rounded-[28px] p-6 shadow-premium text-zinc-800 relative overflow-hidden flex flex-col justify-between min-h-[140px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-8 -mt-8" />
            
            <div>
              <span className="text-[10px] tracking-widest text-[#FF8A7A] font-extrabold uppercase block mb-2 text-center">
                SALDO KAS TERKUMPUL
              </span>
              
              <div className="grid grid-cols-2 gap-3 divide-x divide-zinc-250/30">
                {/* Column 1: Bastian */}
                <div className="flex flex-col items-center justify-center text-center px-1">
                  <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mb-1 text-base shadow-sm">
                    👦
                  </div>
                  <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                    Kas Bastian
                  </span>
                  <span className="text-lg font-black text-amber-600 tracking-tight mt-0.5">
                    {rupiah(bastianSaving)}
                  </span>
                </div>

                {/* Column 2: Zahra */}
                <div className="flex flex-col items-center justify-center text-center px-1">
                  <div className="w-9 h-9 rounded-full bg-pink-50 border border-pink-200 flex items-center justify-center mb-1 text-base shadow-sm">
                    👧
                  </div>
                  <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                    Kas Zahra
                  </span>
                  <span className="text-lg font-black text-rose-500 tracking-tight mt-0.5">
                    {rupiah(zahraSaving)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-1.5 text-[9px] text-zinc-400 font-semibold mt-4 pt-3 border-t border-zinc-100">
              <span className="flex items-center gap-1 text-emerald-600">
                <TrendingUp className="w-3.5 h-3.5 animate-pulse shrink-0" />
                <span>Pembagian Berbasis Nama</span>
              </span>
              <span className="bg-zinc-100 text-zinc-650 px-2 py-0.5 rounded-full font-bold">
                Total: {rupiah(totalSaving)}
              </span>
            </div>
          </div>

          {/* Card 2: Saved Targets Statistics */}
          <div className="bg-[#FFF7F5]/5 border border-[#FFD0C7]/15 rounded-[28px] p-6 text-[#FFF7F5] flex flex-col justify-between min-h-[140px]">
            <div>
              <span className="text-[10px] tracking-widest text-primary font-bold uppercase block mb-1">
                TARGET IMPIAN KELOMPOK
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight">{targets.length}</span>
                <span className="text-xs text-white/50">Rencana Terdaftar</span>
              </div>
            </div>
            <div className="text-xs text-[#FFD0C7]/70 font-medium flex items-center gap-1.5 mt-4">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{targetCompletedCount} rencana impian telah tercapai 100%</span>
            </div>
          </div>

          {/* Card 3: Saved Progress / Log states */}
          <div className="bg-[#FFF7F5]/5 border border-[#FFD0C7]/15 rounded-[28px] p-6 text-[#FFF7F5] flex flex-col justify-between min-h-[140px]">
            <div>
              <span className="text-[10px] tracking-widest text-primary font-bold uppercase block mb-1">
                SISTEM VERIFIKASI
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black tracking-tight text-emerald-400">OTOMATIS ⚡</span>
              </div>
              <span className="text-[10px] text-white/60 block mt-1">Setoran langsung disetujui tanpa antrean pending</span>
            </div>
            <div className="text-xs text-[#FFD0C7]/70 font-medium flex items-center gap-1.5 mt-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{totalTransactionsCount} total riwayat setoran disetujui</span>
            </div>
          </div>

        </section>

        {/* PRIMARY MAIN LAYOUT GRID (3 COLUMNS) */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* COLUMN 1 (lg:col-span-4): METHODS, COPY REK, QRIS TRANSFERS */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#FFF7F5] rounded-3xl p-6 text-zinc-800 shadow-premium flex flex-col gap-5">
              
              <div className="pb-3 border-b border-[#FFD0C7]/40">
                <h3 className="text-sm font-extrabold text-zinc-900 tracking-wide flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-primary" />
                  <span>Scan Kode QRIS Instan</span>
                </h3>
                <p className="text-[11px] text-zinc-500 mt-1">Gunakan dompet digital GoPay, OVO, Dana, LinkAja atau super-app perbankan Anda</p>
              </div>

              {/* Styled Simulating Authentic QR Code OR rendering Custom uploaded QRIS */}
              <div className="relative mx-auto w-52 h-52 bg-white border-2 border-zinc-200 rounded-3xl p-3 shadow-inner flex items-center justify-center overflow-hidden">
                <div className="absolute top-2 right-2 z-20 bg-[#FFF7F5]/80 p-1.5 rounded-full backdrop-blur-sm border border-zinc-200 shadow-sm">
                  <Maximize2 
                    onClick={() => setIsQrisZoomOpen(true)}
                    className="w-3.5 h-3.5 text-primary cursor-pointer hover:scale-110 transition duration-150" 
                  />
                </div>
                
                {qrisImage ? (
                  <img 
                    src={qrisImage} 
                    alt="Kode QRIS pembayaran aktif"
                    onClick={() => setIsQrisZoomOpen(true)}
                    className="w-full h-full object-contain cursor-zoom-in hover:scale-[1.02] transition duration-200 rounded-xl"
                  />
                ) : (
                  /* Real scannable high-fidelity Vector QR Code of decoded user QRIS */
                  <div 
                    onClick={() => setIsQrisZoomOpen(true)}
                    className="w-full h-full bg-white flex flex-col items-center justify-center relative overflow-hidden rounded-2xl cursor-zoom-in p-2 border border-zinc-100"
                  >
                    <QRCode
                      id="qris-vector-svg"
                      value={DEFAULT_QRIS_PAYLOAD}
                      size={160}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                      viewBox="0 0 256 256"
                    />
                  </div>
                )}
              </div>

              {/* Adjust / Custom QRIS Trigger & Revert */}
              <div className="flex flex-col gap-2 p-3 bg-zinc-50 border border-zinc-150 rounded-2xl">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-mono font-extrabold text-zinc-500">Kode QRIS Utama:</span>
                  <span className="text-[10px] font-bold text-zinc-650">
                    {qrisImage ? "Kustom Aktif ✅" : "Bawaan Sistem ⚙️"}
                  </span>
                </div>
                
                <input 
                  type="file" 
                  ref={qrisFileInputRef}
                  onChange={handleQrisUpload}
                  accept="image/*"
                  className="hidden"
                />

                <div className="flex gap-1.5 mt-1">
                  <button 
                    onClick={() => qrisFileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-[#FF8A7A]/10 text-primary hover:bg-[#FF8A7A]/20 border border-primary/20 text-[10px] font-black uppercase py-2.5 rounded-xl transition duration-150"
                  >
                    <Upload className="w-3.5 h-3.5" /> Ganti Gambar QRIS
                  </button>
                  
                  {qrisImage && (
                    <button 
                      onClick={handleClearQris}
                      className="flex-none p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition duration-150"
                      title="Kembali ke QRIS Default"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

{/* QRIS KE-2 */}
              <div className="flex flex-col gap-2 p-3 bg-zinc-50 border border-zinc-150 rounded-2xl">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-mono font-extrabold text-zinc-500">Kode QRIS Ke-2:</span>
                  <span className="text-[10px] font-bold text-zinc-650">
                    {qrisImage2 ? "Kustom Aktif" : "Belum Diatur"}
                  </span>
                </div>

                {qrisImage2 && (
                  <div className="relative mx-auto w-40 h-40 bg-white border-2 border-zinc-200 rounded-2xl p-2 shadow-inner flex items-center justify-center overflow-hidden">
                    <img
                      src={qrisImage2}
                      alt="Kode QRIS 2"
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>
                )}

                <input
                  type="file"
                  ref={qrisFileInputRef2}
                  onChange={handleQrisUpload2}
                  accept="image/*"
                  className="hidden"
                />

                <div className="flex gap-1.5 mt-1">
                  <button
                    onClick={() => qrisFileInputRef2.current?.click()}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-[#FF8A7A]/10 text-primary hover:bg-[#FF8A7A]/20 border border-primary/20 text-[10px] font-black uppercase py-2.5 rounded-xl transition duration-150"
                  >
                    <Upload className="w-3.5 h-3.5" /> {qrisImage2 ? "Ganti QRIS 2" : "Upload QRIS 2"}
                  </button>

                  {qrisImage2 && (
                    <button
                      onClick={handleClearQris2}
                      className="flex-none p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition duration-150"
                      title="Hapus QRIS 2"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Quick actions download + copy details */}
              <div className="flex gap-2.5">
                <button 
                  onClick={handleDownloadQR}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#2D1F1B] text-white hover:bg-neutral-800 text-[10px] uppercase tracking-wider font-extrabold py-3 rounded-xl transition duration-150 active:scale-95"
                >
                  <Download className="w-4 h-4" /> Unduh QRIS
                </button>
                <button 
                  onClick={() => handleCopyText("109543414634", "Nomor Rekening Kas")}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#FF8A7A]/10 text-primary border border-primary/20 hover:bg-[#FF8A7A]/15 text-[10px] uppercase tracking-wider font-extrabold py-3 rounded-xl transition duration-150 active:scale-95"
                >
                  <Copy className="w-4 h-4" /> Jago Rekening
                </button>
              </div>

              {/* Instructions steps info */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-2 text-[11px] text-zinc-700 leading-relaxed">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-extrabold text-amber-800 block uppercase">LANGKAH MENABUNG</span>
                  <p>1. Transfer dana via scan QRIS atau Bank Jago di atas.</p>
                  <p>2. Ambil screenshot / foto bukti transfer.</p>
                  <p>3. Klik tombol <strong>Setor Uang</strong> di pojok kanan atas, lalu isikan form & bukti foto.</p>
                  <p>4. Selesai! Admin akan meninjau & mengupdate status kas Anda.</p>
                </div>
              </div>

            </div>
          </div>

          {/* COLUMN 2 (lg:col-span-4): TARGET IMPIAN BERSAMA (CRUD) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex justify-between items-center px-1 text-white">
              <span className="text-sm font-extrabold tracking-wider uppercase text-primary flex items-center gap-2">
                <TargetIcon className="w-5 h-5" />
                <span>Rencana Target ({targets.length})</span>
              </span>
              <button 
                onClick={() => setIsNewTargetOpen(true)}
                className="text-xs bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary px-3 py-1 rounded-full font-bold transition duration-200"
              >
                + Target Rencana
              </button>
            </div>

            {loading ? (
              <div className="space-y-3">
                <div className="h-28 w-full skeleton-loading rounded-[24px]" />
                <div className="h-28 w-full skeleton-loading rounded-[24px]" />
              </div>
            ) : targets.length === 0 ? (
              <div className="empty-state-card flex flex-col items-center justify-center p-8 text-center text-white/40">
                <TargetIcon className="w-12 h-12 text-primary/40 mb-3" />
                <p className="text-xs">Belum ada target khusus terdaftar.</p>
                <button 
                  onClick={() => setIsNewTargetOpen(true)} 
                  className="text-xs text-primary underline mt-2 font-bold block"
                >
                  Buat rencana target pertamamu sekarang!
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {targets.map((target) => {
                  const pct = Math.min(100, Math.round((target.saldo_terkumpul / target.target_nominal) * 100));
                  const isCompleted = target.saldo_terkumpul >= target.target_nominal;
                  
                  return (
                    <div key={target.id} className="bg-[#FFF7F5] rounded-[24px] p-5 text-zinc-800 shadow-premium relative overflow-hidden flex flex-col justify-between group">
                      
                      {isCompleted && (
                        <div className="absolute -right-10 -top-10 w-24 h-24 bg-emerald-500/10 rounded-full flex items-end justify-center pb-2 rotate-45 border border-emerald-500/20">
                          <span className="text-[8px] font-bold text-emerald-600 block uppercase tracking-widest">Achieved</span>
                        </div>
                      )}

                      <div className="flex justify-between items-start mb-2.5">
                        <div className="max-w-[78%]">
                          <h4 className="text-xs font-extrabold text-zinc-900 group-hover:text-primary transition duration-150 text-wrap leading-tight flex items-center gap-1">
                            <span>{target.nama_target}</span>
                            {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline shrink-0" />}
                          </h4>
                          <p className="text-[10px] text-zinc-500 mt-1 font-mono">
                            Saved: <strong>{rupiah(target.saldo_terkumpul)}</strong>
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-primary font-mono">{pct}%</span>
                        </div>
                      </div>

                      {/* Progress Bar inside target item */}
                      <div className="w-full h-3 bg-zinc-200 rounded-full overflow-hidden p-[1px] mb-3">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000"
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      {/* Detail footer containing target info & crud delete button */}
                      <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono pt-3 border-t border-[#FFD0C7]/20">
                        <div>
                          <span className="text-[8px] uppercase block text-zinc-400">Target Nominal</span>
                          <span className="font-extrabold text-zinc-800">{rupiah(target.target_nominal)}</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-[8px] uppercase block text-zinc-400">Deadline</span>
                            <span className="font-extrabold text-zinc-800 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-500" /> {target.deadline}
                            </span>
                          </div>

                          {/* Delete target button */}
                          <button 
                            onClick={() => handleTargetDelete(target.id, target.nama_target)}
                            className="p-1 px-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 rounded-lg transition duration-150 tooltip"
                            title="Hapus Target"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* COLUMN 3 (lg:col-span-4): ALL TRANSACTIONS HISTORY & CONTROLS (CRUD) */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="flex justify-between items-center px-1 text-white">
              <span className="text-sm font-extrabold tracking-wider uppercase text-primary flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span>Riwayat Setoran ({filteredTransactions.length})</span>
              </span>
              <button 
                onClick={() => {
                  setSavingForm(prev => ({ ...prev, target_id: targets[0]?.id || "umum" }));
                  setIsNabungOpen(true);
                }}
                className="text-xs bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary px-3 py-1 rounded-full font-bold transition duration-200"
              >
                + Setor Uang
              </button>
            </div>

            {/* Filter and live search panel */}
            <div className="bg-[#FFF7F5] rounded-3xl p-4 text-zinc-800 space-y-3 shadow-premium">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                <input 
                  type="text" 
                  placeholder="Cari nama penyetor, catatan..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-primary bg-white text-zinc-800 placeholder-zinc-400"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")} 
                    className="absolute right-3.5 top-2.5 text-zinc-400 font-bold hover:text-zinc-600 text-xs"
                  >
                    X
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[8px] text-zinc-400 block uppercase font-mono mb-1 font-extrabold">Filter Status</label>
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full text-[11px] p-2 bg-white rounded-lg border border-zinc-200 font-semibold focus:outline-none text-zinc-700"
                  >
                    <option value="all">Semua Status</option>
                    <option value="pending">Pending ⏳</option>
                    <option value="berhasil">Berhasil ✅</option>
                    <option value="gagal">Gagal ❌</option>
                  </select>
                </div>

                <div>
                  <label className="text-[8px] text-zinc-400 block uppercase font-mono mb-1 font-extrabold">Filter Target</label>
                  <select
                    value={filterTarget}
                    onChange={(e) => setFilterTarget(e.target.value)}
                    className="w-full text-[11px] p-2 bg-white rounded-lg border border-zinc-200 font-semibold focus:outline-none text-zinc-700"
                  >
                    <option value="all">Semua Alokasi</option>
                    <option value="umum">Kas Umum</option>
                    {targets.map(t => (
                      <option key={t.id} value={t.id}>{t.nama_target}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* List transactions viewbox */}
            {loading ? (
              <div className="space-y-2">
                <div className="h-16 w-full skeleton-loading rounded-2xl" />
                <div className="h-16 w-full skeleton-loading rounded-2xl" />
                <div className="h-16 w-full skeleton-loading rounded-2xl" />
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="empty-state-card flex flex-col items-center justify-center p-8 text-center text-white/40">
                <AlertCircle className="w-10 h-10 text-primary/30 mb-2" />
                <p className="text-xs">Data transaksi tidak ditemukan</p>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[600px] pr-1">
                {filteredTransactions.map((tx) => {
                  const targetAlloc = targets.find(t => t.id === tx.target_id)?.nama_target || "Tabungan Kas Umum 🪙";
                  
                  return (
                    <div key={tx.id} className="bg-[#FFF7F5] rounded-2xl p-4 text-zinc-800 shadow-sm flex flex-col gap-3 border border-transparent hover:border-primary/20 transition duration-150 duration-200 relative">
                      
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                            tx.status === "berhasil" ? "bg-emerald-100 text-emerald-700" :
                            tx.status === "gagal" ? "bg-rose-100 text-rose-700" :
                            "bg-amber-100 text-amber-700 animate-pulse"
                          }`}>
                            {tx.nama_penyetor.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-black text-zinc-900">{tx.nama_penyetor}</span>
                              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                                tx.status === "berhasil" ? "bg-emerald-100 text-emerald-700" :
                                tx.status === "gagal" ? "bg-rose-100 text-rose-700" :
                                "bg-amber-100 text-amber-700"
                              }`}>{tx.status}</span>
                            </div>
                            <span className="text-[9px] text-zinc-500 font-semibold block text-ellipsis overflow-hidden">
                              Alokasi: {targetAlloc}
                            </span>
                          </div>
                        </div>

                        {/* Transaction Nominal values */}
                        <div className="text-right shrink-0">
                          <span className="text-sm font-black text-zinc-800 block">{rupiah(tx.nominal)}</span>
                          <span className="text-[9px] text-zinc-400 block font-mono">
                            {new Date(tx.created_at).toLocaleDateString("id-ID", {month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"})}
                          </span>
                        </div>
                      </div>

                      {/* Displaying memo notes / uploaded proof receipt inside list item */}
                      {(tx.catatan || tx.bukti_transfer) && (
                        <div className="bg-zinc-100/80 rounded-xl p-2.5 text-[10px] text-zinc-600 flex flex-col gap-1.5 border border-zinc-100">
                          {tx.catatan && (
                            <p className="italic">
                              <span className="font-bold text-zinc-850 not-italic">Catatan:</span> "{tx.catatan}"
                            </p>
                          )}
                          
                          {/* Transfer receipt visual image trigger */}
                          {tx.bukti_transfer && tx.bukti_transfer !== "placeholder" && (
                            <div className="mt-1">
                              <span className="font-extrabold text-zinc-700 block mb-1">Bukti Transfer:</span>
                              <img 
                                src={tx.bukti_transfer} 
                                alt="Bukti transfer receipt" 
                                className="h-16 w-auto rounded-lg border border-zinc-300 object-cover cursor-zoom-in hover:scale-105 transition duration-150"
                                onClick={() => setZoomedImage(tx.bukti_transfer)}
                              />
                            </div>
                          )}

                          <p className="text-[9px] text-zinc-400">
                            Metode: <strong className="text-zinc-500 font-bold">{tx.metode_pembayaran}</strong>
                          </p>
                        </div>
                      )}

                      {/* Simple status display and delete action */}
                      <div className="flex gap-1.5 items-center justify-between mt-1 pt-2 border-t border-zinc-250/10">
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] text-[#FF8A7A] bg-[#FF8A7A]/10 font-extrabold uppercase px-2 py-0.5 rounded-md flex items-center gap-1">
                            Disetujui Langsung ✅
                          </span>
                        </div>

                        <div>
                          {/* Deleting the transaction record */}
                          <button 
                            type="button"
                            onClick={() => handleTransactionDelete(tx.id, tx.nama_penyetor)}
                            className="p-1 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 rounded-lg transition duration-150 flex items-center gap-1 text-[10px] font-bold cursor-pointer"
                            title="Hapus Riwayat"
                          >
                            <Trash2 className="w-3 h-3 text-rose-600" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </main>

        {/* FOOTER */}
        <footer className="mt-8 text-center text-xs text-[#FFD0C7]/40 py-6 border-t border-[#FFD0C7]/10 font-mono tracking-wide">
          <p>© 2026 NabunYuk! - Dashboard Tabungan Mandiri Terpercaya.</p>
          <p className="mt-1 text-[10px] text-[#FFD0C7]/20 uppercase">Aplikasi Pengelolaan Kas Keuangan Kelompok - Bebas Iklan & Tanpa Login</p>
        </footer>

      </div>

      {/* MODAL 1: NABUNG FORMULIR */}
      {isNabungOpen && (
        <div className="fixed inset-0 bg-[#2D1F1B]/80 backdrop-blur-md z-45 flex items-center justify-center p-4">
          <div className="bg-[#FFF7F5] rounded-3xl p-6 text-zinc-800 w-full max-w-md shadow-premium animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5 pb-2 border-b border-[#FFD0C7]/40">
              <div className="flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-primary" />
                <h3 className="text-base font-extrabold text-[#2D1F1B]">Setor Dana Baru</h3>
              </div>
              <button 
                onClick={() => setIsNabungOpen(false)} 
                className="w-7 h-7 bg-zinc-200 hover:bg-zinc-300 rounded-full flex items-center justify-center transition"
              >
                <X className="w-4 h-4 text-zinc-800" />
              </button>
            </div>

            <form onSubmit={handleNabungSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] text-zinc-500 block uppercase font-mono mb-1 font-bold">Nama Penyetor *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Bastian atau Zahra" 
                  value={savingForm.nama_penyetor}
                  onChange={(e) => setSavingForm(prev => ({ ...prev, nama_penyetor: e.target.value }))}
                  className="w-full text-xs p-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-primary bg-white text-zinc-800 font-semibold"
                />
                
                {/* Quick Selection Buttons */}
                <div className="flex gap-2 mt-1.5 items-center">
                  <span className="text-[9px] text-zinc-400 font-bold uppercase">Pilih Cepat:</span>
                  <button
                    type="button"
                    onClick={() => setSavingForm(prev => ({ ...prev, nama_penyetor: "Bastian" }))}
                    className={`px-3 py-1 text-[10px] font-extrabold rounded-lg transition-all border cursor-pointer ${
                      savingForm.nama_penyetor === "Bastian"
                        ? "bg-amber-100 text-amber-800 border-amber-300 shadow-sm"
                        : "bg-white hover:bg-zinc-50 text-zinc-600 border-zinc-200"
                    }`}
                  >
                    👦 Bastian
                  </button>
                  <button
                    type="button"
                    onClick={() => setSavingForm(prev => ({ ...prev, nama_penyetor: "Zahra" }))}
                    className={`px-3 py-1 text-[10px] font-extrabold rounded-lg transition-all border cursor-pointer ${
                      savingForm.nama_penyetor === "Zahra"
                        ? "bg-pink-100 text-pink-800 border-pink-300 shadow-sm"
                        : "bg-white hover:bg-zinc-50 text-zinc-600 border-zinc-200"
                    }`}
                  >
                    👧 Zahra
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-zinc-500 block uppercase font-mono mb-1 font-bold">Nominal Transfer (Rp) *</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    placeholder="e.g. 50000" 
                    value={savingForm.nominal}
                    onChange={(e) => setSavingForm(prev => ({ ...prev, nominal: e.target.value }))}
                    className="w-full text-xs p-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-primary bg-white text-zinc-800 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-500 block uppercase font-mono mb-1 font-bold">Metode Pembayaran</label>
                  <select 
                    value={savingForm.metode_pembayaran}
                    onChange={(e) => setSavingForm(prev => ({ ...prev, metode_pembayaran: e.target.value }))}
                    className="w-full text-xs p-3 bg-white rounded-xl border border-zinc-200 focus:outline-none text-zinc-700 font-bold"
                  >
                    <option value="QRIS">QRIS Instan</option>
                    <option value="Transfer Bank Jago">Bank Jago</option>
                    <option value="Transfer Bank Mandiri">Bank Mandiri</option>
                    <option value="E-Wallet (OVO/GoPay)">E-Wallet</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 block uppercase font-mono mb-1 font-bold">Alokasikan ke Rencana Target</label>
                <select 
                  value={savingForm.target_id}
                  onChange={(e) => setSavingForm(prev => ({ ...prev, target_id: e.target.value }))}
                  className="w-full text-xs p-3 bg-white rounded-xl border border-zinc-200 focus:outline-none text-zinc-700 font-bold"
                >
                  <option value="umum">Tabungan Kas Umum (Bebas) 🪙</option>
                  {targets.map(t => (
                    <option key={t.id} value={t.id}>{t.nama_target}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 block uppercase font-mono mb-1 font-bold">Catatan Pendorong Semangat</label>
                <textarea 
                  rows={2}
                  placeholder="e.g. Nabung dicicil demi impian liburan" 
                  value={savingForm.catatan}
                  onChange={(e) => setSavingForm(prev => ({ ...prev, catatan: e.target.value }))}
                  className="w-full text-xs p-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-primary bg-white text-zinc-800"
                />
              </div>

              {/* Upload screen attachment proof */}
              <div>
                <label className="text-[10px] text-zinc-500 block uppercase font-mono mb-1.5 font-bold">Bukti Transfer (Dukung Unggah / Generator Bukti Instan)</label>
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center transition flex flex-col items-center justify-center gap-1.5 bg-white ${
                    isDragging ? "border-primary bg-primary/5" : "border-zinc-300 hover:border-primary"
                  }`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden" 
                  />
                  
                  {savingForm.bukti_transfer ? (
                    <div className="flex items-center gap-3 w-full justify-between px-2">
                      <div className="flex items-center gap-2">
                        <img 
                          src={savingForm.bukti_transfer} 
                          alt="Transfer Attachment upload view" 
                          className="w-10 h-10 rounded-lg object-cover border border-[#FF8A7A]/40"
                        />
                        <div className="flex flex-col items-start">
                          <span className="text-[10px] text-zinc-650 font-bold truncate max-w-[125px]">Gambar Terlampir 📸</span>
                          <span className="text-[8px] text-emerald-600 font-extrabold uppercase tracking-wider bg-emerald-50 px-1.5 py-0.5 rounded-md mt-0.5">Berhasil Dimuat ✅</span>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSavingForm(prev => ({ ...prev, bukti_transfer: "" }));
                        }}
                        className="text-[10px] bg-rose-500 text-white px-2.5 py-1 rounded-lg hover:bg-rose-600 transition font-bold"
                      >
                        Hapus
                      </button>
                    </div>
                  ) : (
                    <div className="py-2.5 flex flex-col items-center justify-center w-full">
                      <ImageIcon className="w-7 h-7 text-zinc-400 mb-1" />
                      <span className="text-[11px] font-bold text-zinc-650">Butuh Bukti Transfer?</span>
                      <p className="text-[9px] text-zinc-400 mb-3 text-center px-4 leading-normal">Buat bukti transfer acak otomatis langsung terisi, atau pilih berkas dari perangkat Anda</p>
                      
                      <div className="flex gap-2 w-full justify-center px-1">
                        <button
                          type="button"
                          onClick={() => {
                            const wallets: ("BCA" | "GOPAY" | "MANDIRI")[] = ["BCA", "GOPAY", "MANDIRI"];
                            const randomWall = wallets[Math.floor(Math.random() * wallets.length)];
                            handleAutoProvideReceipt(randomWall);
                          }}
                          className="flex-1 py-2 px-2.5 bg-[#FF8A7A]/10 text-primary hover:bg-[#FF8A7A]/20 active:scale-95 border border-primary/20 rounded-xl text-[10px] font-black uppercase transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          ⚡ Bukti Otomatis
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex-1 py-2 px-2.5 bg-zinc-50 hover:bg-zinc-100 active:scale-95 border border-zinc-200 rounded-xl text-[10px] font-black uppercase text-zinc-600 transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          📁 Dari Perangkat
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit triggers buttons */}
              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsNabungOpen(false)}
                  className="flex-1 border border-zinc-200 text-zinc-500 font-semibold p-3.5 rounded-2xl text-xs hover:bg-zinc-50 transition"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-primary text-zinc-900 font-black p-3.5 rounded-2xl text-xs hover:bg-primary/95 transition shadow-glow"
                >
                  Kirim Setoran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: NEW TARGET FORM */}
      {isNewTargetOpen && (
        <div className="fixed inset-0 bg-[#2D1F1B]/90 backdrop-blur-md z-45 flex items-center justify-center p-4">
          <div className="bg-[#FFF7F5] rounded-3xl p-6 text-zinc-800 w-full max-w-md shadow-premium animate-scale-up">
            <div className="flex justify-between items-center mb-5 pb-2 border-b border-[#FFD0C7]/40">
              <div className="flex items-center gap-2">
                <TargetIcon className="w-5 h-5 text-primary" />
                <h3 className="text-base font-extrabold text-[#2D1F1B]">Daftarkan Impian Baru</h3>
              </div>
              <button 
                onClick={() => setIsNewTargetOpen(false)} 
                className="w-7 h-7 bg-zinc-200 hover:bg-zinc-300 rounded-full flex items-center justify-center transition"
              >
                <X className="w-4 h-4 text-zinc-800" />
              </button>
            </div>

            <form onSubmit={handleTargetSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] text-zinc-500 block uppercase font-mono mb-1 font-bold">Nama Rencana/Target Baru *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Kas Liburan ke Gunung Bromo 🌋" 
                  value={targetForm.nama_target}
                  onChange={(e) => setTargetForm(prev => ({ ...prev, nama_target: e.target.value }))}
                  className="w-full text-xs p-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-primary bg-white text-zinc-800 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-zinc-500 block uppercase font-mono mb-1.5 font-bold">Nominal Target (Rp) *</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    placeholder="e.g. 1500000" 
                    value={targetForm.target_nominal}
                    onChange={(e) => setTargetForm(prev => ({ ...prev, target_nominal: e.target.value }))}
                    className="w-full text-xs p-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-primary bg-white text-zinc-800 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-500 block uppercase font-mono mb-1.5 font-bold">Tanggal Deadline</label>
                  <input 
                    type="date" 
                    value={targetForm.deadline}
                    onChange={(e) => setTargetForm(prev => ({ ...prev, deadline: e.target.value }))}
                    className="w-full text-xs p-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-primary bg-white text-zinc-800 font-semibold"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsNewTargetOpen(false)}
                  className="flex-1 border border-zinc-200 text-zinc-500 font-semibold p-3.5 rounded-2xl text-xs hover:bg-zinc-50 transition"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-zinc-900 border border-transparent text-white font-extrabold p-3.5 rounded-2xl text-xs hover:bg-neutral-800 transition shadow-glow"
                >
                  Simpan Impian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: QRIS SPECIFIC FULLSCREEN MODAL */}
      {isQrisZoomOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col justify-center items-center p-4 backdrop-blur-md">
          <button 
            onClick={() => setIsQrisZoomOpen(false)}
            className="absolute top-6 right-6 w-11 h-11 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition duration-150 transform hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="bg-[#FFF7F5] rounded-[36px] p-8 text-zinc-800 w-full max-w-sm text-center shadow-2xl scale-100 animate-scale">
            <span className="text-[10px] font-mono tracking-widest text-[#FF8A7A] font-extrabold">QRIS FINTECH INDONESIA</span>
            <h4 className="text-sm font-bold text-slate-800 mt-1 mb-5">QRIS MERCHANT KAS BERSAMA</h4>
            
            <div className="w-64 h-64 bg-white p-3.5 rounded-3xl mx-auto shadow-inner border border-zinc-200 flex items-center justify-center relative overflow-hidden">
              {qrisImage ? (
                <img 
                  src={qrisImage} 
                  alt="Kode QRIS Kustom Zoom" 
                  className="max-h-full max-w-full rounded-2xl object-contain"
                />
              ) : (
                <div className="w-full h-full bg-white flex flex-col items-center justify-center p-1">
                  <QRCode
                    id="qris-vector-svg-zoom"
                    value={DEFAULT_QRIS_PAYLOAD}
                    size={220}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    viewBox="0 0 256 256"
                  />
                </div>
              )}
            </div>

            <p className="text-[11px] text-zinc-500 mt-5 leading-relaxed font-semibold">
              Scan kode QRIS ini menggunakan super-app perbankan / pembayaran kesayangan Anda. Dana langsung masuk ke kas NabunYuk bersama.
            </p>
          </div>
        </div>
      )}

      {/* FIXED TOAST NOTIFICATION CONTAINER */}
      <div className="fixed top-6 right-6 z-50 pointer-events-none space-y-3 w-full max-w-xs md:max-w-sm">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className="p-4 rounded-2xl shadow-premium border text-zinc-800 bg-[#FFF7F5] pointer-events-auto flex items-start gap-3 text-xs animate-slide-in-right justify-between border-primary/20 backdrop-blur-md"
          >
            <div className="flex items-start gap-2.5 max-w-[88%]">
              {toast.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
              {toast.type === "error" && <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
              {toast.type === "info" && <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />}
              <p className="font-extrabold text-zinc-800 leading-tight">{toast.message}</p>
            </div>
            <button 
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="text-zinc-450 font-bold hover:text-black shrink-0"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      {/* CUSTOM CONFIRMATION MODAL */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-[#2D1F1B]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFF7F5] rounded-3xl p-6 text-zinc-800 w-full max-w-sm shadow-premium animate-scale-up border border-[#FFD0C7]/20">
            <div className="flex items-center gap-3 mb-4 text-[#FF8A7A]">
              <AlertCircle className="w-6 h-6 shrink-0 text-[#FF8A7A]" />
              <h3 className="text-base font-extrabold text-[#2D1F1B]">{confirmModal.title}</h3>
            </div>
            <p className="text-xs text-zinc-650 leading-relaxed font-semibold mb-6">
              {confirmModal.message}
            </p>
            <div className="flex gap-2.5">
              <button 
                type="button" 
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="flex-1 border border-zinc-200 text-zinc-550 bg-zinc-50 hover:bg-zinc-100 font-extrabold py-3 rounded-2xl text-xs transition duration-150"
              >
                Batal
              </button>
              <button 
                type="button"
                onClick={confirmModal.onConfirm}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-3 rounded-2xl text-xs transition duration-150 shadow-glow"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX FOR TRANSFERS IMAGE PROOF */}
      {zoomedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col justify-center items-center p-4 backdrop-blur-md">
          <button 
            onClick={() => setZoomedImage(null)}
            className="absolute top-6 right-6 w-11 h-11 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition duration-150 transform hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="max-w-xl w-full flex flex-col items-center gap-3 animate-scale px-4">
            <img 
              src={zoomedImage} 
              alt="Bukti Transfer Zoomed" 
              className="max-h-[80vh] max-w-full rounded-2xl border-2 border-white/20 shadow-2xl object-contain bg-zinc-950"
            />
            <span className="text-xs text-white/60 font-mono text-center">Ketuk tombol silang atau klik di luar untuk menutup</span>
          </div>
        </div>
      )}

    </div>
  );
}