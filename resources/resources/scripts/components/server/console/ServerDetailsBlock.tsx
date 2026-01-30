import React, { useEffect, useMemo, useState, memo } from 'react';
import {
    faClock,
    faCloudDownloadAlt,
    faCloudUploadAlt,
    faHdd,
    faMemory,
    faMicrochip,
    faWifi,
} from '@fortawesome/free-solid-svg-icons';
import { bytesToString, ip, mbToBytes } from '@/lib/formatters';
import { ServerContext } from '@/state/server';
import { SocketEvent, SocketRequest } from '@/components/server/events';
import UptimeDuration from '@/components/server/UptimeDuration';
import StatBlock from '@/components/server/console/StatBlock';
import useWebsocketEvent from '@/plugins/useWebsocketEvent';
import classNames from 'classnames';
import { capitalize } from '@/lib/strings';

type Stats = Record<'memory' | 'cpu' | 'disk' | 'uptime' | 'rx' | 'tx', number>;

const getBackgroundColor = (value: number, max: number | null): string | undefined => {
    const delta = !max ? 0 : value / max;

    if (delta > 0.8) {
        if (delta > 0.9) {
            return 'bg-red-500';
        }
        return 'bg-yellow-500';
    }

    return undefined;
};

const Limit = ({ limit, children }: { limit: string | null; children: React.ReactNode }) => (
    <>
        {children}
        <span className="ml-1 text-neutral-400 text-[70%] select-none opacity-70">/ {limit || <>&infin;</>}</span>
    </>
);

const ServerDetailsBlock = memo(({ className }: { className?: string }) => {
    const [stats, setStats] = useState<Stats>({ memory: 0, cpu: 0, disk: 0, uptime: 0, tx: 0, rx: 0 });

    const status = ServerContext.useStoreState((state) => state.status.value);
    const connected = ServerContext.useStoreState((state) => state.socket.connected);
    const instance = ServerContext.useStoreState((state) => state.socket.instance);
    const limits = ServerContext.useStoreState((state) => state.server.data!.limits);

    const textLimits = useMemo(
        () => ({
            cpu: limits?.cpu ? `${limits.cpu}%` : null,
            memory: limits?.memory ? bytesToString(mbToBytes(limits.memory)) : null,
            disk: limits?.disk ? bytesToString(mbToBytes(limits.disk)) : null,
        }),
        [limits]
    );

    const allocation = ServerContext.useStoreState((state) => {
        const match = state.server.data!.allocations.find((allocation) => allocation.isDefault);
        return !match ? 'n/a' : `${match.alias || ip(match.ip)}:${match.port}`;
    });

    useEffect(() => {
        if (!connected || !instance) {
            return;
        }
        instance.send(SocketRequest.SEND_STATS);
    }, [instance, connected]);

    useWebsocketEvent(SocketEvent.STATS, (data) => {
        let stats: any = {};
        try {
            stats = JSON.parse(data);
        } catch (e) {
            return;
        }

        setStats({
            memory: stats.memory_bytes,
            cpu: stats.cpu_absolute,
            disk: stats.disk_bytes,
            tx: stats.network.tx_bytes,
            rx: stats.network.rx_bytes,
            uptime: stats.uptime || 0,
        });
    });

    return (
        <div className={classNames('grid grid-cols-6 gap-3', className)}>
            <StatBlock 
                icon={faWifi} 
                title="Address" 
                copyOnClick={allocation}
                className="animate-fade-in stagger-1"
            >
                <span className="font-mono text-sm">{allocation}</span>
            </StatBlock>
            
            <StatBlock
                icon={faClock}
                title="Uptime"
                color={getBackgroundColor(status === 'running' ? 0 : status !== 'offline' ? 9 : 10, 10)}
                className="animate-fade-in stagger-2"
            >
                {status === null ? (
                    <span className="text-neutral-500">Offline</span>
                ) : stats.uptime > 0 ? (
                    <UptimeDuration uptime={stats.uptime / 1000} />
                ) : (
                    <span className={classNames(
                        status === 'running' ? 'text-emerald-400' :
                        status === 'offline' ? 'text-red-400' :
                        'text-amber-400'
                    )}>
                        {capitalize(status)}
                    </span>
                )}
            </StatBlock>
            
            <StatBlock 
                icon={faMicrochip} 
                title="CPU Load" 
                color={getBackgroundColor(stats.cpu, limits.cpu)}
                className="animate-fade-in stagger-3"
            >
                {status === 'offline' ? (
                    <span className="text-neutral-500">Offline</span>
                ) : (
                    <Limit limit={textLimits.cpu}>
                        <span className="tabular-nums">{stats.cpu.toFixed(2)}%</span>
                    </Limit>
                )}
            </StatBlock>
            
            <StatBlock
                icon={faMemory}
                title="Memory"
                color={getBackgroundColor(stats.memory / 1024, limits.memory * 1024)}
                className="animate-fade-in stagger-4"
            >
                {status === 'offline' ? (
                    <span className="text-neutral-500">Offline</span>
                ) : (
                    <Limit limit={textLimits.memory}>
                        <span className="tabular-nums">{bytesToString(stats.memory)}</span>
                    </Limit>
                )}
            </StatBlock>
            
            <StatBlock 
                icon={faHdd} 
                title="Disk" 
                color={getBackgroundColor(stats.disk / 1024, limits.disk * 1024)}
                className="animate-fade-in stagger-5"
            >
                <Limit limit={textLimits.disk}>
                    <span className="tabular-nums">{bytesToString(stats.disk)}</span>
                </Limit>
            </StatBlock>
            
            <StatBlock 
                icon={faCloudDownloadAlt} 
                title="Network (In)"
                className="animate-fade-in stagger-6"
            >
                {status === 'offline' ? (
                    <span className="text-neutral-500">Offline</span>
                ) : (
                    <span className="tabular-nums">{bytesToString(stats.rx)}</span>
                )}
            </StatBlock>
            
            <StatBlock 
                icon={faCloudUploadAlt} 
                title="Network (Out)"
                className="animate-fade-in stagger-7"
            >
                {status === 'offline' ? (
                    <span className="text-neutral-500">Offline</span>
                ) : (
                    <span className="tabular-nums">{bytesToString(stats.tx)}</span>
                )}
            </StatBlock>
        </div>
    );
});

ServerDetailsBlock.displayName = 'ServerDetailsBlock';

export default ServerDetailsBlock;
