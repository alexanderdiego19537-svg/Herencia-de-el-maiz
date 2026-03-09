// widget-ia.js
// Script para agregar el widget flotante de ñu'mu a cualquier página

document.addEventListener("DOMContentLoaded", () => {
    // Inject CSS
    const style = document.createElement('style');
    style.innerHTML = `
        .numu-widget-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            font-family: 'Inter', sans-serif;
        }

        .numu-button {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #c1121f, #e76f00);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            color: white;
            font-size: 1.5rem;
            border: 2px solid #fff;
        }

        .numu-button:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(0,0,0,0.4);
        }

        .numu-chat-panel {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 350px;
            height: 500px;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transform: scale(0);
            transform-origin: bottom right;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 1px solid rgba(231, 111, 0, 0.3);
        }

        .numu-chat-panel.open {
            transform: scale(1);
        }

        .numu-header {
            background: linear-gradient(135deg, #14213d, #1d6fa5);
            color: white;
            padding: 15px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .numu-header h3 {
            margin: 0;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .numu-header p {
            margin: 0;
            font-size: 0.75rem;
            opacity: 0.8;
            margin-top: 2px;
        }

        .numu-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
        }

        .numu-messages {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            background: #fdfaf5;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .numu-msg {
            max-width: 85%;
            padding: 10px 14px;
            border-radius: 12px;
            font-size: 0.9rem;
            line-height: 1.4;
            position: relative;
        }

        .numu-msg.ai {
            background: white;
            border: 1px solid #eee;
            align-self: flex-start;
            border-bottom-left-radius: 2px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }

        .numu-msg.user {
            background: #e76f00;
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 2px;
        }

        .numu-input-area {
            padding: 10px;
            background: white;
            border-top: 1px solid #eee;
            display: flex;
            gap: 8px;
        }

        .numu-input-area input {
            flex: 1;
            padding: 10px 15px;
            border: 1px solid #ddd;
            border-radius: 20px;
            outline: none;
            font-size: 0.9rem;
        }
        
        .numu-input-area input:focus {
            border-color: #e76f00;
        }

        .numu-send-btn {
            background: #14213d;
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background 0.2s;
        }
        
        .numu-send-btn:hover {
            background: #1d6fa5;
        }

        .numu-translation-box {
            display: flex;
            justify-content: space-between;
            margin-top: 5px;
            padding-top: 5px;
            border-top: 1px dashed #ddd;
        }

        .numu-lang-btn {
            background: none;
            border: none;
            font-size: 0.7rem;
            color: #1d6fa5;
            cursor: pointer;
            padding: 2px 4px;
        }

        .numu-lang-btn:hover {
            color: #e76f00;
            text-decoration: underline;
        }
        
        /* Loader */
        .numu-loader {
            align-self: flex-start;
            display: none;
            padding: 10px;
        }
        .numu-dot {
            display: inline-block;
            width: 6px;
            height: 6px;
            background-color: #1d6fa5;
            border-radius: 50%;
            margin: 0 2px;
            animation: numuBounce 1.4s infinite ease-in-out both;
        }
        .numu-dot:nth-child(1) { animation-delay: -0.32s; }
        .numu-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes numuBounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }
        
        @media (max-width: 450px) {
            .numu-chat-panel {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                border-radius: 0;
                bottom: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Ensure FontAwesome is loaded
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const fa = document.createElement('link');
        fa.rel = 'stylesheet';
        fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(fa);
    }

    // Inject HTML
    const container = document.createElement('div');
    container.className = 'numu-widget-container';
    container.innerHTML = `
        <div class="numu-chat-panel" id="numuPanel">
            <div class="numu-header">
                <div>
                    <h3><i class="fas fa-seedling"></i> ñu'mu</h3>
                    <p>Guardián de Semillas con IA</p>
                </div>
                <button class="numu-close" id="numuClose">&times;</button>
            </div>
            
            <div class="numu-messages" id="numuMessages">
                <div class="numu-msg ai">
                    <div>¡Hola! Soy ñu'mu. Pregúntame sobre razas de maíz, su historia o nutrición en Ixtenco.</div>
                    <div class="numu-translation-box">
                        <button class="numu-lang-btn" onclick="numuSpeak(this, 'es')">ESP</button>
                        <button class="numu-lang-btn" onclick="numuSpeak(this, 'otomi')">OTO</button>
                        <button class="numu-lang-btn" onclick="numuSpeak(this, 'yuhmu')">YUH</button>
                    </div>
                </div>
            </div>
            
            <div class="numu-loader" id="numuLoader">
                <div class="numu-dot"></div><div class="numu-dot"></div><div class="numu-dot"></div>
            </div>

            <div class="numu-input-area">
                <input type="text" id="numuInput" placeholder="Escribe tu pregunta..." />
                <button class="numu-send-btn" id="numuSend"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>

        <div class="numu-button" id="numuBtn">
            <i class="fas fa-comment-dots"></i>
        </div>
    `;
    document.body.appendChild(container);

    // Logic
    const btn = document.getElementById('numuBtn');
    const panel = document.getElementById('numuPanel');
    const closeBtn = document.getElementById('numuClose');
    const sendBtn = document.getElementById('numuSend');
    const input = document.getElementById('numuInput');
    const messages = document.getElementById('numuMessages');
    const loader = document.getElementById('numuLoader');

    btn.addEventListener('click', () => {
        panel.classList.toggle('open');
        if (panel.classList.contains('open')) {
            input.focus();
        }
    });

    closeBtn.addEventListener('click', () => {
        panel.classList.remove('open');
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMsg();
    });

    sendBtn.addEventListener('click', sendMsg);

    function appendMsg(text, type) {
        const div = document.createElement('div');
        div.className = `numu-msg ${type}`;

        if (type === 'ai') {
            let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            div.innerHTML = `
                <div>${formatted}</div>
                <div class="numu-translation-box">
                    <button class="numu-lang-btn" onclick="numuSpeak(this, 'es')">ESP</button>
                    <button class="numu-lang-btn" onclick="numuSpeak(this, 'otomi')">OTO</button>
                    <button class="numu-lang-btn" onclick="numuSpeak(this, 'yuhmu')">YUH</button>
                </div>
            `;
        } else {
            div.textContent = text;
        }

        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    async function sendMsg() {
        const text = input.value.trim();
        if (!text) return;

        appendMsg(text, 'user');
        input.value = '';

        loader.style.display = 'block';
        messages.scrollTop = messages.scrollHeight;

        try {
            // Se llamará al backend real cuando esté desplegado
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: text })
            });

            if (response.ok) {
                const data = await response.json();
                appendMsg(data.reply, 'ai');
            } else {
                setTimeout(() => {
                    appendMsg("Soy ñu'mu. En este momento mi conexión con Vercel no está viva en producción, pero pronto podré responderte con conocimiento milenario.", 'ai');
                }, 1000);
            }
        } catch (err) {
            setTimeout(() => {
                appendMsg("Soy ñu'mu. Parece que estoy desconectado de mi base de conocimiento. (Error de red).", 'ai');
            }, 1000);
        } finally {
            loader.style.display = 'none';
        }
    }
});

function numuSpeak(btn, lang) {
    const parentMsg = btn.closest('.numu-msg').querySelector('div');
    const text = parentMsg.textContent;

    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();

        let utteranceText = text;
        let voiceLang = 'es-MX';

        // Simulación básica de fonética para lectura si es indígena
        if (lang === 'otomi') {
            utteranceText = "Danxu ra taha. " + text.substring(0, 30) + "..."; // Aproximación
        } else if (lang === 'yuhmu') {
            utteranceText = "Ñumhú ra taha Ixtenco. " + text.substring(0, 30) + "...";
        }

        const utterance = new SpeechSynthesisUtterance(utteranceText);
        utterance.lang = voiceLang;
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
    }
}
