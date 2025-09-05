import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { useApp } from '../context/AppContext'
import './marker.css'   // <-- NUEVO: nuestro CSS del marcador

/* Icono HTML (DivIcon) que usa la clase .marker-dot */
const animatedIcon = L.divIcon({
  className: '', // sin las clases por defecto (borde gris)
  html: '<div class="marker-dot"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8], // centro del círculo
})

const ClickHandler = () => {
  const { placingMode, setShowAddForm, setNewMarkerData } = useApp()
  useMapEvents({
    click(e) {
      if (!placingMode) return
      const { lat, lng } = e.latlng
      setNewMarkerData(prev => ({ ...prev, lat, lng }))
      setShowAddForm(true) // abre el formulario recién después de elegir punto
    }
  })
  return null
}

const UseGeolocation = ({ active }) => {
  const map = useMap()
  useEffect(() => {
    if (!active) return
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        map.setView([latitude, longitude], 16, { animate: true })
      },
      () => { /* permiso denegado o error: se queda en La Rioja */ },
      { enableHighAccuracy: true, timeout: 5000 }
    )
  }, [active, map])
  return null
}

export default function MapView() {
  const { markers, setSelectedMarker, placingMode } = useApp()
  const [center] = useState([-29.4145, -66.8580]) // La Rioja

  return (
    <MapContainer
  center={center}
  zoom={14}
  className="w-full h-full"
  scrollWheelZoom={true}
  dragging={true}
  doubleClickZoom={true}
  touchZoom={true}
  boxZoom={true}
  zoomControl={false}   // <-- ocultar botones
  
>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Geolocaliza al cargar y cuando entras a modo colocación (no abre form) */}
      <UseGeolocation active={true} />
      <UseGeolocation active={placingMode} />

      <ClickHandler />

      {markers.map(m => (
        <Marker
          key={m.id}
          position={[m.lat, m.lng]}
          icon={animatedIcon}                 // <-- nuestro icono
          eventHandlers={{ click: () => setSelectedMarker(m) }}
        >
          <Popup>
            <div className="text-sm">
              <div className="font-semibold">{m.streetName}</div>
              <div className="text-gray-600">{m.description}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
