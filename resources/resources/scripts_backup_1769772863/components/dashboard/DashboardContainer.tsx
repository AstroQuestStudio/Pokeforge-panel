import React, { useEffect, useState } from 'react';
import { Server } from '@/api/server/getServer';
import getServers from '@/api/getServers';
import ServerRow from '@/components/dashboard/ServerRow';
import PageContentBlock from '@/components/elements/PageContentBlock';
import useFlash from '@/plugins/useFlash';
import { useStoreState } from 'easy-peasy';
import { usePersistedState } from '@/plugins/usePersistedState';
import Switch from '@/components/elements/Switch';
import useSWR from 'swr';
import { PaginatedResult } from '@/api/http';
import Pagination from '@/components/elements/Pagination';
import { useLocation } from 'react-router-dom';
import { ServerCardSkeleton } from '@/components/elements/SkeletonLoader';
import classNames from 'classnames';
import {
    ServerStackIcon,
    SparklesIcon,
} from '@heroicons/react/24/outline';

export default () => {
    const { search } = useLocation();
    const defaultPage = Number(new URLSearchParams(search).get('page') || '1');

    const [page, setPage] = useState(!isNaN(defaultPage) && defaultPage > 0 ? defaultPage : 1);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const uuid = useStoreState((state) => state.user.data!.uuid);
    const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
    const userName = useStoreState((state) => state.user.data!.username);
    const [showOnlyAdmin, setShowOnlyAdmin] = usePersistedState(`${uuid}:show_all_servers`, false);

    const { data: servers, error } = useSWR<PaginatedResult<Server>>(
        ['/api/client/servers', showOnlyAdmin && rootAdmin, page],
        () => getServers({ page, type: showOnlyAdmin && rootAdmin ? 'admin' : undefined })
    );

    useEffect(() => {
        if (!servers) return;
        if (servers.pagination.currentPage > 1 && !servers.items.length) {
            setPage(1);
        }
    }, [servers?.pagination.currentPage]);

    useEffect(() => {
        window.history.replaceState(null, document.title, `/${page <= 1 ? '' : `?page=${page}`}`);
    }, [page]);

    useEffect(() => {
        if (error) clearAndAddHttpError({ key: 'dashboard', error });
        if (!error) clearFlashes('dashboard');
    }, [error]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <PageContentBlock title={'Dashboard'} showFlashKey={'dashboard'}>
            {/* Welcome Header */}
            <div className="mb-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/30">
                        <SparklesIcon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            {getGreeting()}, <span className="text-gradient-primary">{userName}</span>
                        </h1>
                        <p className="text-sm text-neutral-400">
                            {servers?.items.length || 0} server{(servers?.items.length || 0) !== 1 ? 's' : ''} in your account
                        </p>
                    </div>
                </div>
            </div>

            {/* Admin Toggle */}
            {rootAdmin && (
                <div
                    className={classNames(
                        'mb-4 flex justify-end items-center gap-3',
                        'glass rounded-lg px-4 py-2',
                        'animate-fade-in'
                    )}
                    style={{ animationDelay: '100ms' }}
                >
                    <p className="text-xs text-neutral-400 uppercase tracking-wide">
                        {showOnlyAdmin ? "Others' servers" : 'Your servers'}
                    </p>
                    <Switch
                        name="show_all_servers"
                        defaultChecked={showOnlyAdmin}
                        onChange={() => setShowOnlyAdmin((s) => !s)}
                    />
                </div>
            )}

            {/* Server List */}
            {!servers ? (
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <ServerCardSkeleton
                            key={i}
                            className="animate-fade-in"
                            style={{ animationDelay: `${i * 100}ms` } as React.CSSProperties}
                        />
                    ))}
                </div>
            ) : (
                <Pagination data={servers} onPageSelect={setPage}>
                    {({ items }) =>
                        items.length > 0 ? (
                            <div className="space-y-3">
                                {items.map((server, index) => (
                                    <ServerRow key={server.uuid} server={server} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div
                                className={classNames(
                                    'glass-card rounded-xl p-12',
                                    'flex flex-col items-center justify-center text-center',
                                    'animate-fade-in'
                                )}
                            >
                                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-neutral-700/50 mb-4">
                                    <ServerStackIcon className="w-8 h-8 text-neutral-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">No servers found</h3>
                                <p className="text-sm text-neutral-400 max-w-sm">
                                    {showOnlyAdmin
                                        ? "There are no other servers to display."
                                        : "There are no servers associated with your account."}
                                </p>
                            </div>
                        )
                    }
                </Pagination>
            )}
        </PageContentBlock>
    );
};
