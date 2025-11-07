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
    searchOrder = [], //For slow building
    stepInterval = 500, 
}) => {
    let xAxisVals = [];
    let yAxisVals = [];
    // const labels = groupedData["xAxisVals"];
    if (Array.isArray(groupedData)) { //Having problems with how the data is handled so im gonna accpet both for a minute
        xAxisVals = groupedData.map(d => d.label);
        yAxisVals = groupedData.map(d => d.value);
    } else {
        xAxisVals = groupedData?.xAxisVals || [];
        yAxisVals = groupedData?.yAxisVals || [];
    }
    // let dataValues;
    // let lineChartData;
    // let values = groupedData["tree"]
    // let changeThisName = values.split('\n')) //now there all in there own little groups within changeThisName liek arrs
    // for(let i = 0; i < groupedData["tree"].length; i++) {
        // dataValues = [1] this isnt right i was just rtying stuff
        const [chartData, setChartData] = useState(() => ({
            labels: [],
            datasets: [
                {
                    label: datasetLabel,
                    data: [], //start at 0 for animation
                    backgroundColor: 'rgba(125, 20, 190, 0.8)',
                    borderColor: 'rgba(56, 12, 83, 1)',
                    borderWidth: 1,
                },
            ],
        }));
    // }

    const options = useMemo(() => ({
        responsive: true,
        scales: {
            x: { type: 'category' },
            y: { beginAtZero: true },
        },
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: datasetLabel || 'Results'},

        },
            animation: { //build animation
                duration: stepInterval - 50, // (500 was too quick)
                easing: 'linear', //steady instead
        },
    }), [datasetLabel]);

    useEffect(() => { //debugging whats wrong with search order
        console.log("Search order received:", searchOrder);
        console.log("xAxisVals:", xAxisVals);
        console.log("yAxisVals:", yAxisVals);
    }, [searchOrder]);
    //Update chart data when groupedData changes
    useEffect(() => {
        setChartData(prevData => {
            //inifite loop fix hopefully
            if (JSON.stringify(prevData.labels) === JSON.stringify(xAxisVals)) { return prevData; } // No change needed
            return { //reset data for animation
            ...prevData,
            labels: xAxisVals,
            datasets: prevData.datasets.map(ds => ({
                ...ds,
                data: xAxisVals.map(() => 0), //reset to 0 for animation
            })),
        };
    });
    }, [xAxisVals]);
    //animate based on searchOrder
    useEffect(() => {
        if (searchOrder.length === 0) return; //No animation if no search order
        let i = 0; //Current position
        const interval = setInterval(() => { 
            if (i >= searchOrder.length) {
                clearInterval(interval); //stop when finished
                return;
            }
            setChartData((prevData) => {
                //i think this was an issue because it wasnt updating state correctly
                const newDatasets = prevData.datasets.map(ds => ({...ds, data: [...ds.data]})); //copy
                const idx = searchOrder[i]; //get new index to update
                newDatasets[0].data[idx] = yAxisVals[idx]; //set actual value at that index
                return {...prevData, datasets: newDatasets};
            });
            i++; //move next
        }, stepInterval);
        return () => clearInterval(interval);
    }, [searchOrder, xAxisVals, yAxisVals, stepInterval]);
    return  (
        <div style={{ maxWidth: '990px', width: '100%' }}>
            <Bar key={datasetLabel} options={options} data={chartData}></Bar>
        </div>
    );

};

export default BarGraph;