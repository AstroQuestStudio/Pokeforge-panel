import React, { memo, useEffect, useRef } from 'react';
import { ServerContext } from '@/state/server';
import { SocketEvent } from '@/components/server/events';
import useWebsocketEvent from '@/plugins/useWebsocketEvent';
import { Line } from 'react-chartjs-2';
import { useChart, useChartTickLabel } from '@/components/server/console/chart';
import { bytesToString } from '@/lib/formatters';
import { CloudArrowDownIcon, CloudArrowUpIcon } from '@heroicons/react/24/solid';
import ChartBlock from '@/components/server/console/ChartBlock';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import classNames from 'classnames';

const StatGraphs = memo(() => {
    const status = ServerContext.useStoreState((state) => state.status.value);
    const limits = ServerContext.useStoreState((state) => state.server.data!.limits);
    const previous = useRef<Record<'tx' | 'rx', number>>({ tx: -1, rx: -1 });

    const cpu = useChartTickLabel('CPU', limits.cpu, '%', 2);
    const memory = useChartTickLabel('Memory', limits.memory, 'MiB');
    const network = useChart('Network', {
        sets: 2,
        options: {
            scales: {
                y: {
                    ticks: {
                        callback(value) {
                            return bytesToString(typeof value === 'string' ? parseInt(value, 10) : value);
                        },
                    },
                },
            },
        },
        callback(opts, index) {
            return {
                ...opts,
                label: !index ? 'Inbound' : 'Outbound',
                borderColor: !index ? '#22d3ee' : '#a78bfa',
                backgroundColor: !index ? 'rgba(34, 211, 238, 0.1)' : 'rgba(167, 139, 250, 0.1)',
                pointBackgroundColor: !index ? '#22d3ee' : '#a78bfa',
            };
        },
    });

    useEffect(() => {
        if (status === 'offline') {
            cpu.clear();
            memory.clear();
            network.clear();
        }
    }, [status]);

    useWebsocketEvent(SocketEvent.STATS, (data: string) => {
        let values: any = {};
        try {
            values = JSON.parse(data);
        } catch (e) {
            return;
        }
        cpu.push(values.cpu_absolute);
        memory.push(Math.floor(values.memory_bytes / 1024 / 1024));
        network.push([
            previous.current.tx < 0 ? 0 : Math.max(0, values.network.tx_bytes - previous.current.tx),
            previous.current.rx < 0 ? 0 : Math.max(0, values.network.rx_bytes - previous.current.rx),
        ]);

        previous.current = { tx: values.network.tx_bytes, rx: values.network.rx_bytes };
    });

    return (
        <>
            <ChartBlock title="CPU Load" className="stagger-1">
                <Line {...cpu.props} />
            </ChartBlock>
            
            <ChartBlock title="Memory" className="stagger-2">
                <Line {...memory.props} />
            </ChartBlock>
            
            <ChartBlock
                title="Network"
                className="stagger-3"
                legend={
                    <div className="flex items-center gap-3">
                        <Tooltip arrow content="Inbound Traffic">
                            <div className="flex items-center gap-1.5">
                                <CloudArrowDownIcon className="w-4 h-4 text-cyan-400" />
                                <span className="text-xs text-neutral-400">In</span>
                            </div>
                        </Tooltip>
                        <Tooltip arrow content="Outbound Traffic">
                            <div className="flex items-center gap-1.5">
                                <CloudArrowUpIcon className="w-4 h-4 text-violet-400" />
                                <span className="text-xs text-neutral-400">Out</span>
                            </div>
                        </Tooltip>
                    </div>
                }
            >
                <Line {...network.props} />
            </ChartBlock>
        </>
    );
});

StatGraphs.displayName = 'StatGraphs';

export default StatGraphs;
