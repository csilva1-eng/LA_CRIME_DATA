import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import React, { useState, useMemo, useEffect } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarGraph = ({
    groupedData = [],
    datasetLabel = 'Count',
}) => {
    const xAxisVals = groupedData?.result?.xAxisVals || [];
    const [dataSet, setDataSet] = useState([])

    useEffect(() => {

        setDataSet([...(groupedData?.result?.counts ?? [])])
    }, [groupedData]);


        const [chartData, setChartData] = useState(() => ({
            labels: xAxisVals,
            datasets: [
                {
                    label: datasetLabel,
                    data: dataSet,
                    backgroundColor: 'rgba(125, 20, 190, 0.8)',
                    borderColor: 'rgba(56, 12, 83, 1)',
                    borderWidth: 1,
                },
            ],
        }));

    const options = useMemo(() => ({
        responsive: true,
        scales: {
            x: { type: 'category' },
            y: {
                beginAtZero: true,
                max: groupedData.maxYVal,
                title: {
                    display: true,
                    text: "Number of Crimes Committed"
                }
            }
        },
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: datasetLabel || "result"},

        },
            animation: { //build animation
                duration: 800,
                easing: 'linear',
        },
    }), [datasetLabel, groupedData.maxYVal]);


    useEffect(() => {
        setChartData({
            labels: xAxisVals,
            datasets: [
                {
                    label: datasetLabel,
                    data: dataSet,
                    backgroundColor: 'rgba(125, 20, 190, 0.8)',
                    borderColor: 'rgba(56, 12, 83, 1)',
                    borderWidth: 1,
                },
            ],
        })
    }, [dataSet]);


    return  (
        <div style={{ maxWidth: '990px', width: '100%' }}>
            <Bar key={datasetLabel} options={options} data={chartData}></Bar>
        </div>
    );

};

export default BarGraph;