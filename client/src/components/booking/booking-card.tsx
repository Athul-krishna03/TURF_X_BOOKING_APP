"use client"

import { format } from "date-fns"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { MapPin, Calendar, Clock, ChevronRight, Check, XCircle, Award } from "lucide-react"

export interface BookingCardProps {
  booking: {
    id?: string
    turfId: string
    turfName: string
    turfImage: string[]
    location: {
      city: string,
      state: string
    }
    date: string
    startTime?: string
    endTime?: string
    duration: number
    price: number
    currency: string
    status: string
    sport?: string
  }
  onCancel: () => void
  showActions: boolean
  type: string
}

export default function BookingCard({ booking, onCancel, showActions, type }: BookingCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "booked":
        return (
          <Badge className="bg-emerald-600 hover:bg-emerald-700 text-xs px-2 py-0.5 flex items-center gap-1">
            <Check size={12} />
            Confirmed
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-600 hover:bg-amber-700 text-xs px-2 py-0.5 flex items-center gap-1">
            <Clock size={12} />
            Pending
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-0.5 flex items-center gap-1">
            <Award size={12} />
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-rose-600 hover:bg-rose-700 text-xs px-2 py-0.5 flex items-center gap-1">
            <XCircle size={12} />
            Cancelled
          </Badge>
        )
      default:
        return <Badge className="text-xs px-2 py-0.5">{status}</Badge>
    }
  }

  const formatPrice = (price: number) => {
    return price % 1 === 0 ? price.toString() : price.toFixed(2)
  }

  return (
    <Card className="bg-gray-900 border-gray-800 rounded-lg transition-all hover:border-gray-700 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Compact Turf Image */}
          {booking.turfImage?.[0] && (
            <div className="w-20 h-20 flex-shrink-0">
              <img
                src={booking.turfImage[0]}
                alt={`${booking.turfName}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header Row */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white truncate">{booking.turfName}</h3>
                <div className="flex items-center text-sm text-gray-400 mt-0.5">
                  <MapPin size={12} className="mr-1 flex-shrink-0" />
                  <span className="truncate">{booking.location?.city}, {booking.location?.state}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-2">
                {getStatusBadge(booking.status)}
              </div>
            </div>

            {/* Info Row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center text-gray-300">
                  <Calendar size={14} className="mr-1.5 text-gray-400" />
                  <span>{format(new Date(booking.date), "MMM d, yyyy")}</span>
                </div>
                {booking.startTime && (
                  <div className="flex items-center text-gray-300">
                    <Clock size={14} className="mr-1.5 text-gray-400" />
                    <span>{booking.startTime} ({booking.duration}h)</span>
                  </div>
                )}
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-white">
                  {booking.currency}{formatPrice(booking.price)}
                </div>
                <div className="text-xs text-gray-400">
                  {booking.currency}{formatPrice(booking.price / booking.duration)}/hr
                </div>
              </div>
            </div>

            {/* Actions Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {showActions && booking.status.toLowerCase() !== "cancelled" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs px-3 py-1.5 h-auto border-gray-700 text-rose-400 hover:bg-rose-950/30 hover:border-rose-800"
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                )}
                {!showActions && booking.status.toLowerCase() === "completed" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs px-3 py-1.5 h-auto border-gray-700 hover:bg-gray-800"
                  >
                    Book Again
                  </Button>
                )}
              </div>

              {showActions && type !== "normal" && (
                <Button
                  variant="default"
                  size="sm"
                  className="text-xs px-3 py-1.5 h-auto bg-indigo-600 hover:bg-indigo-700"
                  asChild
                >
                  <a href={`/user/joinedGameDetails/${booking.id}`} className="flex items-center gap-1">
                    Details <ChevronRight size={14} />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}