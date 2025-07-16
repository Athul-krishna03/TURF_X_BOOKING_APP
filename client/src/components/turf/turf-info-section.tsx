"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip"
import { Shield, CheckCircle2, Car, Droplets, ShowerHead, Utensils, Wifi, Users, Circle } from "lucide-react"
import type { ITurf } from "../../types/Type"

interface TurfInfoSectionProps {
  turfData: ITurf
}

const amenityIcons: Record<string, { icon: React.ElementType; description: string }> = {
  Parking: { icon: Car, description: "Free parking available" },
  Toilet: { icon: Droplets, description: "Clean washroom facilities" },
  "Changing Rooms": { icon: ShowerHead, description: "Changing rooms available" },
  Washrooms: { icon: Droplets, description: "Washroom facilities" },
  Cafeteria: { icon: Utensils, description: "On-site cafeteria" },
  "Wi-Fi": { icon: Wifi, description: "Free Wi-Fi access" },
  "Spectator Seating": { icon: Users, description: "Seating for spectators" },
}

export default function TurfInfoSection({ turfData }: TurfInfoSectionProps) {
  const getAmenityIcon = (amenity: string) => {
    const lowerCaseAmenity = amenity.toLowerCase()
    for (const [key, value] of Object.entries(amenityIcons)) {
      if (lowerCaseAmenity.includes(key.toLowerCase())) {
        return value.icon
      }
    }
    return CheckCircle2
  }

  return (
    <div className="space-y-8">
      {/* About Section */}
      <Card className="bg-gray-900/80 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center">
            <span className="bg-gradient-to-r from-green-400 to-green-200 bg-clip-text text-transparent">
              About this venue
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 leading-relaxed">
            `${turfData.name}` is a premier sports venue in `${turfData.location.city},${turfData.location.state}` offering a spacious 11 vs 11 football court
            perfect for competitive matches. Equipped with essential amenities like parking and clean washrooms, it
            ensures a hassle-free experience
          </p>
        </CardContent>
      </Card>

      {/* Sports & Court Section */}
      <Card className="bg-gray-900/80 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center">
            <span className="bg-gradient-to-r from-green-400 to-green-200 bg-clip-text text-transparent">
              Sports & Court
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between space-x-2 mb-4">
          <div className="flex items-center space-x-2 mb-4">
            <Shield size={18} className="text-green-400" />
            <span className="text-gray-300">Court Size: {turfData?.courtSize}</span>
          </div>
          <div className="flex items-center space-x-2 mb-4">
            <Circle size={18} className="text-green-400" />
            <div className="text-gray-300 flex items-center space-x-2">
              <span>Games:</span>
              <ul className="flex space-x-2">
                {turfData.games.map((val, idx) => (
                  <li key={idx} className="list-none">{val}</li>
                ))}
              </ul>
            </div>
          </div>
          </div>
        </CardContent>
      </Card>

      {/* Amenities Section */}
      <Card className="bg-gray-900/80 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center">
            <span className="bg-gradient-to-r from-green-400 to-green-200 bg-clip-text text-transparent">
              Amenities
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {turfData?.aminities?.map((amenity: string, index: number) => {
                const IconComponent = getAmenityIcon(amenity)
                const description = amenityIcons[amenity]?.description || "Facility available"
                return (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-3 group">
                        <div className="p-3 rounded-full bg-gray-800/60 text-green-400 group-hover:bg-gray-700 transition-colors">
                          <IconComponent size={20} />
                        </div>
                        <span className="text-gray-300 group-hover:text-white transition-colors">{amenity}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-800 text-gray-300 border-gray-700">{description}</TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  )
}
