<?php
/**
 * NabunYuk - Root App Entrypoint (PHP Native Model)
 */

require_once 'config/database.php';

// 1. Fetch target tabungan lists
try {
    $stmt = $pdo->query("SELECT * FROM target_tabungan ORDER BY created_at DESC");
    $targets = $stmt->fetchAll();
} catch (PDOException $e) {
    $targets = [];
}

// 2. Fetch all transactions
try {
    $stmt = $pdo->query("SELECT t.*, g.nama_target FROM transaksi t LEFT JOIN target_tabungan g ON t.target_id = g.id ORDER BY t.created_at DESC");
    $transactions = $stmt->fetchAll();
} catch (PDOException $e) {
    $transactions = [];
}

// 3. Calculate total savings collected from success transactions
$total_saving = 0;
foreach ($transactions as $tx) {
    if ($tx['status'] === 'berhasil') {
        $total_saving += $tx['nominal'];
    }
}

// 4. Calculate stats
$total_tx_count = count($transactions);
$pending_tx_count = 0;
foreach ($transactions as $tx) {
    if ($tx['status'] === 'pending') {
        $pending_tx_count++;
    }
}

function rupiah($value) {
    return 'Rp' . number_format($value, 0, ',', '.');
}

include 'includes/header.php';
?>

<!-- ==========================================
     PAGE VIEW 1: OVERVIEW DASHBOARD
     ========================================== -->
<div id="tab-overview" class="tab-pane active">
    <!-- Balance Card -->
    <div class="overview-balance-card">
        <span class="card-label">TOTAL KAS TABUNGAN BERSAMA</span>
        <h2 class="card-balance"><?php echo rupiah($total_saving); ?></h2>
        
        <div class="card-weekly-stat">
            <svg class="stat-growth-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            <span>Bertumbuh secara real-time</span>
        </div>

        <div class="card-grid-info">
            <div class="info-bubble">
                <span class="bubble-title">Target</span>
                <span class="bubble-value"><?php echo count($targets); ?> Impian</span>
            </div>
            <div class="info-bubble">
                <span class="bubble-title">Penyetor</span>
                <span class="bubble-value"><?php echo $total_tx_count; ?> Kali</span>
            </div>
            <div class="info-bubble font-warning">
                <span class="bubble-title">Antrian</span>
                <span class="bubble-value"><?php echo $pending_tx_count; ?> Pending</span>
            </div>
        </div>
    </div>

    <!-- QRIS Quick Launcher -->
    <div class="quick-launcher-bar" onclick="navigateToTab('qris')">
        <div class="launcher-left">
            <div class="icon-launcher">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1"/><path d="M18 8h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4"/></svg>
            </div>
            <div>
                <h4>Transfer Instan via QRIS</h4>
                <p>Simpan otomatis ke kas bersama tanpa akun</p>
            </div>
        </div>
        <div class="launcher-right">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
    </div>

    <!-- Active Targets Column -->
    <div class="section-container">
        <div class="section-title-wrap">
            <h3 class="section-title">TARGET IMPIAN KAMI 🎯</h3>
            <button class="section-link-btn" onclick="navigateToTab('target')">Lihat Semua</button>
        </div>

        <div class="target-cards-carousel">
            <?php if (empty($targets)): ?>
                <div class="empty-state-placeholder">
                    <p>Mulai dengan membuat target tabungan baru!</p>
                </div>
            <?php else: ?>
                <?php foreach (array_slice($targets, 0, 2) as $target): 
                    $pct = $target['target_nominal'] > 0 ? min(100, round(($target['saldo_terkumpul'] / $target['target_nominal']) * 100)) : 0;
                    $sisa = max(0, $target['target_nominal'] - $target['saldo_terkumpul']);
                ?>
                    <div class="premium-target-card">
                        <div class="target-card-top">
                            <div>
                                <h4 class="target-card-name"><?php echo htmlspecialchars($target['nama_target']); ?></h4>
                                <p class="target-card-remain">Sisa <?php echo rupiah($sisa); ?></p>
                            </div>
                            <span class="pct-badge"><?php echo $pct; ?>%</span>
                        </div>
                        <div class="target-progress-outline">
                            <div class="target-progress-fill" style="width: <?php echo $pct; ?>%"></div>
                        </div>
                        <div class="target-card-footer">
                            <span>Goal: <?php echo rupiah($target['target_nominal']); ?></span>
                            <span>Deadline: <?php echo $target['deadline']; ?></span>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>

    <!-- Recent Transactions List -->
    <div class="section-container">
        <div class="section-title-wrap">
            <h3 class="section-title">RIWAYAT PENYETORAN TERBARU 🕒</h3>
            <button class="section-link-btn" onclick="navigateToTab('history')">Semua Riwayat</button>
        </div>

        <div class="recent-list-group">
            <?php if (empty($transactions)): ?>
                <div class="empty-state-placeholder">
                    <p>Belum ada aktivitas menabung.</p>
                </div>
            <?php else: ?>
                <?php foreach (array_slice($transactions, 0, 3) as $tx): ?>
                    <div class="history-item">
                        <div class="item-left">
                            <div class="item-avatar-box <?php echo $tx['status']; ?>">
                                <?php echo strtoupper(substr($tx['nama_penyetor'], 0, 1)); ?>
                            </div>
                            <div>
                                <div class="item-top-row">
                                    <h4 class="item-sender"><?php echo htmlspecialchars($tx['nama_penyetor']); ?></h4>
                                    <span class="status-pill-sub <?php echo $tx['status']; ?>"><?php echo $tx['status']; ?></span>
                                </div>
                                <p class="item-memo"><?php echo htmlspecialchars($tx['catatan'] ? $tx['catatan'] : 'Menabung berkah'); ?></p>
                                <p class="item-meta"><?php echo htmlspecialchars($tx['metode_pembayaran']); ?></p>
                            </div>
                        </div>
                        <div class="item-right">
                            <span class="item-amount"><?php echo rupiah($tx['nominal']); ?></span>
                            <span class="item-date"><?php echo date('d M', strtotime($tx['created_at'])); ?></span>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>
