// widget-ia.js — ñu'mu Widget v3
// Widget flotante de IA con modos de respuesta y diseño premium

document.addEventListener("DOMContentLoaded", () => {

    // ─── CSS ─────────────────────────────────────────────────────────────
    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

        .numu-widget-container {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 9999;
            font-family: 'Inter', sans-serif;
        }

        /* ── Botón flotante ── */
        .numu-button {
            width: 58px;
            height: 58px;
            border-radius: 50%;
            background: linear-gradient(135deg, #c1121f 0%, #e76f00 100%);
            box-shadow: 0 4px 18px rgba(193,18,31,0.4), 0 2px 8px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.25s ease, box-shadow 0.25s ease;
            color: white;
            font-size: 1.4rem;
            border: 2.5px solid rgba(255,255,255,0.3);
            position: relative;
        }

        .numu-button::after {
            content: '';
            position: absolute;
            width: 12px;
            height: 12px;
            background: #4ade80;
            border-radius: 50%;
            top: 2px;
            right: 2px;
            border: 2px solid white;
            animation: numuPulse 2s infinite;
        }

        @keyframes numuPulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.8; }
        }

        .numu-button:hover {
            transform: scale(1.08) translateY(-2px);
            box-shadow: 0 8px 24px rgba(193,18,31,0.5), 0 4px 12px rgba(0,0,0,0.25);
        }

        /* ── Panel ── */
        .numu-chat-panel {
            position: absolute;
            bottom: 74px;
            right: 0;
            width: 370px;
            height: 540px;
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transform: scale(0.9) translateY(10px);
            transform-origin: bottom right;
            opacity: 0;
            pointer-events: none;
            transition: transform 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                        opacity 0.22s ease;
            border: 1px solid rgba(231,111,0,0.15);
        }

        .numu-chat-panel.open {
            transform: scale(1) translateY(0);
            opacity: 1;
            pointer-events: all;
        }

        /* ── Header ── */
        .numu-header {
            background: linear-gradient(135deg, #0a0a14 0%, #14213d 60%, #1d6fa5 100%);
            color: white;
            padding: 14px 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-shrink: 0;
            border-bottom: 2px solid rgba(231,111,0,0.4);
        }

        .numu-header-left {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .numu-avatar {
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, #e76f00, #fca311);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
            flex-shrink: 0;
        }

        .numu-header-info h3 {
            margin: 0;
            font-size: 1rem;
            font-weight: 600;
            letter-spacing: 0.3px;
        }

        .numu-header-info p {
            margin: 0;
            font-size: 0.72rem;
            opacity: 0.65;
            margin-top: 1px;
        }

        .numu-header-actions {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .numu-close {
            background: rgba(255,255,255,0.1);
            border: none;
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            font-size: 1.1rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
            line-height: 1;
        }

        .numu-close:hover { background: rgba(255,255,255,0.2); }

        /* ── Selector de Modo ── */
        .numu-mode-bar {
            background: #f8f6f1;
            border-bottom: 1px solid #ece8df;
            padding: 8px 12px;
            display: flex;
            gap: 6px;
            align-items: center;
            flex-shrink: 0;
            overflow-x: auto;
            scrollbar-width: none;
        }

        .numu-mode-bar::-webkit-scrollbar { display: none; }

        .numu-mode-label {
            font-size: 0.68rem;
            font-weight: 600;
            color: #8a7a6a;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            white-space: nowrap;
            margin-right: 2px;
        }

        .numu-mode-btn {
            background: white;
            border: 1.5px solid #ddd;
            border-radius: 20px;
            padding: 4px 10px;
            font-size: 0.72rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.18s ease;
            white-space: nowrap;
            font-family: inherit;
            color: #5a4a3a;
        }

        .numu-mode-btn:hover {
            border-color: #e76f00;
            color: #e76f00;
        }

        .numu-mode-btn.active {
            background: linear-gradient(135deg, #14213d, #1d6fa5);
            border-color: transparent;
            color: white;
            box-shadow: 0 2px 8px rgba(20,33,61,0.25);
        }

        /* ── Controles TTS ── */
        .numu-tts-controls {
            display: none;
            background: #fffcf5;
            padding: 7px 12px;
            border-bottom: 1px solid #e0d8c8;
            align-items: center;
            justify-content: space-between;
            font-size: 0.78rem;
            flex-shrink: 0;
            gap: 6px;
        }

        .numu-tts-btn {
            background: #e76f00;
            color: white;
            border: none;
            padding: 3px 9px;
            border-radius: 12px;
            cursor: pointer;
            transition: background 0.18s;
            font-family: inherit;
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 0.72rem;
        }

        .numu-tts-btn:hover { background: #c1121f; }
        .numu-tts-btn.blue { background: #1d6fa5; }
        .numu-tts-btn.blue:hover { background: #14213d; }

        /* ── Mensajes ── */
        .numu-messages {
            flex: 1;
            padding: 14px;
            overflow-y: auto;
            background: #fdfaf5;
            display: flex;
            flex-direction: column;
            gap: 10px;
            scroll-behavior: smooth;
        }

        .numu-messages::-webkit-scrollbar { width: 4px; }
        .numu-messages::-webkit-scrollbar-track { background: transparent; }
        .numu-messages::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }

        .numu-msg {
            max-width: 88%;
            padding: 10px 13px;
            border-radius: 14px;
            font-size: 0.875rem;
            line-height: 1.5;
        }

        .numu-msg.ai {
            background: white;
            border: 1px solid #ede9e0;
            align-self: flex-start;
            border-bottom-left-radius: 4px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.06);
        }

        .numu-msg.user {
            background: linear-gradient(135deg, #14213d, #1d6fa5);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
            box-shadow: 0 2px 8px rgba(20,33,61,0.2);
        }

        .numu-msg-text strong { font-weight: 600; }
        .numu-msg-text em { font-style: italic; opacity: 0.85; }

        .numu-mode-tag {
            font-size: 0.62rem;
            background: rgba(231,111,0,0.1);
            color: #e76f00;
            padding: 1px 6px;
            border-radius: 8px;
            margin-bottom: 5px;
            display: inline-block;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        /* ── Loader animado ── */
        .numu-loader {
            align-self: flex-start;
            display: none;
            background: white;
            border: 1px solid #ede9e0;
            border-radius: 14px;
            border-bottom-left-radius: 4px;
            padding: 12px 16px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.06);
        }

        .numu-dot {
            display: inline-block;
            width: 7px;
            height: 7px;
            background: #1d6fa5;
            border-radius: 50%;
            margin: 0 2px;
            animation: numuBounce 1.3s infinite ease-in-out both;
        }

        .numu-dot:nth-child(1) { animation-delay: -0.32s; }
        .numu-dot:nth-child(2) { animation-delay: -0.16s; }
        .numu-dot:nth-child(3) { background: #e76f00; }

        @keyframes numuBounce {
            0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
        }

        /* ── Traducción ── */
        .numu-translation-box {
            display: flex;
            gap: 4px;
            margin-top: 6px;
            padding-top: 6px;
            border-top: 1px dashed #e0d8c8;
            flex-wrap: wrap;
        }

        .numu-lang-btn {
            background: rgba(29,111,165,0.08);
            border: 1px solid rgba(29,111,165,0.2);
            border-radius: 10px;
            font-size: 0.68rem;
            color: #1d6fa5;
            cursor: pointer;
            padding: 2px 8px;
            font-family: inherit;
            font-weight: 500;
            transition: all 0.15s;
        }

        .numu-lang-btn:hover {
            background: #e76f00;
            border-color: #e76f00;
            color: white;
        }

        .translated-text-display {
            font-style: italic;
            color: #1d6fa5;
            font-size: 0.8rem;
            margin-top: 5px;
            display: none;
            line-height: 1.4;
        }

        /* ── Input area ── */
        .numu-input-area {
            padding: 10px 12px;
            background: white;
            border-top: 1px solid #ede9e0;
            display: flex;
            gap: 8px;
            align-items: flex-end;
            flex-shrink: 0;
        }

        .numu-input-area input {
            flex: 1;
            padding: 9px 14px;
            border: 1.5px solid #e0d8c8;
            border-radius: 20px;
            outline: none;
            font-size: 0.875rem;
            font-family: inherit;
            background: #fdfaf5;
            transition: border-color 0.2s;
            resize: none;
        }

        .numu-input-area input:focus {
            border-color: #e76f00;
            background: white;
        }

        .numu-send-btn {
            background: linear-gradient(135deg, #e76f00, #c1121f);
            color: white;
            border: none;
            border-radius: 50%;
            width: 38px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.18s, box-shadow 0.18s;
            flex-shrink: 0;
            box-shadow: 0 2px 8px rgba(231,111,0,0.3);
        }

        .numu-send-btn:hover {
            transform: scale(1.08);
            box-shadow: 0 4px 12px rgba(231,111,0,0.4);
        }

        .numu-send-btn:disabled {
            opacity: 0.5;
            transform: none;
            cursor: not-allowed;
        }

        /* ── Chips de sugerencias ── */
        .numu-suggestions {
            padding: 0 14px 10px;
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
            background: #fdfaf5;
        }

        .numu-suggestion-chip {
            background: white;
            border: 1px solid #e0d8c8;
            border-radius: 16px;
            padding: 4px 10px;
            font-size: 0.72rem;
            color: #5a4a3a;
            cursor: pointer;
            font-family: inherit;
            transition: all 0.15s;
        }

        .numu-suggestion-chip:hover {
            background: #e76f00;
            color: white;
            border-color: #e76f00;
        }

        /* ── Responsive móvil ── */
        @media (max-width: 480px) {
            .numu-chat-panel {
                position: fixed;
                inset: 0;
                width: 100%;
                height: 100%;
                border-radius: 0;
                z-index: 100000;
                bottom: 0;
                right: 0;
            }
            .numu-widget-container {
                bottom: 16px;
                right: 16px;
            }
        }

        @media (max-width: 380px) {
            .numu-mode-btn { font-size: 0.68rem; padding: 3px 8px; }
        }
    `;
    document.head.appendChild(style);

    // Cargar FontAwesome de forma no bloqueante
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const fa = document.createElement('link');
        fa.rel = 'stylesheet';
        fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        fa.crossOrigin = 'anonymous';
        document.head.appendChild(fa);
    }

    // ─── HTML ─────────────────────────────────────────────────────────────
    const container = document.createElement('div');
    container.className = 'numu-widget-container';
    container.innerHTML = `
        <div class="numu-chat-panel" id="numuPanel" role="dialog" aria-label="Chat con ñu'mu IA">
            <div class="numu-header">
                <div class="numu-header-left">
                    <div class="numu-avatar">🌽</div>
                    <div class="numu-header-info">
                        <h3>ñu'mu</h3>
                        <p>IA del Maíz · <span id="numuModeDisplay">Modo Normal</span></p>
                    </div>
                </div>
                <div class="numu-header-actions">
                    <button class="numu-close" id="numuClose" aria-label="Cerrar chat">✕</button>
                </div>
            </div>

            <!-- Selector de modos -->
            <div class="numu-mode-bar" id="numuModeBar">
                <span class="numu-mode-label">Modo:</span>
                <button class="numu-mode-btn" data-mode="flash" title="Solo lo esencial, muy rápido">⚡ Rápido</button>
                <button class="numu-mode-btn active" data-mode="normal" title="Respuesta equilibrada">💬 Normal</button>
                <button class="numu-mode-btn" data-mode="deep" title="Más detalle y contexto">🔍 Profundo</button>
                <button class="numu-mode-btn" data-mode="expert" title="Análisis completo y riguroso">🎓 Experto</button>
            </div>

            <!-- TTS controls -->
            <div class="numu-tts-controls" id="numuTtsControls">
                <span style="color: #5a4a3a; font-weight: 600; font-size: 0.75rem;"><i class="fas fa-volume-up"></i> Voz</span>
                <button class="numu-tts-btn" id="numuBtnPlayPause"><i class="fas fa-pause"></i> Pausar</button>
                <button class="numu-tts-btn blue" id="numuBtnSlow"><i class="fas fa-backward"></i></button>
                <span id="numuSpeedDisplay" style="font-weight:700; width:28px; text-align:center; color:#1d6fa5; font-size:0.78rem;">0.9x</span>
                <button class="numu-tts-btn blue" id="numuBtnFast"><i class="fas fa-forward"></i></button>
            </div>

            <div class="numu-messages" id="numuMessages">
                <div class="numu-msg ai">
                    <div class="numu-msg-text">Hola, soy ñu'mu. Pregúntame sobre razas de maíz, historia, nutrición, Ixtenco, o cualquier cosa.</div>
                    <div class="translated-text-display"></div>
                    <div class="numu-translation-box">
                        <button class="numu-lang-btn" onclick="numuSpeak(this,'es')">🔊 ESP</button>
                        <button class="numu-lang-btn" onclick="numuSpeak(this,'otomi')">OTO</button>
                        <button class="numu-lang-btn" onclick="numuSpeak(this,'yuhmu')">YUH</button>
                    </div>
                </div>
            </div>

            <!-- Sugerencias rápidas -->
            <div class="numu-suggestions" id="numuSuggestions">
                <button class="numu-suggestion-chip" data-q="¿Cuántas razas de maíz hay en Ixtenco?">🌽 Razas en Ixtenco</button>
                <button class="numu-suggestion-chip" data-q="¿Qué es el sistema milpa?">🌱 Sistema Milpa</button>
                <button class="numu-suggestion-chip" data-q="¿Cómo se dice maíz en Otomí?">🗣️ Otomí</button>
            </div>

            <div class="numu-loader" id="numuLoader">
                <div class="numu-dot"></div><div class="numu-dot"></div><div class="numu-dot"></div>
            </div>

            <div class="numu-input-area">
                <input type="text" id="numuInput" placeholder="Escribe tu pregunta..." autocomplete="off" maxlength="500" />
                <button class="numu-send-btn" id="numuSend" aria-label="Enviar"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>

        <div class="numu-button" id="numuBtn" role="button" aria-label="Abrir asistente ñu'mu" tabindex="0">
            <i class="fas fa-seedling"></i>
        </div>
    `;
    document.body.appendChild(container);

    // ─── LÓGICA ───────────────────────────────────────────────────────────
    const btn      = document.getElementById('numuBtn');
    const panel    = document.getElementById('numuPanel');
    const closeBtn = document.getElementById('numuClose');
    const sendBtn  = document.getElementById('numuSend');
    const input    = document.getElementById('numuInput');
    const messages = document.getElementById('numuMessages');
    const loader   = document.getElementById('numuLoader');
    const modeDisplay = document.getElementById('numuModeDisplay');

    let currentMode = 'normal';
    const modeNames = { flash: 'Modo Rápido', normal: 'Modo Normal', deep: 'Modo Profundo', expert: 'Modo Experto' };

    // Selección de modo
    document.querySelectorAll('.numu-mode-btn').forEach(modeBtn => {
        modeBtn.addEventListener('click', () => {
            document.querySelectorAll('.numu-mode-btn').forEach(b => b.classList.remove('active'));
            modeBtn.classList.add('active');
            currentMode = modeBtn.dataset.mode;
            modeDisplay.textContent = modeNames[currentMode];

            // Feedback visual breve
            const feedback = document.createElement('div');
            feedback.style.cssText = `text-align:center; font-size:0.72rem; color:#8a7a6a; padding:4px; animation: fadeOut 1.5s forwards;`;
            feedback.textContent = `Cambiando a ${modeNames[currentMode].toLowerCase()}...`;
            messages.appendChild(feedback);
            messages.scrollTop = messages.scrollHeight;
            setTimeout(() => feedback.remove(), 1600);
        });
    });

    // Chips de sugerencias
    document.querySelectorAll('.numu-suggestion-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            input.value = chip.dataset.q;
            sendMsg();
            document.getElementById('numuSuggestions').style.display = 'none';
        });
    });

    // Abrir / cerrar
    btn.addEventListener('click', () => {
        const isOpen = panel.classList.toggle('open');
        if (isOpen) {
            input.focus();
            // Ocultar dot de notificación cuando se abre
            btn.style.setProperty('--dot-display', 'none');
        }
    });

    btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') btn.click();
    });

    closeBtn.addEventListener('click', () => panel.classList.remove('open'));

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMsg();
        }
    });

    sendBtn.addEventListener('click', sendMsg);

    // TTS
    const pbBtn   = document.getElementById('numuBtnPlayPause');
    const slowBtn = document.getElementById('numuBtnSlow');
    const fastBtn = document.getElementById('numuBtnFast');
    if (pbBtn)   pbBtn.addEventListener('click', numuTogglePauseResume);
    if (slowBtn) slowBtn.addEventListener('click', () => numuChangeSpeechRate(-0.1));
    if (fastBtn) fastBtn.addEventListener('click', () => numuChangeSpeechRate(0.1));

    // ─── Renderizar mensaje ───────────────────────────────────────────────
    function appendMsg(text, type, mode) {
        // Ocultar sugerencias después del primer mensaje
        const sugg = document.getElementById('numuSuggestions');
        if (sugg) sugg.style.display = 'none';

        const div = document.createElement('div');
        div.className = `numu-msg ${type}`;

        if (type === 'ai') {
            // Formatear markdown básico
            let formatted = text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n\n/g, '<br><br>')
                .replace(/\n/g, '<br>');

            const modeTag = mode && mode !== 'normal'
                ? `<span class="numu-mode-tag">${modeNames[mode] || mode}</span><br>` : '';

            div.innerHTML = `
                ${modeTag}
                <div class="numu-msg-text">${formatted}</div>
                <div class="translated-text-display"></div>
                <div class="numu-translation-box">
                    <button class="numu-lang-btn" onclick="numuSpeak(this,'es')">🔊 ESP</button>
                    <button class="numu-lang-btn" onclick="numuSpeak(this,'otomi')">OTO</button>
                    <button class="numu-lang-btn" onclick="numuSpeak(this,'yuhmu')">YUH</button>
                </div>
            `;
        } else {
            div.textContent = text;
        }

        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    // ─── Enviar mensaje ───────────────────────────────────────────────────
    async function sendMsg() {
        const text = input.value.trim();
        if (!text || sendBtn.disabled) return;

        appendMsg(text, 'user');
        input.value = '';
        sendBtn.disabled = true;

        loader.style.display = 'block';
        messages.scrollTop = messages.scrollHeight;

        try {
            const response = await fetch(`/api/chat?t=${Date.now()}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: text, mode: currentMode })
            });

            if (response.ok) {
                const data = await response.json();
                appendMsg(data.reply, 'ai', data.mode || currentMode);
            } else {
                const errorData = await response.json().catch(() => ({}));
                appendMsg(`No pude responder: ${errorData.error || 'Error de conexión.'}`, 'ai');
            }
        } catch (err) {
            appendMsg('Sin conexión. Verifica tu internet e inténtalo de nuevo.', 'ai');
        } finally {
            loader.style.display = 'none';
            sendBtn.disabled = false;
            input.focus();
        }
    }

}); // fin DOMContentLoaded

// ─── TTS (fuera del DOMContentLoaded para ser global) ───────────────────────
let numuSpeechRate = 0.95;
let numuIsPaused = false;
let numuLastSpokenText = "";
let numuLastSpokenLang = "es-MX";
let numuIsManualCancel = false;

function numuUpdatePlayBtn(state) {
    const btn = document.getElementById('numuBtnPlayPause');
    if (!btn) return;
    if (state === 'pause')  btn.innerHTML = '<i class="fas fa-pause"></i> Pausar';
    if (state === 'play')   btn.innerHTML = '<i class="fas fa-play"></i> Reanudar';
    if (state === 'repeat') btn.innerHTML = '<i class="fas fa-play"></i> Repetir';
}

function numuTogglePauseResume() {
    if (window.speechSynthesis.speaking) {
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            numuIsPaused = false;
            numuUpdatePlayBtn('pause');
        } else {
            window.speechSynthesis.pause();
            numuIsPaused = true;
            numuUpdatePlayBtn('play');
        }
    } else if (numuLastSpokenText) {
        numuSpeakText(numuLastSpokenText, numuLastSpokenLang, false);
    }
}

function numuChangeSpeechRate(delta) {
    numuSpeechRate = Math.min(2.0, Math.max(0.5, numuSpeechRate + delta));
    const display = document.getElementById('numuSpeedDisplay');
    if (display) display.innerText = numuSpeechRate.toFixed(1) + 'x';
    if (window.speechSynthesis.speaking) {
        numuIsManualCancel = true;
        window.speechSynthesis.cancel();
        setTimeout(() => numuExecuteSpeech(numuLastSpokenText, numuLastSpokenLang), 150);
    }
}

function numuSpeakText(text, lang, saveText = true) {
    if (!('speechSynthesis' in window)) return;
    if (saveText) { numuLastSpokenText = text; numuLastSpokenLang = lang; }
    const controls = document.getElementById('numuTtsControls');
    if (controls) controls.style.display = 'flex';
    numuIsManualCancel = true;
    window.speechSynthesis.cancel();
    setTimeout(() => numuExecuteSpeech(numuLastSpokenText, numuLastSpokenLang), 150);
}

function numuExecuteSpeech(text, lang) {
    numuIsManualCancel = false;
    numuIsPaused = false;
    numuUpdatePlayBtn('pause');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang || 'es-MX';
    utterance.rate = numuSpeechRate;
    utterance.onend = () => {
        if (!numuIsManualCancel) { numuUpdatePlayBtn('repeat'); numuIsPaused = false; }
    };
    window.speechSynthesis.speak(utterance);
}

async function numuSpeak(btn, lang) {
    const parentMsg = btn.closest('.numu-msg');
    const textElem = parentMsg.querySelector('.numu-msg-text');
    if (!textElem) return;
    const text = textElem.textContent;
    const translationDisplay = parentMsg.querySelector('.translated-text-display');

    if (lang === 'es') {
        if (translationDisplay) translationDisplay.style.display = 'none';
        numuSpeakText(text, 'es-MX');
        return;
    }

    const langName = lang === 'otomi' ? 'Otomí' : 'Yuhmu de Ixtenco';
    if (translationDisplay) {
        translationDisplay.innerHTML = `<strong>${langName}:</strong> <em>Traduciendo... <i class="fas fa-spinner fa-spin"></i></em>`;
        translationDisplay.style.display = 'block';
    }

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
            const translation = data.reply;
            if (translationDisplay) {
                translationDisplay.innerHTML = `<strong>${langName}:</strong> <em>${translation}</em><br><span style="font-size:0.7rem; color:#aaa;">* Traducción IA. Fonética aproximada.</span>`;
            }
            numuSpeakText(translation, 'es-MX');
        } else {
            if (translationDisplay) translationDisplay.innerHTML = `<em>Error al traducir.</em>`;
        }
    } catch (err) {
        if (translationDisplay) translationDisplay.innerHTML = `<em>Sin conexión.</em>`;
    }
}
