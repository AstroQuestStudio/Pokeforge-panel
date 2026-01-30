import React from 'react';
import classNames from 'classnames';

interface SkeletonLoaderProps {
    type?: 'text' | 'title' | 'circle' | 'card' | 'button' | 'avatar';
    lines?: number;
    width?: string;
    height?: string;
    className?: string;
    animated?: boolean;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    type = 'text',
    lines = 1,
    width,
    height,
    className,
    animated = true,
}) => {
    const baseClasses = classNames(
        'bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800',
        'rounded',
        {
            'animate-shimmer bg-[length:200%_100%]': animated,
        },
        className
    );

    const renderSkeleton = () => {
        switch (type) {
            case 'text':
                return (
                    <div className="space-y-2">
                        {Array.from({ length: lines }).map((_, i) => (
                            <div
                                key={i}
                                className={classNames(baseClasses, 'h-4')}
                                style={{
                                    width: width || (i === lines - 1 && lines > 1 ? '75%' : '100%'),
                                    animationDelay: `${i * 100}ms`,
                                }}
                            />
                        ))}
                    </div>
                );

            case 'title':
                return (
                    <div
                        className={classNames(baseClasses, 'h-6')}
                        style={{ width: width || '60%' }}
                    />
                );

            case 'circle':
                return (
                    <div
                        className={classNames(baseClasses, 'rounded-full')}
                        style={{
                            width: width || '40px',
                            height: height || width || '40px',
                        }}
                    />
                );

            case 'avatar':
                return (
                    <div
                        className={classNames(baseClasses, 'rounded-full')}
                        style={{
                            width: width || '48px',
                            height: height || width || '48px',
                        }}
                    />
                );

            case 'card':
                return (
                    <div
                        className={classNames(
                            'glass-card rounded-xl overflow-hidden',
                            className
                        )}
                        style={{ width, height: height || '120px' }}
                    >
                        <div className="p-4 space-y-3">
                            <div className={classNames(baseClasses, 'h-5 w-3/4')} />
                            <div className={classNames(baseClasses, 'h-4 w-full')} />
                            <div className={classNames(baseClasses, 'h-4 w-5/6')} />
                            <div className="flex gap-4 mt-4">
                                <div className={classNames(baseClasses, 'h-8 w-20 rounded-lg')} />
                                <div className={classNames(baseClasses, 'h-8 w-20 rounded-lg')} />
                            </div>
                        </div>
                    </div>
                );

            case 'button':
                return (
                    <div
                        className={classNames(baseClasses, 'h-10 rounded-lg')}
                        style={{ width: width || '100px' }}
                    />
                );

            default:
                return (
                    <div
                        className={baseClasses}
                        style={{ width: width || '100%', height: height || '16px' }}
                    />
                );
        }
    };

    return renderSkeleton();
};

// Preset skeleton components for common use cases
export const ServerCardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
    <div className={classNames('glass-card rounded-xl p-4', className)}>
        <div className="flex items-center gap-4">
            {/* Icon */}
            <SkeletonLoader type="circle" width="48px" />
            
            {/* Content */}
            <div className="flex-1 space-y-2">
                <SkeletonLoader type="title" width="200px" />
                <SkeletonLoader type="text" width="150px" />
            </div>
            
            {/* Stats */}
            <div className="hidden md:flex gap-6">
                <SkeletonLoader type="circle" width="48px" />
                <SkeletonLoader type="circle" width="48px" />
                <SkeletonLoader type="circle" width="48px" />
            </div>
            
            {/* Status */}
            <SkeletonLoader type="button" width="80px" />
        </div>
    </div>
);

export const StatBlockSkeleton: React.FC<{ className?: string }> = ({ className }) => (
    <div className={classNames('glass-card rounded-xl p-4', className)}>
        <div className="flex items-center gap-3">
            <SkeletonLoader type="circle" width="40px" />
            <div className="flex-1 space-y-1">
                <SkeletonLoader type="text" width="60%" />
                <SkeletonLoader type="title" width="80%" />
            </div>
        </div>
    </div>
);

export const ChartSkeleton: React.FC<{ className?: string }> = ({ className }) => (
    <div className={classNames('glass-card rounded-xl p-4', className)}>
        <div className="flex items-center justify-between mb-4">
            <SkeletonLoader type="title" width="100px" />
            <SkeletonLoader type="button" width="60px" />
        </div>
        <div className="h-32 flex items-end gap-1">
            {Array.from({ length: 20 }).map((_, i) => (
                <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-neutral-800 to-neutral-700 rounded-t animate-shimmer"
                    style={{
                        height: `${30 + Math.random() * 70}%`,
                        animationDelay: `${i * 50}ms`,
                    }}
                />
            ))}
        </div>
    </div>
);

export default SkeletonLoader;
