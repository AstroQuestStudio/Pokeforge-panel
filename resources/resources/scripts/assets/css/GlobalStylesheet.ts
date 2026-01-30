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

    * {
        box-sizing: border-box;
    }

    html {
        scroll-behavior: smooth;
    }

    body {
        ${tw`font-sans text-neutral-200`};
        background: linear-gradient(135deg, #0f0f14 0%, #1a1a24 50%, #0f0f14 100%);
        background-attachment: fixed;
        letter-spacing: 0.015em;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        transition: background-color 0.3s ease;
    }

    /* Subtle animated background */
    body::before {
        content: '';
        position: fixed;
        inset: 0;
        background: 
            radial-gradient(ellipse at 20% 20%, rgba(34, 211, 238, 0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(139, 92, 246, 0.03) 0%, transparent 50%);
        pointer-events: none;
        z-index: -1;
    }

    h1, h2, h3, h4, h5, h6 {
        ${tw`font-medium tracking-normal font-header`};
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

    /* Modern Scrollbar */
    ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }

    ::-webkit-scrollbar-track {
        background: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.08) 100%);
        border-radius: 5px;
        border: 2px solid transparent;
        background-clip: padding-box;
        transition: background 0.2s ease;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.15) 100%);
        background-clip: padding-box;
    }

    ::-webkit-scrollbar-corner {
        background: transparent;
    }

    /* Firefox Scrollbar */
    * {
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.12) transparent;
    }

    /* Text Selection */
    ::selection {
        background: rgba(34, 211, 238, 0.3);
        color: #ffffff;
    }

    ::-moz-selection {
        background: rgba(34, 211, 238, 0.3);
        color: #ffffff;
    }

    /* Focus visible styling */
    *:focus-visible {
        outline: 2px solid rgba(34, 211, 238, 0.5);
        outline-offset: 2px;
        border-radius: 4px;
    }

    /* Smooth transitions globally */
    a, button {
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Remove tap highlight on mobile */
    * {
        -webkit-tap-highlight-color: transparent;
    }

    /* Improve image rendering */
    img {
        image-rendering: -webkit-optimize-contrast;
    }

    /* Animation utilities for page transitions */
    .page-enter {
        opacity: 0;
        transform: translateY(10px);
    }

    .page-enter-active {
        opacity: 1;
        transform: translateY(0);
        transition: opacity 300ms ease-out, transform 300ms ease-out;
    }

    .page-exit {
        opacity: 1;
        transform: translateY(0);
    }

    .page-exit-active {
        opacity: 0;
        transform: translateY(-10px);
        transition: opacity 200ms ease-in, transform 200ms ease-in;
    }

    /* Disable animations for users who prefer reduced motion */
    @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
        }
    }
`;
