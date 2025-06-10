"use client"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { MapPin } from "lucide-react"
import type { LocationCoordinates } from "../../../types/TurfTypes"

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

interface MapLocationPickerProps {
  coordinates: LocationCoordinates
  onLocationChange?: (coords: LocationCoordinates) => void
  onAddressChange?: (address: { address: string; city: string; state: string }) => void
  height?: string
  showCard?: boolean
  title?: string
  readOnly?: boolean
}

// Reverse geocoding function using Nominatim (OpenStreetMap)
const OPENCAGE_API_KEY = "12ae1a8c7bb64625939836be1c484961"

const reverseGeocode = async (lat: number, lng: number) => {
  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}%2C+${lng}&key=${OPENCAGE_API_KEY}`
    )

    const data = await response.json()

    

    if (data.results && data.results.length > 0) {
      const components = data.results[0].components

      return {
        address: data.results[0].formatted,
        city:
          components.city ||
          components.town ||
          components.village ||
          components.hamlet ||
          "",
        state: components.state || components.region || "",
        country: components.country || "",
        postcode: components.postcode || "",
      }
    }

    return null
  } catch (error) {
    console.error("OpenCage reverse geocoding failed:", error)
    return null
  }
}

const LocationPicker = ({
  onLocationChange,
  onAddressChange,
}: {
  onLocationChange: (coords: LocationCoordinates) => void
  onAddressChange?: (address: { address: string; city: string; state: string }) => void
}) => {
  useMapEvents({
    async click(e: { latlng: { lat: number; lng: number } }) {
      const newCoords = { lat: e.latlng.lat, lng: e.latlng.lng }
      onLocationChange(newCoords)

      // Perform reverse geocoding if callback is provided
      if (onAddressChange) {
        const addressData = await reverseGeocode(e.latlng.lat, e.latlng.lng)
        if (addressData) {
          console.log("Reverse geocoding result:", addressData)
          onAddressChange({
            address: addressData.address,
            city: addressData.city,
            state: addressData.state,
          })
        }
      }
    },
  })
  return null
}

const getDirectionUrl = (lat: number, lng: number) => `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`

export default function MapLocationPicker({
  coordinates,
  onLocationChange,
  onAddressChange,
  height = "400px",
  showCard = true,
  title,
  readOnly = false
}: MapLocationPickerProps) {
  if (title === undefined) {
    title = !readOnly ? "Select Location" : "Location";
  }
  const center: [number, number] = [coordinates.lat, coordinates.lng]
  console.log("coors",coordinates)

  const mapContent = (
    <div className="space-y-4">
      <div style={{ height }} className="w-full rounded-lg overflow-hidden shadow-md">
        <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[coordinates.lat, coordinates.lng]} />
          {!readOnly && onLocationChange && (
            <LocationPicker onLocationChange={onLocationChange} onAddressChange={onAddressChange} />
          )}
        </MapContainer>
      </div>

      <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md flex items-center justify-between">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-green-600" />
          <span>
            Selected coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
          </span>
        </div>
        {readOnly && (
          <a
            href={getDirectionUrl(coordinates.lat, coordinates.lng)}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 text-green-700 hover:underline text-sm"
          >
            Get Directions
          </a>
        )}
      </div>

      {!readOnly && (
        <p className="text-sm text-gray-600">Click on the map to select your turf's location</p>
      )}
    </div>
  )

  if (!showCard) return mapContent

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-xl text-gray-800">
          <MapPin className="w-5 h-5 mr-2 text-green-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{mapContent}</CardContent>
    </Card>
  )
}
