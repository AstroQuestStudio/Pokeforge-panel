import React from 'react';
import classNames from 'classnames';

interface GlassCardProps {
    variant?: 'default' | 'dark' | 'light' | 'elevated' | 'bordered';
    hover?: boolean;
    glow?: 'none' | 'cyan' | 'violet' | 'emerald';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
    as?: keyof JSX.IntrinsicElements;
}

const GlassCard: React.FC<GlassCardProps> = ({
    variant = 'default',
    hover = true,
    glow = 'none',
    padding = 'md',
    rounded = 'xl',
    className,
    children,
    onClick,
    as: Component = 'div',
}) => {
    const variantClasses = {
        default: 'glass-card',
        dark: 'glass-dark',
        light: 'glass-light',
        elevated: 'glass-card shadow-elevation-3',
        bordered: 'glass border-2 border-neutral-600/50',
    };

    const paddingClasses = {
        none: '',
        sm: 'p-2 sm:p-3',
        md: 'p-3 sm:p-4',
        lg: 'p-4 sm:p-6',
    };

    const roundedClasses = {
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
    };

    const glowClasses = {
        none: '',
        cyan: 'hover:shadow-glow-cyan',
        violet: 'hover:shadow-glow-violet',
        emerald: 'hover:shadow-glow-emerald',
    };

    const hoverClasses = hover
        ? 'hover:border-neutral-500/50 hover:-translate-y-0.5 transition-all duration-300 ease-out cursor-pointer'
        : '';

    return React.createElement(
        Component,
        {
            className: classNames(
                variantClasses[variant],
                paddingClasses[padding],
                roundedClasses[rounded],
                glowClasses[glow],
                hoverClasses,
                'will-change-transform',
                className
            ),
            onClick,
        },
        children
    );
};

export default GlassCard;
