import React from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

interface SubNavigationProps {
    children: React.ReactNode;
    className?: string;
}

interface SubNavigationLinkProps {
    to: string;
    exact?: boolean;
    children: React.ReactNode;
    className?: string;
}

const SubNavigationLink: React.FC<SubNavigationLinkProps> = ({ to, exact, children, className }) => {
    return (
        <NavLink
            to={to}
            end={exact}
            className={({ isActive }) =>
                classNames(
                    'relative inline-flex items-center px-4 py-2.5',
                    'text-sm font-medium whitespace-nowrap',
                    'transition-all duration-200 ease-out',
                    'rounded-lg',
                    'group',
                    {
                        'text-white bg-white/10': isActive,
                        'text-neutral-400 hover:text-white hover:bg-white/5': !isActive,
                    },
                    className
                )
            }
        >
            {({ isActive }) => (
                <>
                    {children}
                    {isActive && (
                        <span
                            className={classNames(
                                'absolute bottom-0 left-1/2 -translate-x-1/2',
                                'w-6 h-0.5 rounded-full',
                                'bg-gradient-to-r from-cyan-400 to-violet-500',
                                'animate-fade-in'
                            )}
                        />
                    )}
                </>
            )}
        </NavLink>
    );
};

const SubNavigation: React.FC<SubNavigationProps> & {
    Link: typeof SubNavigationLink;
} = ({ children, className }) => {
    return (
        <div
            className={classNames(
                'w-full glass-dark shadow-md overflow-x-auto',
                className
            )}
        >
            <div className="flex items-center gap-1 mx-auto max-w-[1400px] px-4 py-2">
                {children}
            </div>
        </div>
    );
};

SubNavigation.Link = SubNavigationLink;

export default SubNavigation;
