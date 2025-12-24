import React from 'react'
import HeatMapComp from "./HeatMapComp.jsx";
import {Link, useLocation} from "react-router-dom";


function Map(){
    const {state} = useLocation();
    const data = state?.result

    return <>

        <Link to = '/'>Main</Link>
        {/*<HeatMapComp points={data}/>;*/}
        </>
}


export default Map