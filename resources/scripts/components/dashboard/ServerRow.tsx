import React, { memo, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthernet, faHdd, faMemory, faMicrochip, faServer } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Server } from '@/api/server/getServer';
import getServerResourceUsage, { ServerPowerState, ServerStats } from '@/api/server/getServerResourceUsage';
import { bytesToString, ip, mbToBytes } from '@/lib/formatters';
import tw from 'twin.macro';
import Spinner from '@/components/elements/Spinner';
import styled, { keyframes } from 'styled-components/macro';
import isEqual from 'react-fast-compare';

const pulseGlow = keyframes`
    0%, 100% { opacity: 0.6; box-shadow: 0 0 10px 2px currentColor; }
    50% { opacity: 1; box-shadow: 0 0 20px 4px currentColor; }
`;

const isAlarmState = (current: number, limit: number): boolean => limit > 0 && current / (limit * 1024 * 1024) >= 0.9;

const Icon = memo(
    styled(FontAwesomeIcon)<{ $alarm: boolean }>`
        ${tw`text-lg transition-all duration-300`};
        color: ${(props) => (props.$alarm ? 'hsl(0, 75%, 60%)' : 'hsl(185, 80%, 55%)')};
        filter: ${(props) => props.$alarm 
            ? 'drop-shadow(0 0 6px hsla(0, 75%, 60%, 0.5))' 
            : 'drop-shadow(0 0 4px hsla(185, 80%, 55%, 0.3))'};
    `,
    isEqual
);

const IconDescription = styled.p<{ $alarm: boolean }>`
    ${tw`text-sm ml-2 font-medium`};
    color: ${(props) => (props.$alarm ? 'hsl(0, 90%, 75%)' : 'hsl(220, 10%, 85%)')};
`;

const StatusIndicatorBox = styled(Link)<{ $status: ServerPowerState | undefined }>`
    ${tw`grid grid-cols-12 gap-4 relative rounded-xl p-5 transition-all duration-300 no-underline`};
    
    background: linear-gradient(135deg, 
        hsla(220, 30%, 14%, 0.8) 0%, 
        hsla(240, 25%, 12%, 0.9) 100%
    );
    backdrop-filter: blur(8px);
    border: 1px solid hsla(255, 40%, 40%, 0.15);
    box-shadow: 
        0 4px 20px -5px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, 
            transparent 0%, 
            hsla(255, 75%, 55%, 0.3) 50%, 
            transparent 100%
        );
    }

    &:hover {
        transform: translateY(-2px);
        border-color: hsla(255, 60%, 50%, 0.3);
        box-shadow: 
            0 8px 30px -5px rgba(139, 92, 246, 0.2),
            0 4px 20px -5px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }

    & .status-bar {
        ${tw`absolute right-3 top-3 w-3 h-3 rounded-full transition-all duration-300`};
        
        ${({ $status }) =>
            !$status || $status === 'offline'
                ? `
                    background: hsl(0, 70%, 50%);
                    box-shadow: 0 0 10px 2px hsla(0, 70%, 50%, 0.4);
                `
                : $status === 'running'
                ? `
                    background: hsl(160, 70%, 50%);
                    animation: ${pulseGlow} 2s ease-in-out infinite;
                    color: hsl(160, 70%, 50%);
                `
                : `
                    background: hsl(45, 80%, 50%);
                    box-shadow: 0 0 10px 2px hsla(45, 80%, 50%, 0.4);
                `};
    }

    & .server-icon {
        ${tw`rounded-xl w-12 h-12 flex items-center justify-center mr-4 transition-all duration-300`};
        background: linear-gradient(135deg, 
            hsla(255, 60%, 50%, 0.2) 0%, 
            hsla(185, 60%, 50%, 0.1) 100%
        );
        border: 1px solid hsla(255, 40%, 50%, 0.2);
        
        svg {
            color: hsl(185, 80%, 55%);
            filter: drop-shadow(0 0 4px hsla(185, 80%, 55%, 0.4));
        }
    }

    &:hover .server-icon {
        transform: scale(1.05);
        border-color: hsla(255, 50%, 60%, 0.3);
        box-shadow: 0 0 20px -5px hsla(255, 75%, 55%, 0.3);
    }
`;

const StatCard = styled.div`
    ${tw`flex flex-col items-center p-2 rounded-lg transition-all duration-200`};
    background: hsla(220, 30%, 15%, 0.5);
    border: 1px solid hsla(255, 30%, 40%, 0.1);
    
    &:hover {
        background: hsla(255, 30%, 20%, 0.5);
        border-color: hsla(255, 40%, 50%, 0.2);
    }
`;

type Timer = ReturnType<typeof setInterval>;

