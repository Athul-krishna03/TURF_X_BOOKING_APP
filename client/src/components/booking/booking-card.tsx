"use client"

import { format } from "date-fns"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import {
  MapPin,
  Calendar,
  Clock,
  ChevronRight,
  Check,
  XCircle,
  Award
} from "lucide-react"

export interface BookingCardProps {
  booking: {
    id?: string
    turfId: string
    bookingId?: string
    turfName: string
    turfImage: string[]
    location: {
      city: string
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

export default function BookingCard({
  booking,
  onCancel,
  showActions,
  type
}: BookingCardProps) {
  const formatPrice = (price: number) => {
    return price % 1 === 0 ? price.toString() : price.toFixed(2)
  }

  const getStatusBadge = (status: string) => {
    const baseClass = "text-xs px-2 py-0.5 flex items-center gap-1"

    switch (status.toLowerCase()) {
      case "booked":
        return (
          <Badge className={`${baseClass} bg-emerald-600 hover:bg-emerald-700`}>
            <Check size={12} />
            Confirmed
          </Badge>
        )
      case "pending":
        return (
          <Badge className={`${baseClass} bg-amber-600 hover:bg-amber-700`}>
            <Clock size={12} />
            Pending
          </Badge>
        )
      case "completed":
        return (
          <Badge className={`${baseClass} bg-blue-600 hover:bg-blue-700`}>
            <Award size={12} />
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className={`${baseClass} bg-rose-600 hover:bg-rose-700`}>
            <XCircle size={12} />
            Cancelled
          </Badge>
        )
      default:
        return <Badge className={`${baseClass} bg-gray-600`}>{status}</Badge>
    }
  }

  return (
    <Card className="bg-gray-900 border border-gray-800 rounded-xl hover:border-gray-700 transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex gap-4">
          {/* Turf Image */}
          {booking.turfImage?.[0] && (
            <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-700">
              <img
                src={booking.turfImage[0]}
                alt={booking.turfName}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            {/* Top Row */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-white text-lg font-semibold truncate">
                  {booking.turfName}
                </h3>
                <p className="text-sm text-gray-200">
                  Booking ID: #{booking.bookingId}
                </p>
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <MapPin size={14} />
                  <span>
                    {booking.location.city}, {booking.location.state}
                  </span>
                </div>
              </div>
              {getStatusBadge(booking.status)}
            </div>

            {/* Middle Info */}
            <div className="mt-3 flex justify-between items-center">
              <div className="flex items-center gap-5 text-sm text-gray-300">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{format(new Date(booking.date), "MMM d, yyyy")}</span>
                </div>
                {booking.startTime && (
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>
                      {booking.startTime} ({booking.duration}h)
                    </span>
                  </div>
                )}
              </div>

              <div className="text-right">
                <div className="text-white text-lg font-bold">
                  {booking.currency}
                  {formatPrice(booking.price)}
                </div>
                <div className="text-xs text-gray-400">
                  {booking.currency}
                  {formatPrice(booking.price / booking.duration)}/hr
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 flex justify-between items-center">
              <div className="flex gap-2">
                {showActions &&
                  booking.status.toLowerCase() !== "cancelled" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs px-3 py-1.5 h-auto border-gray-700 text-rose-400 hover:bg-rose-950/30 hover:border-rose-800"
                      onClick={onCancel}
                    >
                      Cancel
                    </Button>
                  )}

                {!showActions &&
                  booking.status.toLowerCase() === "completed" && (
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
                  <a
                    href={`/user/joinedGameDetails/${booking.id}`}
                    className="flex items-center gap-1"
                  >
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
