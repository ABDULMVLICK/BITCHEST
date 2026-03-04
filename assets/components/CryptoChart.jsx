import React, { useEffect, useRef } from 'react';
import {
    Chart,
    LineElement,
    PointElement,
    LineController,
    CategoryScale,
    LinearScale,
    Tooltip,
    Filler,
} from 'chart.js';

Chart.register(LineElement, PointElement, LineController, CategoryScale, LinearScale, Tooltip, Filler);

/**
 * Renders a 30-day price history line chart for a single cryptocurrency.
 *
 * @param {string} coin - Coin name (e.g. "Bitcoin")
 * @param {Array<{date: string, price: number}>} history - 30 daily data points
 */
const CryptoChart = ({ coin, history }) => {
    const canvasRef = useRef(null);
    const chartRef  = useRef(null);

    useEffect(() => {
        if (!canvasRef.current || !history?.length) return;

        // Destroy previous instance before re-rendering
        if (chartRef.current) chartRef.current.destroy();

        chartRef.current = new Chart(canvasRef.current, {
            type: 'line',
            data: {
                labels: history.map(d => d.date),
                datasets: [{
                    label: `${coin} price (EUR)`,
                    data: history.map(d => d.price),
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37,99,235,0.05)',
                    fill: true,
                    tension: 0.2,
                    pointRadius: 2,
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: { mode: 'index', intersect: false },
                    legend: { display: false },
                },
                scales: {
                    x: { ticks: { maxTicksLimit: 8, font: { size: 10 } } },
                    y: { ticks: { font: { size: 10 } } },
                },
            },
        });

        return () => chartRef.current?.destroy();
    }, [coin, history]);

    return <canvas ref={canvasRef} height={100} />;
};

export default CryptoChart;
