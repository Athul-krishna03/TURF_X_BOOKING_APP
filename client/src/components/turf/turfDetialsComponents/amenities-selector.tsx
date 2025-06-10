"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Badge } from "../../ui/badge"
import { Plus, X, Star } from "lucide-react"

interface AmenitiesSelectorProps {
    selectedAmenities: string[]
    onAmenitiesChange: (amenities: string[]) => void
    showCard?: boolean
    title?: string
}

const popularAmenities = [
    "Parking",
    "Changing Rooms",
    "Washrooms",
    "Floodlights",
    "Seating Area",
    "Water Dispenser",
    "First Aid Kit",
    "Equipment Rental",
    "Cafeteria",
    "Locker Room",
    "Shower",
    "WiFi",
    "Air Conditioning",
    "CCTV Security",
    "Referee Services",
]

export default function AmenitiesSelector({
    selectedAmenities,
    onAmenitiesChange,
    showCard = true,
    title = "Amenities & Facilities",
}: AmenitiesSelectorProps) {
    const [customAmenity, setCustomAmenity] = useState("")

    const toggleAmenity = (amenity: string) => {
        if (selectedAmenities.includes(amenity)) {
        onAmenitiesChange(selectedAmenities.filter((a) => a !== amenity))
        } else {
        onAmenitiesChange([...selectedAmenities, amenity])
        }
    }

    const addCustomAmenity = () => {
        if (customAmenity.trim() && !selectedAmenities.includes(customAmenity.trim())) {
        onAmenitiesChange([...selectedAmenities, customAmenity.trim()])
        setCustomAmenity("")
        }
    }

    const removeAmenity = (amenity: string) => {
        onAmenitiesChange(selectedAmenities.filter((a) => a !== amenity))
    }

    const amenitiesContent = (
        <div className="space-y-6">
        {/* Popular Amenities */}
        <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Popular Amenities (Click to add/remove)</Label>
            <div className="flex flex-wrap gap-2">
            {popularAmenities.map((amenity) => (
                <Badge
                key={amenity}
                variant={selectedAmenities.includes(amenity) ? "default" : "outline"}
                className={`cursor-pointer transition-all ${
                    selectedAmenities.includes(amenity)
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "hover:bg-green-50 hover:border-green-300"
                }`}
                onClick={() => toggleAmenity(amenity)}
                >
                {amenity}
                {selectedAmenities.includes(amenity) && <X className="w-3 h-3 ml-1" />}
                </Badge>
            ))}
            </div>
        </div>

        {/* Custom Amenity Input */}
        <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Add Custom Amenity</Label>
            <div className="flex gap-2">
            <Input
                type="text"
                value={customAmenity}
                onChange={(e) => setCustomAmenity(e.target.value)}
                className="flex-1 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500"
                placeholder="e.g., Swimming Pool, Gym, Spa"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCustomAmenity())}
            />
            <Button
                type="button"
                onClick={addCustomAmenity}
                className="h-12 px-6 bg-green-600 hover:bg-green-700"
                disabled={!customAmenity.trim()}
            >
                <Plus className="w-4 h-4" />
            </Button>
            </div>
        </div>

        {/* Selected Amenities */}
        {selectedAmenities.length > 0 && (
            <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Selected Amenities ({selectedAmenities.length})
            </Label>
            <div className="flex flex-wrap gap-2">
                {selectedAmenities.map((amenity, index) => (
                <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200 pr-1">
                    {amenity}
                    <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => removeAmenity(amenity)}
                    className="ml-2 h-4 w-4 p-0 hover:bg-transparent"
                    >
                    <X className="w-3 h-3" />
                    </Button>
                </Badge>
                ))}
            </div>
            </div>
        )}
        </div>
    )

    if (!showCard) {
        return amenitiesContent
    }

    return (
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-xl text-gray-800">
            <Star className="w-5 h-5 mr-2 text-green-600" />
            {title}
            </CardTitle>
        </CardHeader>
        <CardContent>{amenitiesContent}</CardContent>
        </Card>
)
}
