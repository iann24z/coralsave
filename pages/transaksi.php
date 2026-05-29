<?php
/**
 * NabunYuk - Transaksi Controller (PHP Native)
 */

require_once '../config/database.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

// Create Upload directory safely
$upload_dir = '../assets/upload/';
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

if ($action === 'create') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $nama_penyetor = isset($_POST['nama_penyetor']) ? trim($_POST['nama_penyetor']) : '';
        $nominal = isset($_POST['nominal']) ? floatval($_POST['nominal']) : 0;
        $metode_pembayaran = isset($_POST['metode_pembayaran']) ? trim($_POST['metode_pembayaran']) : 'QRIS';
        $catatan = isset($_POST['catatan']) ? trim($_POST['catatan']) : '';
        $target_id = isset($_POST['target_id']) && !empty($_POST['target_id']) ? intval($_POST['target_id']) : null;

        // Secure Upload Image Bukti
        $bukti_transfer_path = null;
        if (isset($_FILES['bukti_transfer']) && $_FILES['bukti_transfer']['error'] === UPLOAD_ERR_OK) {
            $file_tmp = $_FILES['bukti_transfer']['tmp_name'];
            $file_name = $_FILES['bukti_transfer']['name'];
            $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));

            $allowed_exts = ['jpg', 'jpeg', 'png', 'webp'];
            if (in_array($file_ext, $allowed_exts)) {
                // Unique filename to prevent overwrite vulnerability
                $new_file_name = 'bukti_' . time() . '_' . uniqid() . '.' . $file_ext;
                $dest_path = $upload_dir . $new_file_name;
                
                if (move_uploaded_file($file_tmp, $dest_path)) {
                    $bukti_transfer_path = 'assets/upload/' . $new_file_name;
                }
            }
        }

        if (!empty($nama_penyetor) && $nominal > 0) {
            try {
                $stmt = $pdo->prepare("INSERT INTO transaksi (nama_penyetor, nominal, metode_pembayaran, catatan, bukti_transfer, status, target_id) VALUES (?, ?, ?, ?, ?, 'pending', ?)");
                $stmt->execute([$nama_penyetor, $nominal, $metode_pembayaran, $catatan, $bukti_transfer_path, $target_id]);
                
                // Redirect back with success trigger
                header("Location: ../index.php?status=success_saving");
                exit;
            } catch (PDOException $e) {
                die("Gagal mencatat tabungan: " . $e->getMessage());
            }
        } else {
            header("Location: ../index.php?status=invalid_input");
            exit;
        }
    }
}

// Admin mock status switcher: approved/rejected/retry
if ($action === 'status') {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    $new_status = isset($_GET['status']) ? trim($_GET['status']) : '';

    if ($id > 0 && in_array($new_status, ['pending', 'berhasil', 'gagal'])) {
        try {
            // First select current transaction to analyze change effect
            $stmt = $pdo->prepare("SELECT * FROM transaksi WHERE id = ?");
            $stmt->execute([$id]);
            $tx = $stmt->fetch();

            if ($tx) {
                $old_status = $tx['status'];
                $nominal = $tx['nominal'];
                $target_id = $tx['target_id'];

                // Update transaction status
                $update_stmt = $pdo->prepare("UPDATE transaksi SET status = ? WHERE id = ?");
                $update_stmt->execute([$new_status, $id]);

                // Recalculate related target subtotal if target exists
                if ($target_id) {
                    if ($new_status === 'berhasil' && $old_status !== 'berhasil') {
                        // Add balance
                        $up_target_stmt = $pdo->prepare("UPDATE target_tabungan SET saldo_terkumpul = saldo_terkumpul + ? WHERE id = ?");
                        $up_target_stmt->execute([$nominal, $target_id]);
                    } elseif ($new_status !== 'berhasil' && $old_status === 'berhasil') {
                        // Subtract balance (rollback)
                        $up_target_stmt = $pdo->prepare("UPDATE target_tabungan SET saldo_terkumpul = GREATEST(0, saldo_terkumpul - ?) WHERE id = ?");
                        $up_target_stmt->execute([$nominal, $target_id]);
                    }
                }

                header("Location: ../index.php?status=status_updated");
                exit;
            }
        } catch (PDOException $e) {
            die("Gagal memperbarui status: " . $e->getMessage());
        }
    }
}

header("Location: ../index.php");
exit;
?>
