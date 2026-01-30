import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

interface AnimatedCounterProps {
    value: number;
    duration?: number;
    decimals?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
    formatValue?: (value: number) => string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
    value,
    duration = 500,
    decimals = 0,
    prefix = '',
    suffix = '',
    className,
    formatValue,
}) => {
    const [displayValue, setDisplayValue] = useState(0);
    const previousValue = useRef(0);
    const animationRef = useRef<number>();

    useEffect(() => {
        const startValue = previousValue.current;
        const endValue = value;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out-expo)
            const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            const currentValue = startValue + (endValue - startValue) * easeOutExpo;
            setDisplayValue(currentValue);

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                previousValue.current = endValue;
            }
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [value, duration]);

    const formattedValue = formatValue 
        ? formatValue(displayValue)
        : displayValue.toFixed(decimals);

    return (
        <span className={classNames('tabular-nums', className)}>
            {prefix}{formattedValue}{suffix}
        </span>
    );
};

export default AnimatedCounter;
