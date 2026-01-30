import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

interface ProgressRingProps {
    value: number;
    max?: number;
    size?: 'sm' | 'md' | 'lg';
    strokeWidth?: number;
    showValue?: boolean;
    showLabel?: boolean;
    label?: string;
    color?: 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose' | 'auto';
    animated?: boolean;
    className?: string;
}

const colorMap = {
    cyan: {
        stroke: '#22d3ee',
        glow: 'drop-shadow(0 0 6px rgba(34, 211, 238, 0.5))',
        gradient: ['#22d3ee', '#06b6d4'],
    },
    violet: {
        stroke: '#8b5cf6',
        glow: 'drop-shadow(0 0 6px rgba(139, 92, 246, 0.5))',
        gradient: ['#8b5cf6', '#7c3aed'],
    },
    emerald: {
        stroke: '#10b981',
        glow: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.5))',
        gradient: ['#10b981', '#059669'],
    },
    amber: {
        stroke: '#f59e0b',
        glow: 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.5))',
        gradient: ['#f59e0b', '#d97706'],
    },
    rose: {
        stroke: '#f43f5e',
        glow: 'drop-shadow(0 0 6px rgba(244, 63, 94, 0.5))',
        gradient: ['#f43f5e', '#e11d48'],
    },
};

const sizeMap = {
    sm: { size: 40, stroke: 3, fontSize: '0.625rem' },
    md: { size: 56, stroke: 4, fontSize: '0.75rem' },
    lg: { size: 80, stroke: 5, fontSize: '1rem' },
};

const getAutoColor = (percentage: number): keyof typeof colorMap => {
    if (percentage >= 90) return 'rose';
    if (percentage >= 75) return 'amber';
    return 'emerald';
};

const ProgressRing: React.FC<ProgressRingProps> = ({
    value,
    max = 100,
    size = 'md',
    strokeWidth,
    showValue = true,
    showLabel = false,
    label,
    color = 'cyan',
    animated = true,
    className,
}) => {
    const [animatedValue, setAnimatedValue] = useState(0);
    
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    const displayPercentage = animated ? animatedValue : percentage;
    
    const sizeConfig = sizeMap[size];
    const actualSize = sizeConfig.size;
    const actualStrokeWidth = strokeWidth || sizeConfig.stroke;
    
    const radius = (actualSize - actualStrokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (displayPercentage / 100) * circumference;
    
    const actualColor = color === 'auto' ? getAutoColor(percentage) : color;
    const colorConfig = colorMap[actualColor];
    const gradientId = `progress-gradient-${actualColor}-${Math.random().toString(36).substr(2, 9)}`;

    useEffect(() => {
        if (!animated) return;
        
        const duration = 600;
        const startTime = Date.now();
        const startValue = animatedValue;
        const endValue = percentage;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out-expo)
            const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            const currentValue = startValue + (endValue - startValue) * easeOutExpo;
            setAnimatedValue(currentValue);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }, [percentage, animated]);

    return (
        <div className={classNames('relative inline-flex flex-col items-center', className)}>
            <svg
                width={actualSize}
                height={actualSize}
                className="transform -rotate-90"
                style={{ filter: colorConfig.glow }}
            >
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={colorConfig.gradient[0]} />
                        <stop offset="100%" stopColor={colorConfig.gradient[1]} />
                    </linearGradient>
                </defs>
                
                {/* Background circle */}
                <circle
                    cx={actualSize / 2}
                    cy={actualSize / 2}
                    r={radius}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth={actualStrokeWidth}
                />
                
                {/* Progress circle */}
                <circle
                    cx={actualSize / 2}
                    cy={actualSize / 2}
                    r={radius}
                    fill="none"
                    stroke={`url(#${gradientId})`}
                    strokeWidth={actualStrokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300 ease-out"
                    style={{
                        transition: animated ? 'none' : 'stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                />
            </svg>
            
            {showValue && (
                <div
                    className="absolute inset-0 flex items-center justify-center font-semibold text-white"
                    style={{ fontSize: sizeConfig.fontSize }}
                >
                    {Math.round(displayPercentage)}%
                </div>
            )}
            
            {showLabel && label && (
                <span className="mt-1 text-xs text-neutral-400 font-medium">{label}</span>
            )}
        </div>
    );
};

export default ProgressRing;
