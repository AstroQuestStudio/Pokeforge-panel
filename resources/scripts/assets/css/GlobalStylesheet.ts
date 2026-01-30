import tw from 'twin.macro';
import { createGlobalStyle } from 'styled-components/macro';
// @ts-expect-error untyped font file
import font from '@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2';

export default createGlobalStyle`
    @font-face {
        font-family: 'IBM Plex Sans';
        font-style: normal;
        font-display: swap;
        font-weight: 100 700;
        src: url(${font}) format('woff2-variations');
        unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
    }

    *, *::before, *::after {
        box-sizing: border-box;
    }

    body {
        ${tw`font-sans text-neutral-200`};
        background: linear-gradient(180deg, 
            hsl(220, 35%, 6%) 0%, 
            hsl(240, 30%, 8%) 50%, 
            hsl(220, 35%, 6%) 100%
        );
        background-attachment: fixed;
        min-height: 100vh;
        letter-spacing: 0.015em;
        
        /* Subtle animated stars background effect */
        &::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
                radial-gradient(2px 2px at 20px 30px, hsl(220, 10%, 70%), transparent),
                radial-gradient(2px 2px at 40px 70px, hsl(220, 10%, 60%), transparent),
                radial-gradient(1px 1px at 90px 40px, hsl(220, 10%, 80%), transparent),
                radial-gradient(2px 2px at 160px 120px, hsl(220, 10%, 50%), transparent),
                radial-gradient(1px 1px at 230px 80px, hsl(220, 10%, 70%), transparent),
                radial-gradient(2px 2px at 300px 200px, hsl(220, 10%, 60%), transparent),
                radial-gradient(1px 1px at 400px 50px, hsl(220, 10%, 80%), transparent),
                radial-gradient(2px 2px at 500px 180px, hsl(220, 10%, 50%), transparent);
            background-size: 550px 250px;
            opacity: 0.15;
            pointer-events: none;
            z-index: 0;
            animation: twinkle 8s ease-in-out infinite alternate;
        }
    }

    @keyframes twinkle {
        0%, 100% { opacity: 0.15; }
        50% { opacity: 0.25; }
    }

    /* Ensure content is above stars */
    #app, .app-container {
        position: relative;
        z-index: 1;
    }

    h1, h2, h3, h4, h5, h6 {
        ${tw`font-medium tracking-normal font-header`};
        background: linear-gradient(135deg, hsl(220, 10%, 98%) 0%, hsl(220, 10%, 75%) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    /* Reset heading styles for non-decorative headings */
    .heading-solid h1, .heading-solid h2, .heading-solid h3, 
    .heading-solid h4, .heading-solid h5, .heading-solid h6,
    h1.solid, h2.solid, h3.solid, h4.solid, h5.solid, h6.solid {
        background: none;
        -webkit-text-fill-color: inherit;
    }

    p {
        ${tw`text-neutral-200 leading-snug font-sans`};
    }

    form {
        ${tw`m-0`};
    }

    textarea, select, input, button, button:focus, button:focus-visible {
        ${tw`outline-none`};
    }

    input[type=number]::-webkit-outer-spin-button,
    input[type=number]::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
        margin: 0;
    }

    input[type=number] {
        -moz-appearance: textfield !important;
    }

    /* Links */
    a {
        transition: color 0.2s ease, opacity 0.2s ease;
    }

    a:hover {
        opacity: 0.85;
    }

    /* Selection */
    ::selection {
        background: hsl(255, 75%, 55%);
        color: white;
    }

    /* Modern Scroll Bar Style */
    ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
        background: transparent;
    }

    ::-webkit-scrollbar-track {
        background: hsl(220, 30%, 10%);
        border-radius: 5px;
    }

    ::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, hsl(255, 60%, 50%) 0%, hsl(185, 70%, 45%) 100%);
        border-radius: 5px;
        border: 2px solid hsl(220, 30%, 10%);
    }

    ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, hsl(255, 70%, 60%) 0%, hsl(185, 80%, 55%) 100%);
    }

    ::-webkit-scrollbar-corner {
        background: transparent;
    }

    /* Focus styles */
    :focus-visible {
        outline: 2px solid hsl(255, 75%, 55%);
        outline-offset: 2px;
    }

    /* Smooth transitions for theme elements */
    .transition-theme {
        transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
    }

    /* Glassmorphism utility */
    .glass {
        background: rgba(30, 35, 55, 0.7);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .glass-hover:hover {
        background: rgba(40, 45, 70, 0.8);
        border-color: rgba(255, 255, 255, 0.12);
    }

    /* Glow effects */
    .glow-nebula {
        box-shadow: 0 0 20px -5px rgba(139, 92, 246, 0.4);
    }

    .glow-cosmic {
        box-shadow: 0 0 20px -5px rgba(34, 211, 238, 0.4);
    }

    .glow-aurora {
        box-shadow: 0 0 20px -5px rgba(52, 211, 153, 0.4);
    }

    /* Status indicator animations */
    @keyframes status-pulse {
        0%, 100% { opacity: 0.6; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.05); }
    }

    .status-running {
        animation: status-pulse 2s ease-in-out infinite;
    }
`;
