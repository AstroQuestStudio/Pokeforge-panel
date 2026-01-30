import * as React from 'react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import Avatar from '@/components/Avatar';
import classNames from 'classnames';
import {
    Squares2X2Icon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

export default () => {
    const name = useStoreState((state: ApplicationStore) => state.settings.data!.name);
    const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data!.rootAdmin);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            // @ts-expect-error this is valid
            window.location = '/';
        });
    };

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        classNames(
            'relative flex items-center justify-center h-full px-4 sm:px-5',
            'text-neutral-400 transition-all duration-200 ease-out',
            'hover:text-white hover:bg-white/5',
            'group',
            {
                'text-white': isActive,
            }
        );

    const activeIndicatorClasses = (isActive: boolean) =>
        classNames(
            'absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full',
            'bg-gradient-to-r from-cyan-400 to-violet-500',
            'transition-all duration-300 ease-out',
            isActive ? 'w-8 opacity-100' : 'w-0 opacity-0 group-hover:w-4 group-hover:opacity-50'
        );

    return (
        <nav className="w-full glass-nav sticky top-0 z-50 overflow-x-auto">
            <SpinnerOverlay visible={isLoggingOut} />
            <div className="mx-auto w-full flex items-center h-14 max-w-[1400px] px-4">
                {/* Logo */}
                <div className="flex-1">
                    <Link
                        to="/"
                        className={classNames(
                            'text-xl sm:text-2xl font-header font-semibold',
                            'text-white no-underline',
                            'transition-all duration-300 ease-out',
                            'hover:text-gradient-primary hover:scale-[1.02]',
                            'inline-block'
                        )}
                    >
                        <span className="bg-gradient-to-r from-white via-white to-neutral-300 bg-clip-text">
                            {name}
                        </span>
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className="flex h-full items-center">
                    <SearchContainer />

                    <Tooltip placement="bottom" content="Dashboard">
                        <NavLink to="/" end className={navLinkClasses}>
                            {({ isActive }) => (
                                <>
                                    <Squares2X2Icon className="w-5 h-5" />
                                    <div className={activeIndicatorClasses(isActive)} />
                                </>
                            )}
                        </NavLink>
                    </Tooltip>

                    {rootAdmin && (
                        <Tooltip placement="bottom" content="Admin Panel">
                            <a
                                href="/admin"
                                rel="noreferrer"
                                className={classNames(
                                    'relative flex items-center justify-center h-full px-4 sm:px-5',
                                    'text-neutral-400 transition-all duration-200 ease-out',
                                    'hover:text-white hover:bg-white/5',
                                    'group'
                                )}
                            >
                                <Cog6ToothIcon className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
                            </a>
                        </Tooltip>
                    )}

                    <Tooltip placement="bottom" content="Account Settings">
                        <NavLink to="/account" className={navLinkClasses}>
                            {({ isActive }) => (
                                <>
                                    <span className="relative flex items-center justify-center w-7 h-7 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-cyan-400/50 transition-all duration-300">
                                        <Avatar.User />
                                    </span>
                                    <div className={activeIndicatorClasses(isActive)} />
                                </>
                            )}
                        </NavLink>
                    </Tooltip>

                    <Tooltip placement="bottom" content="Sign Out">
                        <button
                            onClick={onTriggerLogout}
                            className={classNames(
                                'relative flex items-center justify-center h-full px-4 sm:px-5',
                                'text-neutral-400 transition-all duration-200 ease-out',
                                'hover:text-rose-400 hover:bg-rose-500/10',
                                'group'
                            )}
                        >
                            <ArrowRightOnRectangleIcon className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-200" />
                        </button>
                    </Tooltip>
                </div>
            </div>
        </nav>
    );
};
