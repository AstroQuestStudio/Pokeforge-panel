import React from 'react';
import classNames from 'classnames';
import styles from '@/components/server/console/style.module.css';

interface ChartBlockProps {
    title: string;
    legend?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export default ({ title, legend, children, className }: ChartBlockProps) => (
    <div className={classNames(styles.chart_container, 'group animate-fade-in', className)}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2">
            <h3
                className={classNames(
                    'font-header font-medium text-sm',
                    'text-neutral-300 transition-colors duration-200',
                    'group-hover:text-white'
                )}
            >
                {title}
            </h3>
            {legend && (
                <div className="flex items-center gap-2 text-sm">
                    {legend}
                </div>
            )}
        </div>
        
        {/* Chart */}
        <div className="relative z-10 px-2 pb-2">
            {children}
        </div>
    </div>
);
