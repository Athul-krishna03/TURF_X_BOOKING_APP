"use client"

import { MapPin, Star, Heart, X } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import type { ITurf } from "../../types/Type"
import MapLocationPicker from "./turfDetialsComponents/map-location-picker"
import { LocationCoordinates } from "../../types/TurfTypes"
import { useState } from "react"

interface TurfHeaderProps {
   turfData: ITurf
}

export default function TurfHeader({ turfData }: TurfHeaderProps) {
  const [open, setOpen] = useState(false)

  const coordinates: LocationCoordinates = {
    lat: turfData.location.coordinates.coordinates[1],
    lng: turfData.location.coordinates.coordinates[0]
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {turfData?.name}
          </h1>
          <div className="flex items-center mt-2 text-gray-400">
            <MapPin size={16} className="mr-1 text-green-400" />
            <span className="text-sm">
              {turfData?.location?.address}, {turfData?.location?.city}, {turfData?.location?.state}
            </span>
          </div>
          <div className="flex items-center mt-2">
            <div className="flex items-center bg-gray-800/60 px-3 py-1 rounded-full">
              <Star size={14} className="text-green-400 mr-1" />
              <span className="text-sm font-medium text-white">4.8</span>
            </div>
            <span className="text-xs text-gray-400 ml-2">(120+ reviews)</span>
          </div>
          <Badge className="mt-2 bg-green-900/50 text-green-300 border-green-700">Verified Venue</Badge>
        </div>

        <div className="flex gap-2 items-center">
          <Button
            onClick={() => setOpen(true)}
            className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
          >
            See On Map
          </Button>
          <Button size="icon" className="rounded-full hover:bg-gray-800 hover:text-green-400 transition-colors">
            <Heart size={18} />
          </Button>
        </div>
      </div>

      {/* Custom Modal Popup */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop/Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* Header with Close Button */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">
                {turfData?.name} - Location Map
              </h2>
              <Button
                onClick={() => setOpen(false)}
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full hover:bg-gray-200"
              >
                <X size={18} className="text-gray-600" />
              </Button>
            </div>
            
            {/* Map Content */}
            <div className="p-4">
              <MapLocationPicker
                coordinates={coordinates}
                readOnly
                height="500px"
                showCard={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}