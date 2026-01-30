import {
    Chart as ChartJS,
    ChartData,
    ChartDataset,
    ChartOptions,
    Filler,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
} from 'chart.js';
import { DeepPartial } from 'ts-essentials';
import { useState, useCallback, useMemo } from 'react';
import { deepmerge, deepmergeCustom } from 'deepmerge-ts';
import { theme } from 'twin.macro';

ChartJS.register(LineElement, PointElement, Filler, LinearScale, Tooltip);

// Create gradient helper
const createGradient = (ctx: CanvasRenderingContext2D, colorTop: string, colorBottom: string) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 150);
    gradient.addColorStop(0, colorTop);
    gradient.addColorStop(1, colorBottom);
    return gradient;
};

const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: true,
    animation: {
        duration: 400,
        easing: 'easeOutCubic',
    },
    plugins: {
        legend: { display: false },
        title: { display: false },
        tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(20, 20, 30, 0.9)',
            titleColor: '#fff',
            bodyColor: 'rgba(255, 255, 255, 0.8)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            titleFont: {
                family: theme('fontFamily.sans'),
                size: 12,
                weight: '600',
            },
            bodyFont: {
                family: theme('fontFamily.sans'),
                size: 11,
            },
            displayColors: true,
            boxWidth: 8,
            boxHeight: 8,
            boxPadding: 4,
            usePointStyle: true,
            callbacks: {
                label: (context) => {
                    const label = context.dataset.label || '';
                    const value = context.parsed.y;
                    return ` ${label}: ${value.toFixed(1)}`;
                },
            },
        },
    },
    interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false,
    },
    layout: {
        padding: {
            left: 0,
            right: 0,
            top: 4,
            bottom: 0,
        },
    },
    scales: {
        x: {
            min: 0,
            max: 19,
            type: 'linear',
            display: false,
            grid: {
                display: false,
            },
            ticks: {
                display: false,
            },
        },
        y: {
            min: 0,
            type: 'linear',
            position: 'right',
            grid: {
                display: true,
                color: 'rgba(255, 255, 255, 0.04)',
                lineWidth: 1,
            },
            border: {
                display: false,
            },
            ticks: {
                display: true,
                count: 4,
                color: 'rgba(255, 255, 255, 0.4)',
                font: {
                    family: theme('fontFamily.sans'),
                    size: 10,
                    weight: '500',
                },
                padding: 8,
            },
        },
    },
    elements: {
        point: {
            radius: 0,
            hoverRadius: 4,
            hitRadius: 10,
            hoverBackgroundColor: '#fff',
            hoverBorderColor: '#fff',
            hoverBorderWidth: 2,
        },
        line: {
            tension: 0.4,
            borderWidth: 2,
            borderCapStyle: 'round',
            borderJoinStyle: 'round',
        },
    },
};

function getOptions(opts?: DeepPartial<ChartOptions<'line'>> | undefined): ChartOptions<'line'> {
    return deepmerge(options, opts || {});
}

type ChartDatasetCallback = (value: ChartDataset<'line'>, index: number) => ChartDataset<'line'>;

function getEmptyData(label: string, sets = 1, callback?: ChartDatasetCallback | undefined): ChartData<'line'> {
    const next = callback || ((value) => value);

    return {
        labels: Array(20)
            .fill(0)
            .map((_, index) => index),
        datasets: Array(sets)
            .fill(0)
            .map((_, index) =>
                next(
                    {
                        fill: true,
                        label,
                        data: Array(20).fill(-5),
                        borderColor: '#22d3ee',
                        backgroundColor: 'rgba(34, 211, 238, 0.1)',
                        pointBackgroundColor: '#22d3ee',
                        pointBorderColor: '#22d3ee',
                    },
                    index
                )
            ),
    };
}

const merge = deepmergeCustom({ mergeArrays: false });

interface UseChartOptions {
    sets: number;
    options?: DeepPartial<ChartOptions<'line'>> | number | undefined;
    callback?: ChartDatasetCallback | undefined;
}

function useChart(label: string, opts?: UseChartOptions) {
    const chartOptions = useMemo(() => 
        getOptions(
            typeof opts?.options === 'number' 
                ? { scales: { y: { min: 0, suggestedMax: opts.options } } } 
                : opts?.options
        ),
        [opts?.options]
    );
    
    const [data, setData] = useState(() => getEmptyData(label, opts?.sets || 1, opts?.callback));

    const push = useCallback((items: number | null | (number | null)[]) =>
        setData((state) =>
            merge(state, {
                datasets: (Array.isArray(items) ? items : [items]).map((item, index) => ({
                    ...state.datasets[index],
                    data: state.datasets[index].data
                        .slice(1)
                        .concat(typeof item === 'number' ? Number(item.toFixed(2)) : item),
                })),
            })
        ),
        []
    );

    const clear = useCallback(() =>
        setData((state) =>
            merge(state, {
                datasets: state.datasets.map((value) => ({
                    ...value,
                    data: Array(20).fill(-5),
                })),
            })
        ),
        []
    );

    return { props: { data, options: chartOptions }, push, clear };
}

function useChartTickLabel(label: string, max: number, tickLabel: string, roundTo?: number) {
    return useChart(label, {
        sets: 1,
        options: {
            scales: {
                y: {
                    suggestedMax: max,
                    ticks: {
                        callback(value) {
                            return `${roundTo ? Number(value).toFixed(roundTo) : value}${tickLabel}`;
                        },
                    },
                },
            },
        },
    });
}

export { useChart, useChartTickLabel, getOptions, getEmptyData, createGradient };
