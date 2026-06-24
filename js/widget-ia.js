// widget-ia.js — ñu'mu Chat Inteligente Flotante v5
// Este script inyecta un widget de chat interactivo completo y responsivo en cualquier página.

(function() {
    'use strict';

    // Determinar la ruta relativa a la página de IA para redirección o referencias
    function getIaPagePath() {
        const path = window.location.pathname;
        if (path.includes('ia-maiz.html')) return null; // No mostrar widget en la página propia de la IA
        const depth = (path.match(/\//g) || []).length - 1;
        const prefix = depth <= 1 ? '' : '../'.repeat(depth - 1);
        if (depth <= 1) return 'paginas/categorias/ia-maiz.html';
        return prefix + 'paginas/categorias/ia-maiz.html';
    }

    const iaPath = getIaPagePath();
    if (!iaPath) return; // Si ya estamos en ia-maiz.html, no hacer nada

    // Inyectar FontAwesome si no está cargado
    if (!document.querySelector('link[href*="font-awesome"]') && !document.querySelector('link[href*="all.min.css"]')) {
        const fa = document.createElement('link');
        fa.rel = 'stylesheet';
        fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        fa.crossOrigin = 'anonymous';
        document.head.appendChild(fa);
    }

    // Inyectar fuente de Google Fonts 'Inter' si no está cargada
    if (!document.querySelector('link[href*="fonts.googleapis"]')) {
        const gfonts = document.createElement('link');
        gfonts.rel = 'preconnect';
        gfonts.href = 'https://fonts.googleapis.com';
        const gfonts2 = document.createElement('link');
        gfonts2.rel = 'preconnect';
        gfonts2.href = 'https://fonts.gstatic.com';
        gfonts2.crossOrigin = 'anonymous';
        const fontStyle = document.createElement('link');
        fontStyle.rel = 'stylesheet';
        fontStyle.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
        document.head.appendChild(gfonts);
        document.head.appendChild(gfonts2);
        document.head.appendChild(fontStyle);
    }

    // CSS del Widget y su Panel de Chat Flotante
    const style = document.createElement('style');
    style.innerHTML = `
        /* Launcher */
        .numu-launcher {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 99998;
            font-family: 'Inter', sans-serif;
        }
        .numu-launcher-btn {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #e76f00 0%, #c1121f 100%);
            box-shadow: 0 4px 20px rgba(193,18,31,0.4), 0 2px 8px rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border: 2px solid rgba(255,255,255,0.3);
            color: white;
            font-size: 1.5rem;
            transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.25s ease;
            position: relative;
        }
        .numu-launcher-btn::after {
            content: '';
            position: absolute;
            width: 12px;
            height: 12px;
            background: #4ade80;
            border-radius: 50%;
            top: 2px;
            right: 2px;
            border: 2px solid #0d0f1a;
            animation: numuPulseBtn 2s infinite;
        }
        @keyframes numuPulseBtn {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.3); opacity: 0.8; }
        }
        .numu-launcher-btn:hover {
            transform: scale(1.1) translateY(-3px);
            box-shadow: 0 8px 28px rgba(193,18,31,0.5), 0 4px 12px rgba(0,0,0,0.3);
        }
        .numu-launcher-tip {
            position: absolute;
            bottom: 68px;
            right: 0;
            background: #0f111a;
            color: #f0f0f0;
            padding: 6px 14px;
            border-radius: 10px;
            font-size: 0.75rem;
            white-space: nowrap;
            box-shadow: 0 4px 16px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.06);
            opacity: 0;
            transform: translateY(6px);
            transition: opacity 0.2s ease, transform 0.2s ease;
            pointer-events: none;
            font-weight: 500;
        }
        .numu-launcher-tip::after {
            content: '';
            position: absolute;
            top: 100%;
            right: 20px;
            border: 6px solid transparent;
            border-top-color: #0f111a;
        }
        .numu-launcher:hover .numu-launcher-tip {
            opacity: 1;
            transform: translateY(0);
        }

        /* Contenedor del Chat */
        .numu-chat-panel {
            position: fixed;
            bottom: 96px;
            right: 24px;
            width: 380px;
            height: 550px;
            border-radius: 16px;
            background: #0d0f1a;
            border: 1px solid rgba(255,255,255,0.08);
            box-shadow: 0 12px 40px rgba(0,0,0,0.6);
            z-index: 99999;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            font-family: 'Inter', sans-serif;
            opacity: 0;
            transform: translateY(15px) scale(0.95);
            pointer-events: none;
            transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .numu-chat-panel.active {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: auto;
        }

        /* Header */
        .numu-chat-header {
            background: linear-gradient(135deg, #0f111a 0%, #151926 100%);
            padding: 14px 16px;
            border-bottom: 1px solid rgba(255,255,255,0.06);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .numu-chat-title {
            display: flex;
            align-items: center;
            gap: 8px;
            color: white;
            font-size: 0.9rem;
            font-weight: 600;
        }
        .numu-chat-status {
            width: 8px;
            height: 8px;
            background: #4ade80;
            border-radius: 50%;
            display: inline-block;
        }
        .numu-chat-header-actions {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .numu-chat-header-btn {
            background: none;
            border: none;
            color: rgba(255,255,255,0.5);
            font-size: 0.85rem;
            cursor: pointer;
            transition: color 0.15s;
            padding: 2px;
        }
        .numu-chat-header-btn:hover {
            color: white;
        }

        /* Selector de Modos */
        .numu-chat-modes {
            background: rgba(255,255,255,0.01);
            border-bottom: 1px solid rgba(255,255,255,0.04);
            padding: 6px 12px;
            display: flex;
            justify-content: space-between;
            gap: 4px;
        }
        .numu-mode-tab {
            flex: 1;
            background: none;
            border: 1px solid transparent;
            border-radius: 8px;
            padding: 6px 2px;
            color: rgba(255,255,255,0.4);
            font-size: 0.68rem;
            cursor: pointer;
            font-family: inherit;
            font-weight: 500;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
            transition: all 0.15s ease;
        }
        .numu-mode-tab:hover {
            color: rgba(255,255,255,0.8);
            background: rgba(255,255,255,0.03);
        }
        .numu-mode-tab.active {
            color: #fca311;
            background: rgba(231,111,0,0.1);
            border-color: rgba(231,111,0,0.2);
        }
        .numu-mode-icon {
            font-size: 0.85rem;
        }

        /* TTS Bar */
        .numu-tts-bar {
            display: none;
            background: rgba(231,111,0,0.08);
            border-bottom: 1px solid rgba(231,111,0,0.15);
            padding: 6px 14px;
            align-items: center;
            gap: 8px;
            font-size: 0.72rem;
            color: #fca311;
        }
        .numu-tts-bar.active {
            display: flex;
        }
        .numu-tts-btn {
            background: rgba(231,111,0,0.15);
            border: 1px solid rgba(231,111,0,0.3);
            border-radius: 12px;
            color: #fca311;
            padding: 2px 8px;
            cursor: pointer;
            font-size: 0.65rem;
            font-weight: 600;
            transition: background 0.15s;
        }
        .numu-tts-btn:hover {
            background: rgba(231,111,0,0.25);
        }
        .numu-tts-btn.stop {
            background: rgba(255,255,255,0.06);
            border-color: rgba(255,255,255,0.1);
            color: rgba(255,255,255,0.5);
            margin-left: auto;
        }

        /* Lista de Mensajes */
        .numu-chat-messages {
            flex: 1;
            padding: 14px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
            background: radial-gradient(circle at 50% 20%, rgba(20,20,35,0.4) 0%, #0d0f1a 100%);
            scroll-behavior: smooth;
        }
        .numu-chat-messages::-webkit-scrollbar {
            width: 4px;
        }
        .numu-chat-messages::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.06);
            border-radius: 4px;
        }

        /* Mensajes individuales */
        .numu-msg {
            display: flex;
            flex-direction: column;
            max-width: 85%;
            animation: numuMsgIn 0.2s ease forwards;
        }
        @keyframes numuMsgIn {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .numu-msg.usr {
            align-self: flex-end;
        }
        .numu-msg.ai {
            align-self: flex-start;
        }
        .numu-msg-header {
            display: flex;
            align-items: center;
            gap: 5px;
            margin-bottom: 4px;
            font-size: 0.65rem;
            color: rgba(255,255,255,0.3);
        }
        .numu-msg.usr .numu-msg-header {
            justify-content: flex-end;
        }
        .numu-msg-avatar {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.6rem;
        }
        .numu-msg.ai .numu-msg-avatar {
            background: linear-gradient(135deg, #e76f00, #fca311);
            color: white;
            box-shadow: 0 0 6px rgba(231,111,0,0.3);
        }
        .numu-msg.usr .numu-msg-avatar {
            background: rgba(29,111,165,0.3);
            color: rgba(255,255,255,0.7);
        }
        .numu-msg-bubble {
            padding: 10px 12px;
            border-radius: 12px;
            font-size: 0.8rem;
            line-height: 1.5;
            color: rgba(255,255,255,0.9);
            word-break: break-word;
        }
        .numu-msg.ai .numu-msg-bubble {
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.06);
            border-top-left-radius: 3px;
        }
        .numu-msg.usr .numu-msg-bubble {
            background: linear-gradient(135deg, #14213d, #1b3a5c);
            border: 1px solid rgba(29,111,165,0.15);
            border-top-right-radius: 3px;
        }
        .numu-msg-bubble strong { color: #fca311; }
        .numu-msg-tag {
            background: rgba(231,111,0,0.12);
            color: #fca311;
            padding: 1px 4px;
            border-radius: 4px;
            font-size: 0.55rem;
            font-weight: 600;
            text-transform: uppercase;
        }

        /* Traducción y TTS del Mensaje */
        .numu-msg-actions {
            display: flex;
            gap: 4px;
            margin-top: 4px;
        }
        .numu-msg-action-btn {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 6px;
            padding: 3px 6px;
            font-size: 0.6rem;
            color: rgba(255,255,255,0.4);
            cursor: pointer;
            font-family: inherit;
            transition: all 0.12s;
            display: flex;
            align-items: center;
            gap: 3px;
        }
        .numu-msg-action-btn:hover {
            background: rgba(231,111,0,0.08);
            border-color: rgba(231,111,0,0.2);
            color: #fca311;
        }
        .numu-msg-trans-box {
            background: rgba(29,111,165,0.06);
            border: 1px solid rgba(29,111,165,0.12);
            border-radius: 8px;
            padding: 6px 10px;
            font-size: 0.72rem;
            font-style: italic;
            color: #7ecfff;
            margin-top: 5px;
            display: none;
            line-height: 1.4;
        }
        .numu-msg-trans-box.show {
            display: block;
        }

        /* Loader de pensando */
        .numu-thinking {
            align-self: flex-start;
            display: none;
        }
        .numu-thinking-bubble {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 12px;
            border-top-left-radius: 3px;
            padding: 10px 14px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .numu-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            animation: numuBounce 1.2s infinite ease-in-out both;
        }
        .numu-dot:nth-child(1) { background: #fca311; animation-delay: -0.32s; }
        .numu-dot:nth-child(2) { background: #e76f00; animation-delay: -0.16s; }
        .numu-dot:nth-child(3) { background: #1d6fa5; }
        @keyframes numuBounce {
            0%, 80%, 100% { transform: scale(0.5); opacity: 0.3; }
            40% { transform: scale(1); opacity: 1; }
        }

        /* Preview de Imagen */
        .numu-img-preview-container {
            background: rgba(0,0,0,0.3);
            border-top: 1px solid rgba(255,255,255,0.05);
            padding: 8px 12px;
            display: none;
            align-items: center;
            justify-content: space-between;
        }
        .numu-img-preview-wrap {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .numu-img-preview {
            width: 40px;
            height: 40px;
            object-fit: cover;
            border-radius: 6px;
            border: 1px solid rgba(255,255,255,0.15);
        }
        .numu-img-preview-txt {
            font-size: 0.65rem;
            color: rgba(255,255,255,0.4);
        }
        .numu-img-preview-clear {
            background: none;
            border: none;
            color: #ff6b6b;
            font-size: 0.85rem;
            cursor: pointer;
        }

        /* Input Area */
        .numu-chat-input-area {
            background: #0f111a;
            border-top: 1px solid rgba(255,255,255,0.06);
            padding: 10px 12px;
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        .numu-chat-input-row {
            display: flex;
            gap: 8px;
            align-items: center;
        }
        .numu-chat-input {
            flex: 1;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 20px;
            padding: 8px 14px;
            color: white;
            font-size: 0.82rem;
            outline: none;
            font-family: inherit;
            transition: all 0.2s;
        }
        .numu-chat-input:focus {
            border-color: rgba(231,111,0,0.5);
            background: rgba(255,255,255,0.07);
        }
        .numu-chat-input::placeholder {
            color: rgba(255,255,255,0.3);
        }
        .numu-chat-icon-btn {
            background: none;
            border: none;
            color: rgba(255,255,255,0.4);
            font-size: 1.05rem;
            cursor: pointer;
            transition: color 0.15s;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
        }
        .numu-chat-icon-btn:hover {
            color: #7ecfff;
            background: rgba(255,255,255,0.04);
        }
        .numu-chat-send-btn {
            background: linear-gradient(135deg, #e76f00, #c1121f);
            border: none;
            color: white;
            font-size: 0.85rem;
            cursor: pointer;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(231,111,0,0.3);
            transition: transform 0.15s;
            flex-shrink: 0;
        }
        .numu-chat-send-btn:hover {
            transform: scale(1.05);
        }
        .numu-chat-send-btn:disabled {
            opacity: 0.35;
            cursor: not-allowed;
            transform: none;
        }
        .numu-chat-input-hint {
            display: flex;
            justify-content: space-between;
            font-size: 0.58rem;
            color: rgba(255,255,255,0.25);
            padding: 0 4px;
        }

        /* ── RESPONSIVIDAD MÓVIL AL 100% ── */
        @media (max-width: 600px) {
            .numu-launcher {
                bottom: 16px;
                right: 16px;
            }
            .numu-launcher-btn {
                width: 52px;
                height: 52px;
                font-size: 1.3rem;
            }
            .numu-chat-panel {
                bottom: 0 !important;
                right: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                border-radius: 0 !important;
                border: none !important;
                margin: 0 !important;
                z-index: 100000 !important;
            }
            .numu-chat-header {
                padding: 16px;
            }
            .numu-chat-input-area {
                padding: 12px 14px 24px; /* Espacio extra para el área segura de gestos móviles */
            }
            .numu-chat-input {
                font-size: 0.88rem;
                padding: 10px 16px;
            }
            .numu-chat-messages {
                padding: 16px;
            }
            .numu-msg {
                max-width: 90%;
            }
            .numu-msg-bubble {
                font-size: 0.85rem;
                padding: 11px 14px;
            }
        }
    `;
    document.head.appendChild(style);

    // Inyectar HTML del widget
    const widget = document.createElement('div');
    widget.id = 'numu-widget-container';
    widget.innerHTML = `
        <div class="numu-launcher">
            <span class="numu-launcher-tip">Pregunta a ñu'mu IA</span>
            <button class="numu-launcher-btn" id="numuLauncherBtn" aria-label="Abrir chat con ñu'mu IA">
                🤖
            </button>
        </div>

        <div class="numu-chat-panel" id="numuChatPanel">
            <!-- Header -->
            <div class="numu-chat-header">
                <div class="numu-chat-title">
                    <span class="numu-chat-status"></span>
                    <span>ñu'mu IA</span>
                </div>
                <div class="numu-chat-header-actions">
                    <a href="${iaPath}" class="numu-chat-header-btn" title="Ir a la página completa" target="_blank">
                        <i class="fas fa-expand-arrows-alt"></i>
                    </a>
                    <button class="numu-chat-header-btn" id="numuCloseBtn" aria-label="Cerrar chat">
                        <i class="fas fa-times" style="font-size: 1.1rem;"></i>
                    </button>
                </div>
            </div>

            <!-- Modos -->
            <div class="numu-chat-modes">
                <button class="numu-mode-tab" data-mode="flash" title="Respuestas cortas de 1 o 2 oraciones">
                    <span class="numu-mode-icon">⚡</span>
                    <span>Rápido</span>
                </button>
                <button class="numu-mode-tab active" data-mode="normal" title="Conversación balanceada de 3-5 oraciones">
                    <span class="numu-mode-icon">💬</span>
                    <span>Normal</span>
                </button>
                <button class="numu-mode-tab" data-mode="deep" title="Explicación detallada con contexto">
                    <span class="numu-mode-icon">🔍</span>
                    <span>Profundo</span>
                </button>
                <button class="numu-mode-tab" data-mode="expert" title="Análisis completo y referencias académicas">
                    <span class="numu-mode-icon">🎓</span>
                    <span>Experto</span>
                </button>
            </div>

            <!-- TTS Bar -->
            <div class="numu-tts-bar" id="numuTtsBar">
                <span><i class="fas fa-volume-up"></i> Reproduciendo voz</span>
                <button class="numu-tts-btn" id="numuTtsPauseBtn">Pausar</button>
                <button class="numu-tts-btn" id="numuTtsSpeedBtn">0.9x</button>
                <button class="numu-tts-btn stop" id="numuTtsStopBtn">✕ Detener</button>
            </div>

            <!-- Mensajes -->
            <div class="numu-chat-messages" id="numuMsgContainer">
                <div class="numu-msg ai">
                    <div class="numu-msg-header">
                        <div class="numu-msg-avatar"><i class="fas fa-microchip"></i></div>
                        <span>ñu'mu</span>
                    </div>
                    <div class="numu-msg-bubble">
                        ¡Hola! Soy <strong>ñu'mu</strong>, tu IA acompañante del Maíz Nativo. Pregúntame sobre variedades, cultura de Ixtenco, recetas, o traduce oraciones a Otomí y Yuhmu.
                    </div>
                    <div class="numu-msg-trans-box"></div>
                    <div class="numu-msg-actions">
                        <button class="numu-msg-action-btn es" onclick="numuSpeakMsg(this)"><i class="fas fa-volume-up"></i> Escuchar</button>
                        <button class="numu-msg-action-btn oto" onclick="numuTranslateMsg(this, 'otomi')"><i class="fas fa-globe"></i> Otomí</button>
                        <button class="numu-msg-action-btn yuh" onclick="numuTranslateMsg(this, 'yuhmu')"><i class="fas fa-leaf"></i> Yuhmu</button>
                    </div>
                </div>
            </div>

            <!-- Preview Imagen -->
            <div class="numu-img-preview-container" id="numuPreviewContainer">
                <div class="numu-img-preview-wrap">
                    <img src="" class="numu-img-preview" id="numuImgPreview">
                    <span class="numu-img-preview-txt">Imagen de maíz lista para analizar</span>
                </div>
                <button class="numu-img-preview-clear" id="numuClearImgBtn"><i class="fas fa-trash-alt"></i></button>
            </div>

            <!-- Input Area -->
            <div class="numu-chat-input-area">
                <div class="numu-chat-input-row">
                    <button class="numu-chat-icon-btn" id="numuUploadBtn" title="Subir foto de maíz para analizar">
                        <i class="fas fa-image"></i>
                    </button>
                    <input type="file" id="numuFileInput" accept="image/*" style="display:none;">
                    <input type="text" class="numu-chat-input" id="numuChatInput" placeholder="Escribe un mensaje..." autocomplete="off">
                    <button class="numu-chat-send-btn" id="numuSendBtn" aria-label="Enviar mensaje">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
                <div class="numu-chat-input-hint">
                    <span id="numuModeHintText">Modo: Normal</span>
                    <span><span id="numuCharCount">0</span>/600</span>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(widget);

    // ─── Referencias al DOM ────────────────────────────────────────────────
    const launcherBtn = document.getElementById('numuLauncherBtn');
    const closeBtn = document.getElementById('numuCloseBtn');
    const panel = document.getElementById('numuChatPanel');
    const msgContainer = document.getElementById('numuMsgContainer');
    const chatInput = document.getElementById('numuChatInput');
    const sendBtn = document.getElementById('numuSendBtn');
    const charCount = document.getElementById('numuCharCount');
    const uploadBtn = document.getElementById('numuUploadBtn');
    const fileInput = document.getElementById('numuFileInput');
    const previewContainer = document.getElementById('numuPreviewContainer');
    const imgPreview = document.getElementById('numuImgPreview');
    const clearImgBtn = document.getElementById('numuClearImgBtn');
    const ttsBar = document.getElementById('numuTtsBar');
    const ttsPauseBtn = document.getElementById('numuTtsPauseBtn');
    const ttsSpeedBtn = document.getElementById('numuTtsSpeedBtn');
    const ttsStopBtn = document.getElementById('numuTtsStopBtn');
    const modeTabs = document.querySelectorAll('.numu-mode-tab');
    const modeHintText = document.getElementById('numuModeHintText');

    // ─── Estado del Chat ──────────────────────────────────────────────────
    let activeMode = 'normal';
    let base64Image = null;
    let isRequestBusy = false;
    
    // Configuración de TTS
    let activeTtsRate = 0.95;
    let lastPlayedText = '';
    let speechCancelled = false;

    const modeLabels = { flash: 'Rápido', normal: 'Normal', deep: 'Profundo', expert: 'Experto' };

    // ─── Event Listeners de la interfaz ────────────────────────────────────
    
    // Alternar visibilidad de panel
    launcherBtn.addEventListener('click', () => {
        panel.classList.toggle('active');
        if (panel.classList.contains('active')) {
            chatInput.focus();
            msgContainer.scrollTop = msgContainer.scrollHeight;
        }
    });

    closeBtn.addEventListener('click', () => {
        panel.classList.remove('active');
        stopSpeech();
    });

    // Control de caracteres del input
    chatInput.addEventListener('input', () => {
        const text = chatInput.value;
        if (text.length > 600) {
            chatInput.value = text.slice(0, 600);
        }
        charCount.textContent = chatInput.value.length;
    });

    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    sendBtn.addEventListener('click', sendMessage);

    // Subida de imagen
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    clearImgBtn.addEventListener('click', clearUploadedImage);

    // Modos de respuesta
    modeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            modeTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeMode = tab.dataset.mode;
            modeHintText.textContent = `Modo: ${modeLabels[activeMode]}`;
        });
    });

    // TTS Controles
    ttsPauseBtn.addEventListener('click', toggleTtsPause);
    ttsSpeedBtn.addEventListener('click', cycleTtsSpeed);
    ttsStopBtn.addEventListener('click', stopSpeech);

    // ─── Métodos de imagen ───────────────────────────────────────────────
    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(evt) {
            const dataUrl = evt.target.result;
            imgPreview.src = dataUrl;
            previewContainer.style.display = 'flex';
            
            // Extraer el base64 limpio (sin el prefijo data:image/jpeg;base64,)
            base64Image = dataUrl.split(',')[1];
            msgContainer.scrollTop = msgContainer.scrollHeight;
        };
        reader.readAsDataURL(file);
    }

    function clearUploadedImage() {
        fileInput.value = '';
        base64Image = null;
        imgPreview.src = '';
        previewContainer.style.display = 'none';
    }

    // ─── Enviar Mensajes ───────────────────────────────────────────────
    async function sendMessage() {
        const text = chatInput.value.trim();
        if ((!text && !base64Image) || isRequestBusy) return;

        // Agregar mensaje del usuario a la vista
        appendUserMessage(text, base64Image);

        // Limpiar inputs
        chatInput.value = '';
        charCount.textContent = '0';
        
        const tempImage = base64Image; // Guardar referencia para la llamada
        clearUploadedImage();

        isRequestBusy = true;
        sendBtn.disabled = true;

        // Mostrar cargador
        const loader = injectLoader();

        try {
            const response = await fetch(`/api/chat?t=${Date.now()}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: text,
                    image: tempImage,
                    mode: activeMode
                })
            });

            if (response.ok) {
                const data = await response.json();
                removeLoader(loader);
                appendAiMessage(data.reply, data.mode || activeMode);
            } else {
                const err = await response.json().catch(() => ({}));
                removeLoader(loader);
                appendAiMessage('Lo siento, ocurrió un error al comunicarme con ñu\'mu: ' + (err.error || 'Error de servidor.'), activeMode);
            }
        } catch (e) {
            removeLoader(loader);
            appendAiMessage('Error de red. Asegúrate de tener conexión a Internet y vuelve a intentarlo.', activeMode);
        } finally {
            isRequestBusy = false;
            sendBtn.disabled = false;
            chatInput.focus();
        }
    }

    // ─── Renders en Mensajería ──────────────────────────────────────────
    function appendUserMessage(text, imageBase64) {
        const div = document.createElement('div');
        div.className = 'numu-msg usr';
        
        let imgHtml = '';
        if (imageBase64) {
            imgHtml = `<img src="data:image/jpeg;base64,${imageBase64}" style="width: 100%; max-height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 6px; border: 1px solid rgba(255,255,255,0.1);">`;
        }

        div.innerHTML = `
            <div class="numu-msg-header">
                <span>Tú</span>
                <div class="numu-msg-avatar"><i class="fas fa-user"></i></div>
            </div>
            <div class="numu-msg-bubble">
                ${imgHtml}
                ${text ? escapeHtml(text).replace(/\n/g, '<br>') : ''}
            </div>
        `;
        msgContainer.appendChild(div);
        msgContainer.scrollTop = msgContainer.scrollHeight;
    }

    function appendAiMessage(text, mode) {
        const div = document.createElement('div');
        div.className = 'numu-msg ai';
        
        const showTag = mode && mode !== 'normal';
        const html = formatMarkdown(text);

        // Guardar el texto plano en el nodo por si el usuario le da a "Escuchar"
        div.dataset.raw = text;

        div.innerHTML = `
            <div class="numu-msg-header">
                <div class="numu-msg-avatar"><i class="fas fa-microchip"></i></div>
                <span>ñu'mu</span>
                ${showTag ? `<span class="numu-msg-tag">${modeLabels[mode] || mode}</span>` : ''}
            </div>
            <div class="numu-msg-bubble">${html}</div>
            <div class="numu-msg-trans-box"></div>
            <div class="numu-msg-actions">
                <button class="numu-msg-action-btn es" onclick="numuSpeakMsg(this)"><i class="fas fa-volume-up"></i> Escuchar</button>
                <button class="numu-msg-action-btn oto" onclick="numuTranslateMsg(this, 'otomi')"><i class="fas fa-globe"></i> Otomí</button>
                <button class="numu-msg-action-btn yuh" onclick="numuTranslateMsg(this, 'yuhmu')"><i class="fas fa-leaf"></i> Yuhmu</button>
            </div>
        `;
        msgContainer.appendChild(div);
        msgContainer.scrollTop = msgContainer.scrollHeight;
    }

    function injectLoader() {
        const div = document.createElement('div');
        div.className = 'numu-thinking';
        div.id = 'numu-loader-temp';
        div.innerHTML = `
            <div class="numu-thinking-bubble">
                <div class="numu-dot"></div><div class="numu-dot"></div><div class="numu-dot"></div>
                <span style="font-size: 0.65rem; color: rgba(255,255,255,0.3); font-style: italic;">Pensando...</span>
            </div>
        `;
        msgContainer.appendChild(div);
        div.style.display = 'block';
        msgContainer.scrollTop = msgContainer.scrollHeight;
        return div;
    }

    function removeLoader(loader) {
        if (loader && loader.parentNode) {
            loader.parentNode.removeChild(loader);
        }
    }

    // ─── Ayudantes de formateo ───────────────────────────────────────────
    function escapeHtml(text) {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function formatMarkdown(text) {
        return escapeHtml(text)
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>');
    }

    // ─── MÉTODOS GLOBALES DE VOZ Y TRADUCCIÓN (ACCESIBLES DESDE ONCLICK) ──
    
    window.numuSpeakMsg = function(btn) {
        const msgDiv = btn.closest('.numu-msg');
        const text = msgDiv.dataset.raw || msgDiv.querySelector('.numu-msg-bubble').textContent;
        playSpeech(text);
    };

    window.numuTranslateMsg = async function(btn, lang) {
        const msgDiv = btn.closest('.numu-msg');
        const text = msgDiv.dataset.raw || msgDiv.querySelector('.numu-msg-bubble').textContent;
        const transBox = msgDiv.querySelector('.numu-msg-trans-box');
        if (!transBox || !text) return;

        const langName = lang === 'otomi' ? 'Otomí' : 'Yuhmu de Ixtenco';
        transBox.textContent = `Traduciendo al ${langName}...`;
        transBox.classList.add('show');
        msgContainer.scrollTop = msgContainer.scrollHeight;

        try {
            const response = await fetch(`/api/chat?t=${Date.now()}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: `Traduce el siguiente texto a ${langName}. Da solo la traducción exacta, sin notas adicionales:\n\n"${text}"`,
                    mode: 'flash'
                })
            });

            if (response.ok) {
                const data = await response.json();
                transBox.innerHTML = `<strong>${langName}:</strong> ${data.reply}<br><small style="opacity:0.5; font-size:0.58rem;">* Traducción aproximada de la IA</small>`;
                playSpeech(data.reply);
            } else {
                transBox.textContent = 'Error al traducir.';
            }
        } catch {
            transBox.textContent = 'Sin conexión para traducir.';
        }
        msgContainer.scrollTop = msgContainer.scrollHeight;
    };

    // ─── Text-To-Speech (Voz) ───────────────────────────────────────────
    function playSpeech(text, keepState = true) {
        if (!('speechSynthesis' in window)) return;
        if (keepState) lastPlayedText = text;

        speechCancelled = true;
        window.speechSynthesis.cancel();

        ttsBar.classList.add('active');

        setTimeout(() => {
            speechCancelled = false;
            updateTtsPauseButton('pause');
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'es-MX';
            utterance.rate = activeTtsRate;
            utterance.onend = () => {
                if (!speechCancelled) {
                    updateTtsPauseButton('repeat');
                }
            };
            window.speechSynthesis.speak(utterance);
        }, 150);
    }

    function toggleTtsPause() {
        if (window.speechSynthesis.speaking) {
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
                updateTtsPauseButton('pause');
            } else {
                window.speechSynthesis.pause();
                updateTtsPauseButton('play');
            }
        } else if (lastPlayedText) {
            playSpeech(lastPlayedText, false);
        }
    }

    function cycleTtsSpeed() {
        // Ciclar velocidades: 0.9x -> 1.1x -> 1.3x -> 1.5x -> 0.7x -> 0.9x
        const speeds = [0.7, 0.9, 1.1, 1.3, 1.5];
        let idx = speeds.indexOf(activeTtsRate);
        if (idx === -1) idx = 1; // Default to 0.9
        
        activeTtsRate = speeds[(idx + 1) % speeds.length];
        ttsSpeedBtn.textContent = `${activeTtsRate.toFixed(1)}x`;

        if (window.speechSynthesis.speaking && lastPlayedText) {
            speechCancelled = true;
            window.speechSynthesis.cancel();
            setTimeout(() => playSpeech(lastPlayedText, false), 150);
        }
    }

    function stopSpeech() {
        speechCancelled = true;
        window.speechSynthesis.cancel();
        ttsBar.classList.remove('active');
    }

    function updateTtsPauseButton(state) {
        if (state === 'pause') ttsPauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar';
        if (state === 'play') ttsPauseBtn.innerHTML = '<i class="fas fa-play"></i> Reanudar';
        if (state === 'repeat') ttsPauseBtn.innerHTML = '<i class="fas fa-play"></i> Repetir';
    }

})();
