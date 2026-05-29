<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NabunYuk - Tabungan Bersama Online</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap" rel="stylesheet">
    
    <!-- CSS Dependencies -->
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/animation.css">
    <link rel="stylesheet" href="assets/css/dashboard.css">
    <link rel="stylesheet" href="assets/css/responsive.css">
</head>
<body>
    <!-- Splash Screen -->
    <div id="splash-screen" class="splash-container">
        <div class="splash-content">
            <div class="splash-logo">
                <div class="logo-circle">
                    <svg class="piggy-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 5c-1.5 0-2.8 1.4-3 2-2.5 0-4.5 2-4.5 4.5S13.5 16 16 16c.2.6 1.5 2 3 2 1.7 0 3-1.3 3-3V8c0-1.7-1.3-3-3-3z"/><path d="M12 11c0-1 1-1.5 2-1.5s2 .5 2 1.5c0 1-1.5 2-2 3"/><circle cx="16" cy="11" r="1"/></svg>
                </div>
            </div>
            <h1 class="splash-title">Nabun<span>Yuk</span></h1>
            <p class="splash-subtitle">Premium Mobile Fintech</p>
            <div class="progress-bar-container">
                <div id="splash-progress" class="progress-bar-fill"></div>
            </div>
            <span id="splash-percent" class="splash-counter">0%</span>
        </div>
    </div>

    <!-- Main Wrapper inside CSS Mobile Mockup -->
    <div class="phone-mockup-frame">
        <!-- Status Bar -->
        <div class="status-bar">
            <div class="status-left">
                <span className="live-badge"></span>
                <span>NabunYuk Live</span>
            </div>
            <div class="status-center">14:22</div>
            <div class="status-right">
                <span>5G</span>
                <div class="battery-icon">
                    <div class="battery-fill"></div>
                </div>
            </div>
        </div>

        <!-- Custom Brand Header -->
        <header class="main-header">
            <div class="header-logo-section">
                <div class="header-icon-box">
                    <svg class="brand-sub-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/></svg>
                </div>
                <div>
                    <h1 class="header-title">NabunYuk</h1>
                    <p class="header-tagline">FINTECH BERSAMA</p>
                </div>
            </div>
            <button id="header-saving-btn" class="header-action-btn">
                <span>+ Nabung</span>
            </button>
        </header>

        <!-- Main Dynamic Contents Window -->
        <main class="content-viewport">
