import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapEvent } from "@/types";

interface MapViewProps {
  events: MapEvent[];
  onEventClick: (event: MapEvent) => void;
}

const createIcon = (accepted: boolean, category: string) => {
  const color = accepted ? "#2db87a" : category === "food" ? "#ee6723" : category === "activity" ? "#3b82f6" : category === "nightlife" ? "#a855f7" : "#f59e0b";
  const glow = accepted ? "filter: drop-shadow(0 0 8px #2db87a88);" : "";

  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 36px; height: 36px;
      background: ${color};
      border-radius: 50% 50% 50% 4px;
      transform: rotate(-45deg);
      display: flex; align-items: center; justify-content: center;
      border: 3px solid white;
      box-shadow: 0 3px 12px ${color}44;
      ${glow}
    ">
      <span style="transform: rotate(45deg); color: white; font-size: 14px; font-weight: 700;">
        ${category === "food" ? "🍜" : category === "activity" ? "⚡" : category === "nightlife" ? "🌙" : "🌿"}
      </span>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

const MapView = ({ events, onEventClick }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current, {
      center: [40.7380, -73.9900],
      zoom: 13,
      zoomControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(mapInstance.current);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    }).addTo(mapInstance.current);

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;

    // Clear existing markers
    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstance.current?.removeLayer(layer);
      }
    });

    events.forEach((event) => {
      const marker = L.marker([event.location.lat, event.location.lng], {
        icon: createIcon(event.accepted, event.category),
      }).addTo(mapInstance.current!);

      marker.bindPopup(`
        <div style="font-family: 'Space Grotesk', sans-serif; min-width: 180px;">
          <strong style="font-size: 14px;">${event.title}</strong>
          <div style="font-size: 12px; color: #777; margin-top: 4px;">
            📍 ${event.location.address}<br/>
            🕐 ${event.date} at ${event.time}<br/>
            💰 ${event.price}
          </div>
        </div>
      `);

      marker.on("click", () => onEventClick(event));
    });
  }, [events, onEventClick]);

  return (
    <div ref={mapRef} className="w-full h-full" style={{ minHeight: "100%" }} />
  );
};

export default MapView;
