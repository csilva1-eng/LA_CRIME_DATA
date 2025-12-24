import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import BarGraph from './BarGraph/BarGraph';
import {Link} from "react-router-dom";

//import "@fontsource/ibm-plex-sans";


function App() {
  // Fetch backend/C++ output

  const [xAxis, setXAxis] = useState("area");
  const [xAxisData, setXAxisData] = useState([]);
  const [yearStart, setYearStart] = useState('2020')
  const [yearEnd, setYearEnd] = useState('2025')

  // List of search types for buttons



  const gatherData = async (e) => {
    try{

      const response = await axios.get("http://localhost:3001/api/test", {
        params: {
          xAxis,
          yearStart,
          yearEnd
        }
      })
  // backend returns { grouped: [...], tree: '...' }
  setXAxisData(response.data || [])
    } catch(error){
      console.log(error)
    }
  }


  return (
    <div>
      <nav className='nav-cont'>
        <span><h1 id = "title" >Crime Data Explorer</h1></span>
      </nav>

      <div className='main'>
        {/* <Building xAxis={xAxis} /> */}
        {/*<button onClick={() => handleFetch()}>call node api</button>*/}
        {/*<p>message: {message}</p>*/}





        <div className='map'>
            <BarGraph groupedData={xAxisData} x_axis_label={xAxis} y_axis_label={"Count"} datasetLabel={`LA Crime Data`} />
        </div>



        <div className='x-axis-select'>
          <label> Select X-Axis:
            <select id = "dropDown"  onChange={(e) => { setXAxis(e.target.value); }}>
              <option id = "hiddenOption" value="select">--Select--</option>
              <option value="area_name">Area Name</option>
              <option value="area">Area</option>
              {/*<option value="crm_cd_desc">Crime Committed</option>*/}
              <option value="vict_sex">Victim Sex</option>
              <option value="vict_age">Victim Age</option>
              {/*<option value="premis_desc">Premise Description</option>*/}
              {/*<option value="weapon_desc">Weapon Used</option>*/}
              <option value="status_desc">Case Status</option>
              {/*  is it possible to add location?*/}
              {/*  <option value="area_name">Area Name</option>*/}
              {/*  <option value="area">Area</option>*/}
              {/*  <option value="crm_cd_desc">Crime Committed</option>*/}
              {/*  <option value="vict_sex">Victim Sex</option>*/}
              {/*  <option value="vict_age">Victim Age</option>*/}
              {/*  <option value="premis_desc">Premise Description</option>*/}
              {/*  <option value="weapon_desc">Weapon Used</option>*/}
              {/*  <option value="status_desc">Case Status</option>*/}
              {/*  is it possible to add location?*/}
            </select>
          </label>
        </div>

        <div className = 'year-select'>
          <label>
            Select Start Date:
            <select id = "dropDown" onChange = {(e)=>{setYearStart(e.target.value)}}>
              <option id = "hiddenOption" value="select">--Select--</option>
              <option value = "2025">2025</option>
              <option value = "2024">2024</option>
              <option value = "2023">2023</option>
              <option value = "2022">2022</option>
              <option value = "2021">2021</option>
              <option value = "2020">2020</option>
            </select>
          </label>
        </div>
        <div className = 'year-select'>
          <label>
            Select End Date:
            <select id = "dropDown" onChange = {(e)=>{setYearEnd(e.target.value)}}>
              <option id = "hiddenOption" value="select">--Select--</option>
              <option value = '2025'>2025</option>
              <option value = '2024'>2024</option>
              <option value = '2023'>2023</option>
              <option value = '2022'>2022</option>
              <option value = '2021'>2021</option>
              <option value = '2020'>2020</option>
            </select>
          </label>
        </div>

        <div>
          <button id = "displayButton" onClick={() => gatherData()}>Display!</button>
        </div>

            </div>
            {/*<div className='x-axis-results'>*/}
            {/*  <h3>Grouped Data Preview:</h3>*/}
            {/*  <pre>{JSON.stringify(xAxisData, null, 2)}</pre>*/}
            {/*</div>*/}
      <button id = "searchButton" onClick = {() =>{
        if(xAxisData.length == 0) gatherData()
      }}>
      <Link to = '/map' state = {xAxisData}>Map</Link>
      </button>


      <script src="https://cdn.jsdelivr.net/npm/soda-js@0.2/lib/soda-js.bundle.min.js"></script>
    </div>

  )
}

export default App
