<?php
/**
 * NabunYuk - Target Controller (PHP Native)
 */

require_once '../config/database.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($action === 'create') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $nama_target = isset($_POST['nama_target']) ? trim($_POST['nama_target']) : '';
        $target_nominal = isset($_POST['target_nominal']) ? floatval($_POST['target_nominal']) : 0;
        $deadline = isset($_POST['deadline']) ? trim($_POST['deadline']) : '';

        if (!empty($nama_target) && $target_nominal > 0) {
            try {
                $stmt = $pdo->prepare("INSERT INTO target_tabungan (nama_target, target_nominal, saldo_terkumpul, deadline) VALUES (?, ?, 0, ?)");
                $stmt->execute([$nama_target, $target_nominal, $deadline]);

                header("Location: ../index.php?status=success_target");
                exit;
            } catch (PDOException $e) {
                die("Gagal menambahkan target impian: " . $e->getMessage());
            }
        } else {
            header("Location: ../index.php?status=invalid_target");
            exit;
        }
    }
}

header("Location: ../index.php");
exit;
?>
