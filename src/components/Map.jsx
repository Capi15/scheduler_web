// Map.jsx
import React, { useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  LayersControl
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Solução para que o pino padrão do Leaflet seja exibido corretamente
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

function LocationMarker({ position, onPositionChange }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      if (onPositionChange) onPositionChange(lat, lng);
    }
  });

  return position ? <Marker position={position} /> : null;
}

function Map({ value, onPositionChange }) {
  const defaultPosition = [41.5388, -8.6156]; // IPCA Barcelos
  const center = Array.isArray(value)
    ? value
    : [value?.lat || defaultPosition[0], value?.lng || defaultPosition[1]];

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <MapContainer
        center={center}
        zoom={16}
        scrollWheelZoom={true}
        style={{ height: '100%' }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Google Maps (com labels)">
            <TileLayer
              url="http://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
              maxZoom={20}
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="OpenStreetMap">
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <LocationMarker position={center} onPositionChange={onPositionChange} />
      </MapContainer>
    </div>
  );
}

export default Map;