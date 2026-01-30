import React from 'react';
import Icon from '@/components/elements/Icon';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import styles from './style.module.css';
import useFitText from 'use-fit-text';
import CopyOnClick from '@/components/elements/CopyOnClick';

interface StatBlockProps {
    title: string;
    copyOnClick?: string;
    color?: string | undefined;
    icon: IconDefinition;
    children: React.ReactNode;
    className?: string;
}

const getStatusBarClass = (color: string | undefined) => {
    switch (color) {
        case 'bg-red-500':
            return 'status-bar-offline';
        case 'bg-yellow-500':
            return 'status-bar-starting';
        case 'bg-green-500':
            return 'status-bar-online';
        default:
            return 'bg-neutral-600';
    }
};

export default ({ title, copyOnClick, icon, color, className, children }: StatBlockProps) => {
    const { fontSize, ref } = useFitText({ minFontSize: 8, maxFontSize: 500 });

    return (
        <CopyOnClick text={copyOnClick}>
            <div className={classNames(styles.stat_block, 'group', className)}>
                {/* Status Bar */}
                <div
                    className={classNames(
                        styles.status_bar,
                        getStatusBarClass(color),
                        'transition-all duration-300'
                    )}
                />
                
                {/* Icon */}
                <div
                    className={classNames(
                        styles.icon,
                        'transition-all duration-300'
                    )}
                >
                    <Icon
                        icon={icon}
                        className={classNames(
                            'transition-all duration-300',
                            color === 'bg-red-500' ? 'text-red-400' :
                            color === 'bg-yellow-500' ? 'text-amber-400' :
                            color === 'bg-green-500' ? 'text-emerald-400' :
                            'text-neutral-400 group-hover:text-cyan-400'
                        )}
                    />
                </div>
                
                {/* Content */}
                <div className="flex flex-col justify-center overflow-hidden w-full min-w-0">
                    <p
                        className={classNames(
                            'font-header font-medium leading-tight text-xs md:text-sm',
                            'text-neutral-400 transition-colors duration-200',
                            'group-hover:text-neutral-300'
                        )}
                    >
                        {title}
                    </p>
                    <div
                        ref={ref}
                        className={classNames(
                            'h-[1.75rem] w-full font-semibold truncate',
                            'text-white transition-colors duration-200'
                        )}
                        style={{ fontSize }}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </CopyOnClick>
    );
};
