import React, {useEffect, useState} from 'react'
import HeatMapComp from "./HeatMapComp.jsx";
import {Link} from "react-router-dom";
import axios from "axios";
import CircularIndeterminate from "./CircularIndeterminate.jsx";
import './Map.css'


function Map(){
    const [yearStart, setYearStart] = useState()
    const [yearEnd, setYearEnd] = useState()

    const [geoData, setGeoData] = useState([])
    const [isLoading, setIsLoading] = useState(2)


        if(isLoading == 1){
            return <div id = 'loading'>
                <CircularIndeterminate/>
            </div>

        } else if (isLoading == 2) {
            return <>
                <HeatMapComp points={geoData}/>
                <Link to='/'>Main</Link>
                <div className='year-select'>
                    <label>
                        Select Start Date:
                        <select id="dropDown" onChange={(e) => {
                            setYearStart(e.target.value)
                        }}>
                            <option id="hiddenOption" value="select">--Select--</option>
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                            <option value="2021">2021</option>
                            <option value="2020">2020</option>
                        </select>
                    </label>
                </div>
                <div className='year-select'>
                    <label>
                        Select End Date:
                        <select id="dropDown" onChange={(e) => {
                            setYearEnd(e.target.value)
                        }}>
                            <option id="hiddenOption" value="select">--Select--</option>
                            <option value='2025'>2025</option>
                            <option value='2024'>2024</option>
                            <option value='2023'>2023</option>
                            <option value='2022'>2022</option>
                            <option value='2021'>2021</option>
                            <option value='2020'>2020</option>
                        </select>
                    </label>
                </div>

                <button id="displayButton" onClick={() => {
                    gatherMapData().then(() => {

                        setIsLoading(2)
                    })
                }}>Display!
                </button>
            </>
        }
    async function gatherMapData(){
            setIsLoading(1)
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
        } finally {
            setIsLoading(2)
        }
    }
}


export default Map