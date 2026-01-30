import React, { Suspense } from 'react';
import classNames from 'classnames';
import ErrorBoundary from '@/components/elements/ErrorBoundary';

export type SpinnerSize = 'small' | 'base' | 'large';
export type SpinnerVariant = 'ring' | 'dots' | 'pulse';

interface Props {
    size?: SpinnerSize;
    centered?: boolean;
    isBlue?: boolean;
    variant?: SpinnerVariant;
    className?: string;
}

interface Spinner extends React.FC<Props> {
    Size: Record<'SMALL' | 'BASE' | 'LARGE', SpinnerSize>;
    Suspense: React.FC<Props>;
}

const sizeClasses = {
    small: 'w-4 h-4',
    base: 'w-8 h-8',
    large: 'w-12 h-12',
};

const borderClasses = {
    small: 'border-2',
    base: 'border-[3px]',
    large: 'border-4',
};

const RingSpinner: React.FC<Props> = ({ size = 'base', isBlue, className }) => (
    <div
        className={classNames(
            'rounded-full animate-spin',
            sizeClasses[size],
            borderClasses[size],
            isBlue 
                ? 'border-cyan-500/20 border-t-cyan-500' 
                : 'border-white/20 border-t-white',
            className
        )}
    />
);

const DotsSpinner: React.FC<Props> = ({ size = 'base', isBlue, className }) => {
    const dotSize = size === 'small' ? 'w-1.5 h-1.5' : size === 'large' ? 'w-3 h-3' : 'w-2 h-2';
    const gap = size === 'small' ? 'gap-1' : size === 'large' ? 'gap-2' : 'gap-1.5';
    const color = isBlue ? 'bg-cyan-400' : 'bg-white';
    
    return (
        <div className={classNames('flex items-center', gap, className)}>
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className={classNames(
                        dotSize,
                        'rounded-full',
                        color,
                        'animate-pulse'
                    )}
                    style={{
                        animationDelay: `${i * 150}ms`,
                        animationDuration: '1s',
                    }}
                />
            ))}
        </div>
    );
};

const PulseSpinner: React.FC<Props> = ({ size = 'base', isBlue, className }) => (
    <div
        className={classNames(
            'rounded-full',
            sizeClasses[size],
            isBlue ? 'bg-cyan-400/20' : 'bg-white/20',
            'relative',
            className
        )}
    >
        <div
            className={classNames(
                'absolute inset-0 rounded-full animate-ping',
                isBlue ? 'bg-cyan-400/40' : 'bg-white/40'
            )}
        />
        <div
            className={classNames(
                'absolute inset-2 rounded-full',
                isBlue ? 'bg-cyan-400' : 'bg-white'
            )}
        />
    </div>
);

const Spinner: Spinner = ({ centered, variant = 'ring', size = 'base', ...props }) => {
    const SpinnerComponent = variant === 'dots' ? DotsSpinner : variant === 'pulse' ? PulseSpinner : RingSpinner;
    
    return centered ? (
        <div 
            className={classNames(
                'flex justify-center items-center',
                size === 'large' ? 'm-20' : 'm-6'
            )}
        >
            <SpinnerComponent size={size} {...props} />
        </div>
    ) : (
        <SpinnerComponent size={size} {...props} />
    );
};

Spinner.displayName = 'Spinner';

Spinner.Size = {
    SMALL: 'small',
    BASE: 'base',
    LARGE: 'large',
};

Spinner.Suspense = ({ children, centered = true, size = Spinner.Size.LARGE, ...props }) => (
    <Suspense fallback={<Spinner centered={centered} size={size} {...props} />}>
        <ErrorBoundary>{children}</ErrorBoundary>
    </Suspense>
);
Spinner.Suspense.displayName = 'Spinner.Suspense';

export default Spinner;
