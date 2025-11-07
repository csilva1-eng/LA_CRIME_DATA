import React, {useState} from 'react' //For bar graph
import BarGraph from './BarGraph';

function Building({ xAxis }) {
    const [groupedData, setGroupedData] = useState({ xAxisVals: [], yAxisVals: [] }); //x and y axis data
    const [searchOrder, setSearchOrder] = useState([]); //Order of indices visited during search
    const [datasetLabel, setDatasetLabel] = useState('Results'); //Label for dataset
    
    async function buildGraph(alg) { //alg is 'bfs' or 'dfs'
        setDatasetLabel(alg);
        try {
            const response = await fetch(`http://localhost:3001/api/test?alg=${alg}`);
            const data = await response.json();

            //fetch grouped data
            const groupedArray = data.grouped;
            const xVals = groupedArray.map(d => d.label);
            const yVals = groupedArray.map(d => d.value);

            //parse traversal order
            const traversalOrder = [];
            const treeLines = data.tree.split('|'); //Based on the http this is whats seperating the stuff
            treeLines.forEach(line => {
                const treeLine = line.trim(); //no extra spaces
                if (treeLine.startsWith('key: ')){ //only process key lines
                    const key = treeLine.slice(5).trim(); //get rid of 'key: '
                    const index = xVals.indexOf(key); //find index of this key in x axis label
                    if (index !== -1) { //valid index
                        traversalOrder.push(index); //add to traversal order
                    }
                    
                }
            });
            console.log("Traversal order parsed:", traversalOrder); //i forgot what this even prints

            // Set state
            setGroupedData({ xAxisVals: xVals, yAxisVals: yVals});
            setSearchOrder(traversalOrder);
            
        }
        catch (error) {
            console.error('Error fetching graph data:', error);
        }
    }
    return (
        <div style = {{textAlign: 'center', padding: '20px'}}>
            <div style = {{ marginBottom: '10px' }}>
                <button onClick={() => buildGraph('bfs')}>Run BFS</button>
                <button onClick={() => buildGraph('dfs')}>Run DFS</button>
            </div>
            <BarGraph groupedData={groupedData} x_axis_label={xAxis} y_axis_label={"Count"} datasetLabel={datasetLabel} searchOrder={searchOrder} />
        </div>         
    );
}
export default Building;