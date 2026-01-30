const colors = require('tailwindcss/colors');

// AstroQuest Space Theme Palette
const astroquest = {
    // Deep space backgrounds
    space: {
        950: 'hsl(220, 40%, 5%)',   // Deepest black
        900: 'hsl(220, 35%, 8%)',   // Main background
        850: 'hsl(220, 30%, 11%)',  // Elevated surface
        800: 'hsl(220, 28%, 14%)',  // Cards
        700: 'hsl(220, 25%, 18%)',  // Hover states
        600: 'hsl(220, 22%, 24%)',  // Borders
        500: 'hsl(220, 18%, 35%)',  // Muted text
        400: 'hsl(220, 15%, 50%)',  // Secondary text
        300: 'hsl(220, 12%, 70%)',  // Primary text muted
        200: 'hsl(220, 10%, 85%)',  // Primary text
        100: 'hsl(220, 8%, 94%)',   // Bright text
        50: 'hsl(220, 5%, 98%)',    // White text
    },
    // Accent colors
    nebula: {
        50: 'hsl(245, 100%, 97%)',
        100: 'hsl(245, 95%, 92%)',
        200: 'hsl(245, 90%, 85%)',
        300: 'hsl(245, 85%, 75%)',
        400: 'hsl(250, 80%, 65%)',  // Primary accent
        500: 'hsl(255, 75%, 55%)',  // Vibrant purple
        600: 'hsl(260, 70%, 48%)',
        700: 'hsl(265, 65%, 40%)',
        800: 'hsl(270, 60%, 32%)',
        900: 'hsl(275, 55%, 25%)',
    },
    // Cosmic cyan
    cosmic: {
        50: 'hsl(185, 100%, 97%)',
        100: 'hsl(185, 95%, 90%)',
        200: 'hsl(185, 90%, 80%)',
        300: 'hsl(185, 85%, 68%)',
        400: 'hsl(185, 80%, 55%)',  // Primary cyan
        500: 'hsl(185, 75%, 45%)',
        600: 'hsl(185, 70%, 38%)',
        700: 'hsl(185, 65%, 30%)',
        800: 'hsl(185, 60%, 22%)',
        900: 'hsl(185, 55%, 15%)',
    },
    // Aurora greens
    aurora: {
        50: 'hsl(160, 100%, 97%)',
        100: 'hsl(160, 95%, 90%)',
        200: 'hsl(160, 90%, 78%)',
        300: 'hsl(160, 85%, 65%)',
        400: 'hsl(160, 80%, 50%)',
        500: 'hsl(160, 75%, 42%)',
        600: 'hsl(160, 70%, 35%)',
        700: 'hsl(160, 65%, 28%)',
        800: 'hsl(160, 60%, 20%)',
        900: 'hsl(160, 55%, 14%)',
    },
    // Solar flare (warnings/errors)
    solar: {
        50: 'hsl(30, 100%, 97%)',
        100: 'hsl(30, 95%, 90%)',
        200: 'hsl(30, 90%, 80%)',
        300: 'hsl(25, 85%, 68%)',
        400: 'hsl(20, 80%, 55%)',
        500: 'hsl(15, 75%, 48%)',
        600: 'hsl(10, 70%, 42%)',
        700: 'hsl(5, 65%, 35%)',
        800: 'hsl(0, 60%, 28%)',
        900: 'hsl(355, 55%, 22%)',
    },
};

// Neutral/gray for compatibility
const gray = {
    50: astroquest.space[50],
    100: astroquest.space[100],
    200: astroquest.space[200],
    300: astroquest.space[300],
    400: astroquest.space[400],
    500: astroquest.space[500],
    600: astroquest.space[600],
    700: astroquest.space[700],
    800: astroquest.space[800],
    900: astroquest.space[900],
};

module.exports = {
    content: [
        './resources/scripts/**/*.{js,ts,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                header: ['"IBM Plex Sans"', '"Roboto"', 'system-ui', 'sans-serif'],
            },
            colors: {
                black: astroquest.space[950],
                // AstroQuest theme colors
                astro: astroquest.space,
                nebula: astroquest.nebula,
                cosmic: astroquest.cosmic,
                aurora: astroquest.aurora,
                solar: astroquest.solar,
                // Legacy compatibility
                primary: colors.blue,
                gray: gray,
                neutral: astroquest.space,
                cyan: astroquest.cosmic,
            },
            fontSize: {
                '2xs': '0.625rem',
            },
            transitionDuration: {
                250: '250ms',
            },
            borderColor: theme => ({
                default: theme('colors.neutral.600', 'currentColor'),
            }),
            boxShadow: {
                'glow': '0 0 20px -5px rgba(139, 92, 246, 0.4)',
                'glow-cosmic': '0 0 20px -5px rgba(34, 211, 238, 0.4)',
                'glow-aurora': '0 0 20px -5px rgba(52, 211, 153, 0.4)',
                'inner-glow': 'inset 0 0 30px rgba(139, 92, 246, 0.1)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'astro-gradient': 'linear-gradient(135deg, hsl(255, 75%, 55%) 0%, hsl(185, 80%, 55%) 100%)',
                'cosmic-gradient': 'linear-gradient(135deg, hsl(220, 35%, 8%) 0%, hsl(255, 40%, 15%) 50%, hsl(220, 35%, 8%) 100%)',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
            },
            keyframes: {
                'glow-pulse': {
                    '0%, 100%': { 
                        boxShadow: '0 0 20px -5px rgba(139, 92, 246, 0.4)',
                    },
                    '50%': { 
                        boxShadow: '0 0 30px -5px rgba(139, 92, 246, 0.6)',
                    },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
    ]
};
