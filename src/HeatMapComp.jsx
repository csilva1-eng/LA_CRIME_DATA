import { useEffect, useRef } from "react";
import * as L from "leaflet"
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

function HeatMapComp({ points }) {
    const mapRef = useRef(null);
    const heatRef = useRef(null);


    useEffect(() => {
        console.log("Initializing map...");
        console.log("L.heatLayer available?", typeof L.heatLayer);
        
        mapRef.current = L.map("heatmap").setView([34.0549, -118.2426], 15);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(mapRef.current);

        // Check if heatLayer is available
        if (!L.heatLayer) {
            console.error("leaflet.heat plugin not loaded. L.heatLayer is:", L.heatLayer);
            return;
        }

        // initial empty heat layer
        heatRef.current = L.heatLayer([], { 
            radius: 15, 
            minOpacity: 0.4,
            blur: 20,
            maxZoom: 17, 
            gradient: {
                0.1: 'blue',
                0.3: 'cyan',
                0.5: 'lime',
                0.7: 'yellow',
                1.0: 'red'
            }
        }).addTo(mapRef.current);

        console.log("Heat layer created:", heatRef.current);


        return () => mapRef.current.remove();
    }, []);

    // 2️⃣ Update heat layer data whenever points change
    useEffect(() => {
        console.log("Points received:", points?.length, "points");
        if (heatRef.current && points && points.length > 0) {
            // Transform points from {lat, lon} format to [lat, lon, intensity] format
            // Each point gets intensity of 1, or you could aggregate nearby points
            const heatPoints = points
                .filter(point => point.lat != null && point.lon != null && !isNaN(point.lat) && !isNaN(point.lon))
                .map(point => [
                    Number(point.lat),
                    Number(point.lon),
                    0.08 // intensity - you can adjust this or aggregate for higher values
                ]);
            
            console.log("Setting heat points:", heatPoints.length, "valid points");
            heatRef.current.setLatLngs(heatPoints);
        } else {
            console.log("Cannot update heat layer:", {
                hasHeatRef: !!heatRef.current,
                hasPoints: !!points,
                pointsLength: points?.length
            });
        }
    }, [points]);

    return <div id="heatmap" style={{ height: "90vh" }} />;
}

export default HeatMapComp