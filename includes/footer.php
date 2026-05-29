        </main> <!-- end content-viewport -->

        <!-- Bottom Mobile Bar Navigation -->
        <nav class="bottom-nav">
            <button class="nav-item active" data-tab="overview">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                <span>Dashboard</span>
            </button>
            <button class="nav-item" data-tab="target">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                <span>Target</span>
            </button>
            
            <button class="nav-item floating-action-btn" data-tab="qris">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><circle cx="12" cy="12" r="1"/></svg>
            </button>
            
            <button class="nav-item" data-tab="qris">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                <span>QRIS Kas</span>
            </button>
            <button class="nav-item" data-tab="history">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>Riwayat</span>
            </button>
        </nav>

        <!-- Floating Toast System overlay -->
        <div id="toast-wrapper" class="toast-overlay"></div>

    </div> <!-- end phone-mockup-frame -->

    <!-- Modal Form Nabung -->
    <div id="modal-nabung" class="modal-backdrop">
        <div class="modal-sheet">
            <div class="modal-header">
                <div class="modal-title-box">
                    <svg class="modal-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                    <h3>Form Setor Tabungan</h3>
                </div>
                <button type="button" class="modal-close-btn" id="close-modal-nabung">&times;</button>
            </div>
            
            <form action="pages/transaksi.php?action=create" method="POST" enctype="multipart/form-data" class="form-grid">
                <div class="form-group">
                    <label>Nama Penyetor *</label>
                    <input type="text" name="nama_penyetor" required placeholder="Masukkan nama lengkap">
                </div>
                
                <div class="form-row-2">
                    <div class="form-group">
                        <label>Nominal Tabungan *</label>
                        <input type="number" min="1000" name="nominal" required placeholder="e.g. 50000">
                    </div>
                    <div class="form-group">
                        <label>Metode Pembayaran</label>
                        <select name="metode_pembayaran">
                            <option value="QRIS">QRIS Instan</option>
                            <option value="Transfer Bank BCA">Bank BCA</option>
                            <option value="Transfer Bank Mandiri">Bank Mandiri</option>
                            <option value="E-Wallet (OVO/GoPay)">E-Wallet</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label>Alokasi Target Tabungan</label>
                    <select name="target_id" id="form-select-targets">
                        <option value="">Tabungan Kas Umum (Bebas) 🪙</option>
                        <!-- Dynamic generated in php -->
                    </select>
                </div>

                <div class="form-group">
                    <label>Catatan Penyemangat</label>
                    <textarea name="catatan" rows="2" placeholder="Tulis catatan penyemangat nabung..."></textarea>
                </div>

                <div class="form-group">
                    <label>Upload Bukti Transfer</label>
                    <div class="file-uploader" id="qris-uploader-trigger">
                        <input type="file" name="bukti_transfer" accept="image/*" class="file-input-hidden" id="file-bukti-transfer">
                        <div class="upload-placeholder">
                            <svg class="upl-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                            <span class="upload-text">Klik atau seret struk transfer ke sini</span>
                            <span class="upload-hint">Maks. 8MB (Gambar JPG/PNG)</span>
                        </div>
                    </div>
                    <div id="image-preview-container" class="image-preview-box hidden"></div>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-cancel" id="cancel-modal-nabung">Batal</button>
                    <button type="submit" class="btn-submit">Kirim Setoran</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal Target Baru -->
    <div id="modal-target" class="modal-backdrop">
        <div class="modal-sheet">
            <div class="modal-header">
                <div class="modal-title-box">
                    <svg class="modal-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                    <h3>Wujudkan Impian Baru</h3>
                </div>
                <button type="button" class="modal-close-btn" id="close-modal-target">&times;</button>
            </div>
            
            <form action="pages/target.php?action=create" method="POST" class="form-grid">
                <div class="form-group">
                    <label>Nama Rencana / Target Baru *</label>
                    <input type="text" name="nama_target" required placeholder="e.g. Liburan Bali 🏖️">
                </div>
                
                <div class="form-row-2">
                    <div class="form-group">
                        <label>Nominal Target (Rupiah) *</label>
                        <input type="number" min="1000" name="target_nominal" required placeholder="e.g. 10000000">
                    </div>
                    <div class="form-group">
                        <label>Estimasi Deadline</label>
                        <input type="date" name="deadline" required>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-cancel" id="cancel-modal-target">Batal</button>
                    <button type="submit" class="btn-submit">Simpan Target</button>
                </div>
            </form>
        </div>
    </div>

    <!-- QRIS ZOOM MODAL -->
    <div id="modal-qris-zoom" class="modal-backdrop zoom-backdrop">
        <button type="button" class="zoom-close-btn">&times;</button>
        <div class="zoom-card">
            <h4>SCAN QRIS RESMI MERCHANTS</h4>
            <div class="zoom-image-holder">
                <!-- Authentic pattern representation -->
                <div class="qris-grid-pattern"></div>
            </div>
            <p>Gunakan Superapp pembayaran perbankan/e-wallet untuk setoran instan.</p>
        </div>
    </div>

    <!-- JS Code -->
    <script src="assets/js/main.js"></script>
</body>
</html>
