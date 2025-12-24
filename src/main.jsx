import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Map from './Map.jsx'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import "leaflet/dist/leaflet.css"




createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/map" element={<Map />} />
        </Routes>
    </BrowserRouter>,
)