</div>

<!-- ==========================================
     PAGE VIEW 2: ALL TARGETS LIST
     ========================================== -->
<div id="tab-target" class="tab-pane">
    <div class="view-header-title">
        <div>
            <h2>Target Tabungan</h2>
            <p>Daftar impian tabungan bersama kami</p>
        </div>
        <button class="btn-create-target-trigger" id="open-target-btn">Buat Baru +</button>
    </div>

    <div class="targets-grid-wrapper">
        <?php if (empty($targets)): ?>
            <div class="empty-state-placeholder larger">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                <p>Belum ada target yang dibuat.</p>
                <button class="btn-create-target-trigger inline" id="init-first-target-btn">Buat Target Pertama</button>
            </div>
        <?php else: ?>
            <?php foreach ($targets as $target): 
                $pct = $target['target_nominal'] > 0 ? min(100, round(($target['saldo_terkumpul'] / $target['target_nominal']) * 100)) : 0;
                $isCompleted = $target['saldo_terkumpul'] >= $target['target_nominal'];
            ?>
                <div class="premium-target-card block-variant <?php echo $isCompleted ? 'completed' : ''; ?>">
                    <div class="target-card-topAdjust">
                        <div>
                            <h3 class="target-card-name"><?php echo htmlspecialchars($target['nama_target']); ?> <?php echo $isCompleted ? '✅' : ''; ?></h3>
                            <p class="target-card-sub-stats">Terkumpul: <?php echo rupiah($target['saldo_terkumpul']); ?></p>
                        </div>
                        <span class="pct-badge-highlight"><?php echo $pct; ?>%</span>
                    </div>

                    <div class="target-progress-outline block-variant">
                        <div class="target-progress-fill" style="width: <?php echo $pct; ?>%"></div>
                    </div>

                    <div class="target-footer-stats-wrap">
                        <div class="stat-group-item">
                            <span class="stat-glbl">Goal Rencana</span>
                            <span class="stat-val"><?php echo rupiah($target['target_nominal']); ?></span>
                        </div>
                        <div class="stat-group-item text-right">
                            <span class="stat-glbl">Sisa Hari</span>
                            <span class="stat-val date-val"><?php echo $target['deadline']; ?></span>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
</div>

<!-- ==========================================
     PAGE VIEW 3: QRIS SECTION KAS
     ========================================= -->
<div id="tab-qris" class="tab-pane">
    <div class="view-header-title text-center">
        <h2>Metode Transfer & QRIS</h2>
        <p>Silakan scan QRIS atau copy rekening bank kita untuk menabung</p>
    </div>

    <div class="qris-holder-card font-dark">
        <div class="merchant-tagbar">
            <span>MERCHANT: NABUNYUK BERSAMA</span>
            <span>MID-9283749</span>
        </div>

        <div class="qris-brand-titles">
            <h3>GPN QRIS LINTAS DIGITAL</h3>
            <p>GoPay, OVO, Dana, LinkAja & Mobile Banking Se-Indonesia</p>
        </div>

        <div class="qris-preview-container-box">
            <button class="maximize-trigger" id="btn-zoom-qris-popup">🔎 Maximize</button>
            <div class="qris-pattern-core-mock">
                <!-- Custom CSS Simulated authentic QR code -->
                <div class="simulated-qr">
                    <div class="center-app-badge">💰</div>
                </div>
            </div>
        </div>

        <div class="action-buttons-qris-wrap">
            <button class="btn-qris-download" onclick="triggerDownloadSim()">
                <span>Download QRIS</span>
            </button>
            <button class="btn-qris-copy" onclick="triggerCopyRekening('0022-91823719-218')">
                <span>Copy No. Rekening</span>
            </button>
        </div>

        <div class="qris-disclaimer-box">
            <strong>⚠️ LANGKAH PENCEGAHAN</strong>
            <p>Seusai merampungkan pembayaran sukses Anda, tolong jepret tangkapan layar (screenshot) sebagai bukti transfer, kemudian pencet tombol + Nabung di atas untuk mencatatkannya.</p>
        </div>
    </div>
