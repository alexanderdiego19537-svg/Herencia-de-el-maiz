// widget-ia.js — ñu'mu Launcher v4
// El botón flotante abre directamente la página completa de IA

(function() {
    'use strict';

    // Detectar ruta raíz (funciona desde cualquier profundidad)
    function getIaPath() {
        const path = window.location.pathname;
        // Si ya estamos en la página de IA, no mostrar el botón
        if (path.includes('ia-maiz.html')) return null;
        // Calcular profundidad relativa
        const depth = (path.match(/\//g) || []).length - 1;
        const prefix = depth <= 1 ? '' : '../'.repeat(depth - 1);
        if (depth <= 1) return 'paginas/categorias/ia-maiz.html';
        return prefix + 'paginas/categorias/ia-maiz.html';
    }

    const iaPath = getIaPath();
    if (!iaPath) return; // No mostrar en la propia página de IA

    // CSS del botón flotante
    const style = document.createElement('style');
    style.innerHTML = `
        .numu-launcher {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 9999;
        }

        .numu-launcher-btn {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #c1121f 0%, #e76f00 100%);
            box-shadow: 0 4px 20px rgba(193,18,31,0.45), 0 2px 8px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border: 2.5px solid rgba(255,255,255,0.25);
            text-decoration: none;
            color: white;
            font-size: 1.5rem;
            transition: transform 0.25s ease, box-shadow 0.25s ease;
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
            border: 2px solid white;
            animation: numuPulseBtn 2s infinite;
        }

        @keyframes numuPulseBtn {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.3); opacity: 0.7; }
        }

        .numu-launcher-btn:hover {
            transform: scale(1.1) translateY(-3px);
            box-shadow: 0 8px 28px rgba(193,18,31,0.55), 0 4px 12px rgba(0,0,0,0.25);
        }

        .numu-launcher-tip {
            position: absolute;
            bottom: 68px;
            right: 0;
            background: #14213d;
            color: white;
            padding: 6px 12px;
            border-radius: 10px;
            font-size: 0.75rem;
            white-space: nowrap;
            font-family: 'Inter', sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            opacity: 0;
            transform: translateY(4px);
            transition: opacity 0.2s ease, transform 0.2s ease;
            pointer-events: none;
        }

        .numu-launcher-tip::after {
            content: '';
            position: absolute;
            top: 100%;
            right: 18px;
            border: 5px solid transparent;
            border-top-color: #14213d;
        }

        .numu-launcher:hover .numu-launcher-tip {
            opacity: 1;
            transform: translateY(0);
        }

        @media (max-width: 480px) {
            .numu-launcher { bottom: 16px; right: 16px; }
            .numu-launcher-btn { width: 54px; height: 54px; font-size: 1.3rem; }
        }
    `;
    document.head.appendChild(style);

    // HTML del launcher
    const launcher = document.createElement('div');
    launcher.className = 'numu-launcher';
    launcher.innerHTML = `
        <span class="numu-launcher-tip">🌽 Pregunta a ñu'mu IA</span>
        <a href="${iaPath}" class="numu-launcher-btn" aria-label="Ir a ñu'mu IA">
            🌽
        </a>
    `;

    document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(launcher);
    });

    // Si DOMContentLoaded ya pasó
    if (document.readyState !== 'loading') {
        document.body.appendChild(launcher);
    }
})();
