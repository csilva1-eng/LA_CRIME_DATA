import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

import L from "leaflet";
import { useEffect } from "react";

function HeatMapComp({ points }) {
    useEffect(() => {
        const map = L.map("heatmap");

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        map.setView([28.5383, -81.3792], 11); // Orlando default

        L.heatLayer(points, {
            radius: 25,
            blur: 15,
            maxZoom: 17,
        }).addTo(map);

        return () => map.remove();
    }, [points]);

    return <div id="heatmap" style={{ height: "100vh" }} />;
}

export default HeatMapComp;