</div>

<!-- ==========================================
     PAGE VIEW 4: TRANSACTIONS HISTORY & FILTER LOG
     ========================================== -->
<div id="tab-history" class="tab-pane">
    <div class="view-header-title">
        <h2>Riwayat Setoran</h2>
        <p>Aktivitas setoran masuk dan konfirmasi</p>
    </div>

    <!-- Interactive Filters -->
    <div class="interactive-filter-card">
        <input type="text" id="filter-search-input" placeholder="Cari nama penyetor..." class="styled-search-input">
        
        <div class="form-row-2">
            <select id="filter-status-select" class="styled-select-input">
                <option value="all">Semua Status</option>
                <option value="pending">Pending ⏳</option>
                <option value="berhasil">Berhasil ✅</option>
                <option value="gagal">Gagal ❌</option>
            </select>
            <select id="filter-target-select" class="styled-select-input">
                <option value="all">Semua Alokasi</option>
                <option value="umum">Kas Umum</option>
                <?php foreach ($targets as $target): ?>
                    <option value="<?php echo $target['id']; ?>"><?php echo htmlspecialchars($target['nama_target']); ?></option>
                <?php endforeach; ?>
            </select>
        </div>
    </div>

    <!-- Full Transactions List -->
    <div class="history-transactions-list-wrap" id="transactions-log-container">
        <?php if (empty($transactions)): ?>
            <div class="empty-state-placeholder">
                <p>Belum ada catatan setoran masuk.</p>
            </div>
        <?php else: ?>
            <?php foreach ($transactions as $tx): ?>
                <div class="history-item block-variant flex-column filterable-tx-item" 
                     data-sender="<?php echo strtolower(htmlspecialchars($tx['nama_penyetor'])); ?>"
                     data-status="<?php echo $tx['status']; ?>"
                     data-target-id="<?php echo $tx['target_id'] ? $tx['target_id'] : 'umum'; ?>">
                    
                    <div class="history-item-top-row">
                        <div class="item-left flex-row">
                            <div class="item-avatar-box <?php echo $tx['status']; ?>">
                                <?php echo strtoupper(substr($tx['nama_penyetor'], 0, 1)); ?>
                            </div>
                            <div>
                                <div class="item-top-row flex-row-align">
                                    <h4 class="item-sender font-semibold"><?php echo htmlspecialchars($tx['nama_penyetor']); ?></h4>
                                    <span class="status-pill-sub <?php echo $tx['status']; ?>"><?php echo $tx['status']; ?></span>
                                </div>
                                <p class="item-alokasi-text">Alokasi: <?php echo htmlspecialchars($tx['nama_target'] ? $tx['nama_target'] : 'Tabungan Kas Umum 🪙'); ?></p>
                            </div>
                        </div>
                        <div class="item-right text-right">
                            <span class="item-amount"><?php echo rupiah($tx['nominal']); ?></span>
                            <span class="item-date"><?php echo date('d M Y - H:i', strtotime($tx['created_at'])); ?></span>
                        </div>
                    </div>

                    <!-- Memo & Proof Attachments inside sub-collapsed block -->
                    <?php if (!empty($tx['catatan']) || !empty($tx['bukti_transfer'])): ?>
                        <div class="history-item-collapsed">
                            <?php if (!empty($tx['catatan'])): ?>
                                <p class="memo-p">"<?php echo htmlspecialchars($tx['catatan']); ?>"</p>
                            <?php endif; ?>

                            <?php if (!empty($tx['bukti_transfer'])): ?>
                                <div class="bukti-thumbnail-wrap">
                                    <strong>Struk Transfer:</strong>
                                    <!-- Production path fallback -->
                                    <img src="<?php echo htmlspecialchars($tx['bukti_transfer']); ?>" alt="Struk Transfer" class="receipt-thumb">
                                </div>
                            <?php endif; ?>
                        </div>
                    <?php endif; ?>

                    <!-- Demo Administration Action Tools directly inside HTML for complete fidelity -->
                    <div class="demo-admin-actions-bar">
                        <span class="demo-txt-meta">Demo Admin Panel:</span>
                        <a href="pages/transaksi.php?action=status&id=<?php echo $tx['id']; ?>&status=berhasil" class="btn-stat-setuju">Setuju</a>
                        <a href="pages/transaksi.php?action=status&id=<?php echo $tx['id']; ?>&status=gagal" class="btn-stat-tolak">Tolak</a>
                        <a href="pages/transaksi.php?action=status&id=<?php echo $tx['id']; ?>&status=pending" class="btn-stat-ulang">Ulang</a>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
</div>

<?php
include 'includes/footer.php';
?>
