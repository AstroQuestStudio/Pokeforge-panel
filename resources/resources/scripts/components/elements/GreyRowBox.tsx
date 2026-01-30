import React from 'react';
import classNames from 'classnames';

interface GreyRowBoxProps {
    $hoverable?: boolean;
    className?: string;
    children: React.ReactNode;
    as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
    [key: string]: any;
}

const GreyRowBox: React.FC<GreyRowBoxProps> = ({ 
    $hoverable = true, 
    className, 
    children, 
    as: Component = 'div',
    ...props 
}) => {
    return (
        <Component
            className={classNames(
                'flex rounded-xl no-underline text-neutral-200 items-center p-4',
                'overflow-hidden',
                // Glassmorphism
                'bg-gradient-to-br from-white/[0.05] to-white/[0.02]',
                'backdrop-blur-xl',
                'border border-white/[0.08]',
                'shadow-lg shadow-black/5',
                // Transitions
                'transition-all duration-300 ease-out',
                // Hover effects
                $hoverable && [
                    'hover:from-white/[0.08] hover:to-white/[0.04]',
                    'hover:border-white/[0.15]',
                    'hover:-translate-y-0.5',
                    'hover:shadow-xl hover:shadow-black/10',
                ],
                className
            )}
            {...props}
        >
            {children}
        </Component>
    );
};

// Icon container component for consistency
export const GreyRowBoxIcon: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
    children, 
    className 
}) => (
    <div 
        className={classNames(
            'rounded-xl w-12 h-12 flex items-center justify-center',
            'bg-gradient-to-br from-neutral-600/50 to-neutral-700/50',
            'border border-neutral-500/30',
            'mr-4',
            'transition-all duration-300',
            'group-hover:from-cyan-500/20 group-hover:to-violet-500/20',
            'group-hover:border-cyan-500/30',
            className
        )}
    >
        {children}
    </div>
);

export default GreyRowBox;
