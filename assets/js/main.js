/**
 * NabunYuk Application Script (PHP Native Bundle)
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Splash Screen simulated timing
    const splash = document.getElementById("splash-screen");
    const progressFill = document.getElementById("splash-progress");
    const percentCount = document.getElementById("splash-percent");
    
    let currentPct = 0;
    const interval = setInterval(() => {
        currentPct += Math.floor(Math.random() * 8) + 4;
        if (currentPct >= 100) {
            currentPct = 100;
            clearInterval(interval);
            setTimeout(() => {
                splash.classList.add("faded");
            }, 300);
        }
        if (progressFill) progressFill.style.width = currentPct + "%";
        if (percentCount) percentCount.textContent = currentPct + "%";
    }, 70);

    // 2. Tab Navigation Dispatcher
    const navItems = document.querySelectorAll(".bottom-nav .nav-item");
    const tabPanes = document.querySelectorAll(".tab-pane");

    window.navigateToTab = function(tabName) {
        navItems.forEach(item => {
            if (item.getAttribute("data-tab") === tabName) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });

        tabPanes.forEach(pane => {
            if (pane.id === "tab-" + tabName) {
                pane.classList.add("active");
                pane.classList.add("animate-slide-up");
            } else {
                pane.classList.remove("active");
                pane.classList.remove("animate-slide-up");
            }
        });
    };

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const tab = item.getAttribute("data-tab");
            if (tab) {
                navigateToTab(tab);
            }
        });
    });

    // 3. Modals controller triggers
    const modalNabung = document.getElementById("modal-nabung");
    const modalTarget = document.getElementById("modal-target");
    const modalQrisZoom = document.getElementById("modal-qris-zoom");

    const btnNabungTrigger = document.getElementById("header-saving-btn");
    const btnTargetTrigger = document.getElementById("open-target-btn");
    const btnTargetTriggerAlt = document.getElementById("init-first-target-btn");
    const btnZoomQris = document.getElementById("btn-zoom-qris-popup");

    // Open Nabung
    if (btnNabungTrigger) {
        btnNabungTrigger.addEventListener("click", () => {
            modalNabung.classList.add("active");
        });
    }

    // Close Nabung
    const closeNabungBtns = [
        document.getElementById("close-modal-nabung"),
        document.getElementById("cancel-modal-nabung")
    ];
    closeNabungBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener("click", () => {
                modalNabung.classList.remove("active");
            });
        }
    });

    // Open Target
    if (btnTargetTrigger) {
        btnTargetTrigger.addEventListener("click", () => {
            modalTarget.classList.add("active");
        });
    }
    if (btnTargetTriggerAlt) {
        btnTargetTriggerAlt.addEventListener("click", () => {
            modalTarget.classList.add("active");
        });
    }

    // Close Target
    const closeTargetBtns = [
        document.getElementById("close-modal-target"),
        document.getElementById("cancel-modal-target")
    ];
    closeTargetBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener("click", () => {
                modalTarget.classList.remove("active");
            });
        }
    });

    // Open Qris Fullscreen ZOOM
    if (btnZoomQris) {
        btnZoomQris.addEventListener("click", () => {
            modalQrisZoom.classList.add("active");
        });
    }

    // Close Qris ZOOM
    const zoomCloseBtn = document.querySelector(".zoom-close-btn");
    if (zoomCloseBtn) {
        zoomCloseBtn.addEventListener("click", () => {
            modalQrisZoom.classList.remove("active");
        });
    }

    // 4. File Upload Image Preview mechanism
    const uploaderTrigger = document.getElementById("qris-uploader-trigger");
    const fileInputField = document.getElementById("file-bukti-transfer");
    const imagePreviewBox = document.getElementById("image-preview-container");

    if (uploaderTrigger && fileInputField) {
        uploaderTrigger.addEventListener("click", () => {
            fileInputField.click();
        });

        fileInputField.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                if (!file.type.startsWith("image/")) {
                    showToastAlert("Maksimal gambar PNG atau JPG", "error");
                    return;
                }
                const reader = new FileReader();
                reader.onload = (event) => {
                    uploaderTrigger.classList.add("hidden");
                    imagePreviewBox.classList.remove("hidden");
                    imagePreviewBox.innerHTML = `
                        <div style="display:flex; justify-content:space-between; align-items:center; padding: 10px; background:#fff; border-radius:12px; border: 1px solid rgba(255,138,122,0.4)">
                            <img src="${event.target.result}" style="width:50px; height:50px; object-cover:fit; border-radius:8px;" />
                            <span style="font-size:11px; color:#2B2B2B; font-weight:700">Gambar terpilih</span>
                            <button type="button" id="btn-remove-preview" style="background:#dc2626; color:#fff; border:none; border-radius:8px; padding:4px 8px; font-size:10px; cursor:pointer">Hapus</button>
                        </div>
                    `;
                    
                    document.getElementById("btn-remove-preview").addEventListener("click", (evt) => {
                        evt.stopPropagation();
                        fileInputField.value = "";
                        uploaderTrigger.classList.remove("hidden");
                        imagePreviewBox.classList.add("hidden");
                        imagePreviewBox.innerHTML = "";
                    });
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 5. Toast alerts
    const toastWrapper = document.getElementById("toast-wrapper");
    
    window.showToastAlert = function(msg, type = "success") {
        if (!toastWrapper) return;
        const div = document.createElement("div");
        div.className = `toast-item ${type} animate-slide-in-right`;
        div.style.cssText = `
            background: #FFF7F5;
            border-left: 5px solid ${type === 'success' ? '#10b981' : '#f43f5e'};
            padding: 14px;
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            font-size: 11px;
            color: #2B2B2B;
            width: 100%;
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        div.innerHTML = `
            <span>${msg}</span>
            <button style="background:none; border:none; font-weight:bold; cursor:pointer; color:#94a3b8">&times;</button>
        `;
        div.querySelector("button").addEventListener("click", () => div.remove());
        toastWrapper.appendChild(div);
        setTimeout(() => div.remove(), 4000);
    };

    window.triggerDownloadSim = function() {
        showToastAlert("QRIS Bukti diunduh ke galeri ponsel!", "success");
    };

    window.triggerCopyRekening = function(rekening) {
        navigator.clipboard.writeText(rekening);
        showToastAlert("Salin Rekening BCA berhasil!", "success");
    };

    // 6. Realtime list Search & Filters in JavaScript
    const searchInput = document.getElementById("filter-search-input");
    const statusSelect = document.getElementById("filter-status-select");
    const targetSelect = document.getElementById("filter-target-select");
    const txItemsList = document.querySelectorAll(".filterable-tx-item");

    function executeFilter() {
        const query = searchInput ? searchInput.value.toLowerCase() : "";
        const selStatus = statusSelect ? statusSelect.value : "all";
        const selTarget = targetSelect ? targetSelect.value : "all";

        txItemsList.forEach(item => {
            const sender = item.getAttribute("data-sender") || "";
            const status = item.getAttribute("data-status") || "";
            const targetId = item.getAttribute("data-target-id") || "";

            const matchSearch = sender.includes(query);
            const matchStatus = selStatus === "all" || status === selStatus;
            const matchTarget = selTarget === "all" || targetId === selTarget;

            if (matchSearch && matchStatus && matchTarget) {
                item.style.display = "flex";
            } else {
                item.style.display = "none";
            }
        });
    }

    if (searchInput) searchInput.addEventListener("input", executeFilter);
    if (statusSelect) statusSelect.addEventListener("change", executeFilter);
    if (targetSelect) targetSelect.addEventListener("change", executeFilter);

    // 7. Parsing parameters to show status notices
    const urlParams = new URLSearchParams(window.location.search);
    const alertStatus = urlParams.get("status");
    if (alertStatus) {
        if (alertStatus === "success_saving") {
            showToastAlert("Setoran dikirim! Tunggu konfirmasi admin.", "success");
        } else if (alertStatus === "invalid_input") {
            showToastAlert("Mohon isi form transfer dengan lengkap!", "error");
        } else if (alertStatus === "success_target") {
            showToastAlert("Rencana target baru berhasil didaftarkan!", "success");
        } else if (alertStatus === "status_updated") {
            showToastAlert("Status setoran berhasil direfleksikan!", "success");
        }
    }
});
