import React, { memo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Server } from '@/api/server/getServer';
import getServerResourceUsage, { ServerPowerState, ServerStats } from '@/api/server/getServerResourceUsage';
import { bytesToString, ip, mbToBytes } from '@/lib/formatters';
import classNames from 'classnames';
import isEqual from 'react-fast-compare';
import ProgressRing from '@/components/elements/ProgressRing';
import {
    ServerIcon,
    GlobeAltIcon,
    CpuChipIcon,
    CircleStackIcon,
    SignalIcon,
} from '@heroicons/react/24/outline';
import { PlayIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

const isAlarmState = (current: number, limit: number): boolean => limit > 0 && current / (limit * 1024 * 1024) >= 0.9;

const getStatusConfig = (status: ServerPowerState | undefined) => {
    switch (status) {
        case 'running':
            return {
                label: 'Online',
                dotClass: 'bg-emerald-500',
                barClass: 'status-bar-online',
                animation: 'animate-status-online',
                textClass: 'text-emerald-400',
            };
        case 'starting':
            return {
                label: 'Starting',
                dotClass: 'bg-amber-500',
                barClass: 'status-bar-starting',
                animation: 'animate-status-warning',
                textClass: 'text-amber-400',
            };
        case 'stopping':
            return {
                label: 'Stopping',
                dotClass: 'bg-amber-500',
                barClass: 'status-bar-starting',
                animation: 'animate-status-warning',
                textClass: 'text-amber-400',
            };
        default:
            return {
                label: 'Offline',
                dotClass: 'bg-red-500',
                barClass: 'status-bar-offline',
                animation: 'animate-status-offline',
                textClass: 'text-red-400',
            };
    }
};

type Timer = ReturnType<typeof setInterval>;

const ServerRow = memo(({ server, className, index = 0 }: { server: Server; className?: string; index?: number }) => {
    const interval = useRef<Timer>(null) as React.MutableRefObject<Timer>;
    const [isSuspended, setIsSuspended] = useState(server.status === 'suspended');
    const [stats, setStats] = useState<ServerStats | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    const getStats = () =>
        getServerResourceUsage(server.uuid)
            .then((data) => setStats(data))
            .catch((error) => console.error(error));

    useEffect(() => {
        setIsSuspended(stats?.isSuspended || server.status === 'suspended');
    }, [stats?.isSuspended, server.status]);

    useEffect(() => {
        if (isSuspended) return;

        getStats().then(() => {
            interval.current = setInterval(() => getStats(), 30000);
        });

        return () => {
            interval.current && clearInterval(interval.current);
        };
    }, [isSuspended]);

    const alarms = { cpu: false, memory: false, disk: false };
    if (stats) {
        alarms.cpu = server.limits.cpu === 0 ? false : stats.cpuUsagePercent >= server.limits.cpu * 0.9;
        alarms.memory = isAlarmState(stats.memoryUsageInBytes, server.limits.memory);
        alarms.disk = server.limits.disk === 0 ? false : isAlarmState(stats.diskUsageInBytes, server.limits.disk);
    }

    const cpuPercent = stats ? Math.min(100, (stats.cpuUsagePercent / (server.limits.cpu || 100)) * 100) : 0;
    const memoryPercent = stats
        ? Math.min(100, (stats.memoryUsageInBytes / mbToBytes(server.limits.memory || 1024)) * 100)
        : 0;
    const diskPercent = stats
        ? Math.min(100, (stats.diskUsageInBytes / mbToBytes(server.limits.disk || 1024)) * 100)
        : 0;

    const statusConfig = getStatusConfig(stats?.status);
    const allocation = server.allocations.find((alloc) => alloc.isDefault);
    const addressText = allocation ? `${allocation.alias || ip(allocation.ip)}:${allocation.port}` : 'N/A';

    return (
        <Link
            to={`/server/${server.id}`}
            className={classNames(
                'block relative overflow-hidden',
                'glass-card rounded-xl',
                'transition-all duration-300 ease-out',
                'hover:scale-[1.01] hover:shadow-elevation-3',
                'animate-fade-in-up',
                'group',
                className
            )}
            style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'both' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Status Bar */}
            <div
                className={classNames(
                    'absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-all duration-300',
                    statusConfig.barClass,
                    { 'w-1.5': isHovered }
                )}
            />

            <div className="flex items-center gap-4 p-4 pl-5">
                {/* Server Icon */}
                <div
                    className={classNames(
                        'flex-shrink-0 flex items-center justify-center',
                        'w-12 h-12 rounded-xl',
                        'bg-gradient-to-br from-neutral-700/50 to-neutral-800/50',
                        'border border-neutral-600/30',
                        'transition-all duration-300',
                        'group-hover:from-cyan-500/20 group-hover:to-violet-500/20',
                        'group-hover:border-cyan-500/30'
                    )}
                >
                    <ServerIcon className="w-6 h-6 text-neutral-400 group-hover:text-cyan-400 transition-colors duration-300" />
                </div>

                {/* Server Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-white truncate group-hover:text-cyan-100 transition-colors">
                            {server.name}
                        </h3>
                        {/* Status Badge */}
                        <span
                            className={classNames(
                                'flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium',
                                'border',
                                {
                                    'bg-emerald-500/10 border-emerald-500/30': stats?.status === 'running',
                                    'bg-amber-500/10 border-amber-500/30':
                                        stats?.status === 'starting' || stats?.status === 'stopping',
                                    'bg-red-500/10 border-red-500/30': !stats?.status || stats?.status === 'offline',
                                }
                            )}
                        >
                            <span
                                className={classNames(
                                    'w-1.5 h-1.5 rounded-full',
                                    statusConfig.dotClass,
                                    statusConfig.animation
                                )}
                            />
                            <span className={statusConfig.textClass}>{statusConfig.label}</span>
                        </span>
                    </div>

                    {/* Description & Address */}
                    <div className="flex items-center gap-3 mt-1">
                        {server.description && (
                            <p className="text-sm text-neutral-400 truncate max-w-[200px]">{server.description}</p>
                        )}
                        <div className="flex items-center gap-1 text-xs text-neutral-500">
                            <GlobeAltIcon className="w-3.5 h-3.5" />
                            <span className="font-mono">{addressText}</span>
                        </div>
                    </div>
                </div>

                {/* Resource Stats */}
                {!isSuspended && stats && (
                    <div className="hidden md:flex items-center gap-6">
                        {/* CPU */}
                        <div className="flex flex-col items-center">
                            <ProgressRing
                                value={cpuPercent}
                                size="sm"
                                color={alarms.cpu ? 'rose' : 'cyan'}
                                showValue
                            />
                            <span className="mt-1 text-xs text-neutral-500 flex items-center gap-1">
                                <CpuChipIcon className="w-3 h-3" />
                                CPU
                            </span>
                        </div>

                        {/* Memory */}
                        <div className="flex flex-col items-center">
                            <ProgressRing
                                value={memoryPercent}
                                size="sm"
                                color={alarms.memory ? 'rose' : 'violet'}
                                showValue
                            />
                            <span className="mt-1 text-xs text-neutral-500 flex items-center gap-1">
                                <SignalIcon className="w-3 h-3" />
                                RAM
                            </span>
                        </div>

                        {/* Disk */}
                        <div className="flex flex-col items-center">
                            <ProgressRing
                                value={diskPercent}
                                size="sm"
                                color={alarms.disk ? 'rose' : 'emerald'}
                                showValue
                            />
                            <span className="mt-1 text-xs text-neutral-500 flex items-center gap-1">
                                <CircleStackIcon className="w-3 h-3" />
                                Disk
                            </span>
                        </div>
                    </div>
                )}

                {/* Suspended/Installing Badge */}
                {isSuspended && (
                    <div className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30">
                        <span className="text-xs font-medium text-red-400">
                            {server.status === 'suspended' ? 'Suspended' : 'Connection Error'}
                        </span>
                    </div>
                )}

                {!isSuspended && !stats && (server.isTransferring || server.status) && (
                    <div className="px-3 py-1.5 rounded-lg bg-neutral-500/20 border border-neutral-500/30">
                        <span className="text-xs font-medium text-neutral-400">
                            {server.isTransferring
                                ? 'Transferring'
                                : server.status === 'installing'
                                ? 'Installing'
                                : server.status === 'restoring_backup'
                                ? 'Restoring Backup'
                                : 'Unavailable'}
                        </span>
                    </div>
                )}

                {/* Loading State */}
                {!isSuspended && !stats && !server.isTransferring && !server.status && (
                    <div className="flex items-center gap-2 text-neutral-500">
                        <div className="w-5 h-5 border-2 border-neutral-600 border-t-cyan-400 rounded-full animate-spin" />
                    </div>
                )}

                {/* Quick Actions (visible on hover) */}
                <div
                    className={classNames(
                        'hidden lg:flex items-center gap-2 transition-all duration-300',
                        isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                    )}
                >
                    <button
                        className={classNames(
                            'p-2 rounded-lg',
                            'bg-emerald-500/10 border border-emerald-500/30',
                            'text-emerald-400 hover:bg-emerald-500/20',
                            'transition-all duration-200'
                        )}
                        onClick={(e) => e.preventDefault()}
                        title="Start"
                    >
                        <PlayIcon className="w-4 h-4" />
                    </button>
                    <button
                        className={classNames(
                            'p-2 rounded-lg',
                            'bg-cyan-500/10 border border-cyan-500/30',
                            'text-cyan-400 hover:bg-cyan-500/20',
                            'transition-all duration-200'
                        )}
                        onClick={(e) => e.preventDefault()}
                        title="Restart"
                    >
                        <ArrowPathIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </Link>
    );
}, isEqual);

export default ServerRow;
