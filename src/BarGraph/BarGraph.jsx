import React, { useMemo } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    import React, { useEffect, useMemo } from 'react'
    import {
        Chart as ChartJS,
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend,
    } from 'chart.js'
    import { Bar } from 'react-chartjs-2'

    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

    const BarGraph = ({ groupedData = [], x_axis_label = 'X', y_axis_label = 'Count', datasetLabel = 'Count' }) => {
        // groupedData expected shape: [{ label, value }, ...]
        const labels = groupedData.map((g) => g.label)
        const dataValues = groupedData.map((g) => g.value)

        useEffect(() => {
            // helpful debug while developing — remove when stable
            console.log('BarGraph received groupedData length=', groupedData.length)
            if (groupedData.length > 0) console.log('BarGraph sample labels:', labels.slice(0, 8))
        }, [groupedData])

        const data = useMemo(
            () => ({
                labels,
                datasets: [
                    {
                        label: datasetLabel,
                        data: dataValues,
                        backgroundColor: 'rgba(75, 123, 255, 0.85)',
                        borderColor: 'rgba(32, 64, 128, 1)',
                        borderWidth: 1,
                    },
                ],
            }),
            [labels.join('|'), dataValues.join(',')]
        )

        const options = useMemo(
            () => ({
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 800, easing: 'easeOutQuart' },
                plugins: {
                    legend: { display: true, position: 'top' },
                    title: { display: false },
                },
                scales: {
                    x: {
                        grid: { color: '#ddd' },
                        ticks: { color: '#333' },
                        title: { display: true, text: x_axis_label, color: '#222' },
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: '#eee' },
                        ticks: { color: '#333' },
                        title: { display: true, text: y_axis_label, color: '#222' },
                    },
                },
            }),
            [x_axis_label, y_axis_label]
        )

        return (
            <div style={{ width: '100%', maxWidth: 1000, height: 420 }}>
                <Bar options={options} data={data} />
            </div>
        )
    }

    export default BarGraph