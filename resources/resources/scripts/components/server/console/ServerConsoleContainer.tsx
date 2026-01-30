import React, { memo } from 'react';
import { ServerContext } from '@/state/server';
import Can from '@/components/elements/Can';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import isEqual from 'react-fast-compare';
import Spinner from '@/components/elements/Spinner';
import Features from '@feature/Features';
import Console from '@/components/server/console/Console';
import StatGraphs from '@/components/server/console/StatGraphs';
import PowerButtons from '@/components/server/console/PowerButtons';
import ServerDetailsBlock from '@/components/server/console/ServerDetailsBlock';
import { Alert } from '@/components/elements/alert';
import classNames from 'classnames';
import {
    ExclamationTriangleIcon,
    ServerIcon,
} from '@heroicons/react/24/outline';

export type PowerAction = 'start' | 'stop' | 'restart' | 'kill';

const ServerConsoleContainer = () => {
    const name = ServerContext.useStoreState((state) => state.server.data!.name);
    const description = ServerContext.useStoreState((state) => state.server.data!.description);
    const isInstalling = ServerContext.useStoreState((state) => state.server.isInstalling);
    const isTransferring = ServerContext.useStoreState((state) => state.server.data!.isTransferring);
    const eggFeatures = ServerContext.useStoreState((state) => state.server.data!.eggFeatures, isEqual);
    const isNodeUnderMaintenance = ServerContext.useStoreState((state) => state.server.data!.isNodeUnderMaintenance);
    const status = ServerContext.useStoreState((state) => state.status.value);

    const getStatusConfig = () => {
        switch (status) {
            case 'running':
                return { color: 'text-emerald-400', bg: 'bg-emerald-500', label: 'Online' };
            case 'starting':
                return { color: 'text-amber-400', bg: 'bg-amber-500', label: 'Starting' };
            case 'stopping':
                return { color: 'text-amber-400', bg: 'bg-amber-500', label: 'Stopping' };
            default:
                return { color: 'text-red-400', bg: 'bg-red-500', label: 'Offline' };
        }
    };

    const statusConfig = getStatusConfig();

    return (
        <ServerContentBlock title="Console">
            {/* Alert Messages */}
            {(isNodeUnderMaintenance || isInstalling || isTransferring) && (
                <div
                    className={classNames(
                        'mb-4 p-4 rounded-xl',
                        'glass border border-amber-500/30',
                        'flex items-center gap-3',
                        'animate-fade-in'
                    )}
                >
                    <ExclamationTriangleIcon className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <p className="text-sm text-amber-200">
                        {isNodeUnderMaintenance
                            ? 'The node of this server is currently under maintenance and all actions are unavailable.'
                            : isInstalling
                            ? 'This server is currently running its installation process and most actions are unavailable.'
                            : 'This server is currently being transferred to another node and all actions are unavailable.'}
                    </p>
                </div>
            )}

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 animate-fade-in">
                <div className="flex items-center gap-4">
                    {/* Server Icon */}
                    <div
                        className={classNames(
                            'hidden sm:flex items-center justify-center',
                            'w-14 h-14 rounded-xl',
                            'bg-gradient-to-br from-neutral-700/50 to-neutral-800/50',
                            'border border-neutral-600/30'
                        )}
                    >
                        <ServerIcon className="w-7 h-7 text-neutral-400" />
                    </div>

                    {/* Server Name & Description */}
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="font-header font-bold text-2xl text-white leading-tight line-clamp-1">
                                {name}
                            </h1>
                            {/* Status Badge */}
                            <span
                                className={classNames(
                                    'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                                    'border',
                                    status === 'running' && 'bg-emerald-500/10 border-emerald-500/30',
                                    status === 'starting' && 'bg-amber-500/10 border-amber-500/30',
                                    status === 'stopping' && 'bg-amber-500/10 border-amber-500/30',
                                    (!status || status === 'offline') && 'bg-red-500/10 border-red-500/30'
                                )}
                            >
                                <span
                                    className={classNames(
                                        'w-1.5 h-1.5 rounded-full',
                                        statusConfig.bg,
                                        status === 'running' && 'animate-status-online',
                                        (status === 'starting' || status === 'stopping') && 'animate-status-warning',
                                        (!status || status === 'offline') && 'animate-status-offline'
                                    )}
                                />
                                <span className={statusConfig.color}>{statusConfig.label}</span>
                            </span>
                        </div>
                        {description && (
                            <p className="text-sm text-neutral-400 mt-1 line-clamp-1 max-w-lg">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Power Buttons */}
                <Can action={['control.start', 'control.stop', 'control.restart']} matchAny>
                    <PowerButtons className="flex-shrink-0" />
                </Can>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
                {/* Console */}
                <div className="lg:col-span-3">
                    <Spinner.Suspense>
                        <Console />
                    </Spinner.Suspense>
                </div>

                {/* Server Details */}
                <ServerDetailsBlock className="lg:col-span-1" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Spinner.Suspense>
                    <StatGraphs />
                </Spinner.Suspense>
            </div>

            <Features enabled={eggFeatures} />
        </ServerContentBlock>
    );
};

export default memo(ServerConsoleContainer, isEqual);