export default ({ server, className }: { server: Server; className?: string }) => {
    const interval = useRef<Timer>(null) as React.MutableRefObject<Timer>;
    const [isSuspended, setIsSuspended] = useState(server.status === 'suspended');
    const [stats, setStats] = useState<ServerStats | null>(null);

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

    const diskLimit = server.limits.disk !== 0 ? bytesToString(mbToBytes(server.limits.disk)) : 'Unlimited';
    const memoryLimit = server.limits.memory !== 0 ? bytesToString(mbToBytes(server.limits.memory)) : 'Unlimited';
    const cpuLimit = server.limits.cpu !== 0 ? server.limits.cpu + ' %' : 'Unlimited';

    return (
        <StatusIndicatorBox to={`/server/${server.id}`} className={className} $status={stats?.status}>
            <div css={tw`flex items-center col-span-12 sm:col-span-5 lg:col-span-6`}>
                <div className={'server-icon'}>
                    <FontAwesomeIcon icon={faServer} />
                </div>
                <div>
                    <p css={tw`text-lg font-semibold break-words`} style={{ color: 'hsl(220, 10%, 95%)' }}>
                        {server.name}
                    </p>
                    {!!server.description && (
                        <p css={tw`text-sm break-words line-clamp-2`} style={{ color: 'hsl(220, 10%, 60%)' }}>
                            {server.description}
                        </p>
                    )}
                </div>
            </div>
            <div css={tw`flex-1 ml-4 lg:block lg:col-span-2 hidden`}>
                <div css={tw`flex justify-center items-center`}>
                    <FontAwesomeIcon icon={faEthernet} style={{ color: 'hsl(185, 80%, 55%)', opacity: 0.7 }} />
                    <p css={tw`text-sm ml-2`} style={{ color: 'hsl(220, 10%, 65%)' }}>
                        {server.allocations
                            .filter((alloc) => alloc.isDefault)
                            .map((allocation) => (
                                <React.Fragment key={allocation.ip + allocation.port.toString()}>
                                    {allocation.alias || ip(allocation.ip)}:{allocation.port}
                                </React.Fragment>
                            ))}
                    </p>
                </div>
            </div>
            <div css={tw`hidden col-span-7 lg:col-span-4 sm:flex items-center justify-end gap-3 pr-6`}>
                {!stats || isSuspended ? (
                    isSuspended ? (
                        <div css={tw`flex-1 text-center`}>
                            <span 
                                css={tw`rounded-lg px-3 py-1.5 text-xs font-medium`}
                                style={{ 
                                    background: 'hsla(0, 70%, 50%, 0.2)', 
                                    color: 'hsl(0, 90%, 75%)',
                                    border: '1px solid hsla(0, 70%, 50%, 0.3)'
                                }}
                            >
                                {server.status === 'suspended' ? 'Suspended' : 'Connection Error'}
                            </span>
                        </div>
                    ) : server.isTransferring || server.status ? (
                        <div css={tw`flex-1 text-center`}>
                            <span 
                                css={tw`rounded-lg px-3 py-1.5 text-xs font-medium`}
                                style={{ 
                                    background: 'hsla(220, 30%, 30%, 0.5)', 
                                    color: 'hsl(220, 10%, 75%)',
                                    border: '1px solid hsla(220, 30%, 40%, 0.3)'
                                }}
                            >
                                {server.isTransferring
                                    ? 'Transferring'
                                    : server.status === 'installing'
                                    ? 'Installing'
                                    : server.status === 'restoring_backup'
                                    ? 'Restoring Backup'
                                    : 'Unavailable'}
                            </span>
                        </div>
                    ) : (
                        <Spinner size={'small'} />
                    )
                ) : (
                    <React.Fragment>
                        <StatCard>
                            <div css={tw`flex items-center`}>
                                <Icon icon={faMicrochip} $alarm={alarms.cpu} />
                                <IconDescription $alarm={alarms.cpu}>
                                    {stats.cpuUsagePercent.toFixed(0)}%
                                </IconDescription>
                            </div>
                            <p css={tw`text-2xs mt-1`} style={{ color: 'hsl(220, 10%, 45%)' }}>
                                / {cpuLimit}
                            </p>
                        </StatCard>
                        <StatCard>
                            <div css={tw`flex items-center`}>
                                <Icon icon={faMemory} $alarm={alarms.memory} />
                                <IconDescription $alarm={alarms.memory}>
                                    {bytesToString(stats.memoryUsageInBytes)}
                                </IconDescription>
                            </div>
                            <p css={tw`text-2xs mt-1`} style={{ color: 'hsl(220, 10%, 45%)' }}>
                                / {memoryLimit}
                            </p>
                        </StatCard>
                        <StatCard>
                            <div css={tw`flex items-center`}>
                                <Icon icon={faHdd} $alarm={alarms.disk} />
                                <IconDescription $alarm={alarms.disk}>
                                    {bytesToString(stats.diskUsageInBytes)}
                                </IconDescription>
                            </div>
                            <p css={tw`text-2xs mt-1`} style={{ color: 'hsl(220, 10%, 45%)' }}>
                                / {diskLimit}
                            </p>
                        </StatCard>
                    </React.Fragment>
                )}
            </div>
            <div className={'status-bar'} />
        </StatusIndicatorBox>
    );
};
