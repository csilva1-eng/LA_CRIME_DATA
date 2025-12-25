import React, {useEffect, useState} from 'react'
import HeatMapComp from "./HeatMapComp.jsx";
import {Link} from "react-router-dom";
import axios from "axios";


function Map(){
    const [yearStart, setYearStart] = useState()
    const [yearEnd, setYearEnd] = useState()

    let show = false

    const [geoData, setGeoData] = useState([])

    useEffect(() => {
         async function gatherMapData(){
            try {
                const response =  await axios.get("http://localhost:3001/api/map", {
                    params:{
                        yearStart,
                        yearEnd
                    }
                })
                setGeoData(response.data?.result || [])
            } catch (error){
                console.log(error)
            }
        }

        gatherMapData()
    }, [yearStart, yearEnd]);

    if(geoData.length != 0) show = true

    return <>

        {show && <HeatMapComp points={geoData}/>}
        <Link to = '/'>Main</Link>
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
        </>
}


export default Map