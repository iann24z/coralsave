-- SQL Database Schema for NabunYuk
-- Database Name: tabungan_app

CREATE DATABASE IF NOT EXISTS tabungan_app;
USE tabungan_app;

-- 1. Table: target_tabungan
CREATE TABLE IF NOT EXISTS target_tabungan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_target VARCHAR(100) NOT NULL,
  target_nominal DECIMAL(15, 2) NOT NULL,
  saldo_terkumpul DECIMAL(15, 2) DEFAULT 0.00,
  deadline DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Table: transaksi
CREATE TABLE IF NOT EXISTS transaksi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_penyetor VARCHAR(100) NOT NULL,
  nominal DECIMAL(15, 2) NOT NULL,
  metode_pembayaran VARCHAR(50) NOT NULL,
  catatan TEXT,
  bukti_transfer VARCHAR(255) DEFAULT NULL,
  status ENUM('pending', 'berhasil', 'gagal') DEFAULT 'pending',
  target_id INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (target_id) REFERENCES target_tabungan(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed initial records matching dummy/reference values
INSERT INTO target_tabungan (nama_target, target_nominal, saldo_terkumpul, deadline) VALUES
('Liburan Bali 🏖️', 10000000.00, 4250000.00, '2026-12-31'),
('Beli iPhone 17 Pro 📱', 22000000.00, 7500000.00, '2026-10-15'),
('Kado Ultah Ibu ❤️', 1500000.00, 1200000.00, '2026-06-25');

INSERT INTO transaksi (nama_penyetor, nominal, metode_pembayaran, catatan, status, target_id) VALUES
('Budi Santoso', 1500000.00, 'QRIS', 'Nabung bulanan untuk liburan', 'berhasil', 1),
('Siti Rahma', 2500000.00, 'Transfer Bank BCA', 'Sembari nunggu bonus kerjaan', 'berhasil', 2),
('Andi Saputra', 300000.00, 'QRIS', 'Nabung kado ultah Ibu tercinta', 'berhasil', 3),
('Rian Maulana', 500000.00, 'QRIS', 'Bismillah semoga bisa liburan bareng', 'pending', 1);
