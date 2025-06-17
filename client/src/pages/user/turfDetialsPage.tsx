"use client"

import { useEffect, useState } from "react"
import {  format } from "date-fns"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { Separator } from "../../components/ui/separator"
import TurfGallery from "../../components/turf/turf-gallery"
import TurfHeader from "../../components/turf/turf-header"
import TurfInfoSection from "../../components/turf/turf-info-section"
import BookingSection from "../../components/turf/booking-section"
import TurfReviews from "../../components/review/turf-review"
import type { ITurf, Turf } from "../../types/Type"
import { slots } from "../../services/user/userServices"
import { toast } from "sonner"
import type { Slot } from "../../types/SlotsType"

export default function TurfDetailsPage() {
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([])
  const [date, setDate] = useState<Date | undefined>()
  const [turfData, setTurfData] = useState<ITurf | undefined>(undefined)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [duration, setDuration] = useState<number>(1)
  const [bookingStep, setBookingStep] = useState<"calendar" | "slots" | "confirmation">("calendar")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { turfId } = useParams<{ turfId: string }>()
  const allTurfData = useSelector((state: any) => state?.turfs?.turfs)

  useEffect(() => {
    if (turfId && allTurfData && allTurfData.length > 0) {
      const matchedTurf = allTurfData.find((turf: Turf) => String(turf.turfId) === String(turfId))
      if (matchedTurf) {
        setTurfData(matchedTurf)
      } else {
        toast.error("Could not find turf details")
      }
    }
  }, [turfId, allTurfData])

  const getAvailableSlots = async (selectedDate: Date | undefined) => {
    if (!selectedDate) return
    setIsLoading(true)
    const formattedDate = format(selectedDate, "yyyy-MM-dd")
    try {
      const response = await slots(turfId as string, formattedDate)
      setAvailableSlots(response.data || [])
    } catch (error) {
      console.error("Failed to fetch slots:", error)
      toast.error("Failed to fetch available slots")
      setAvailableSlots([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSlotSelect = (slot: Slot) => {
    setSelectedSlot(slot)
    setBookingStep("confirmation")
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate) {
      getAvailableSlots(selectedDate)
    }
    setBookingStep("slots")
  }

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration)
  }

  const handleBackToCalendar = () => {
    setBookingStep("calendar")
  }

  const handleBackToSlots = () => {
    setBookingStep("slots")
  }

  const handleConfirmBooking = () => {
    toast.success(
      <div className="flex flex-col">
        <span className="font-semibold">Booking Confirmed!</span>
        <span className="text-sm">
          {format(date!, "PPP")} at {selectedSlot?.startTime} for {duration} hour(s)
        </span>
      </div>,
    )
    setBookingStep("calendar")
    setSelectedSlot(null)
  }

  const handleBack = () => {
    window.history.back()
  }

  if (!turfData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-32 bg-gray-700 rounded mb-4"></div>
          <div className="text-gray-400">Loading turf details...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}

      {/* Gallery */}
      <div className="container mx-auto px-4 pb-4">
        <TurfGallery photos={turfData?.turfPhotos} turfName={turfData?.name} onBack={handleBack}/>
      </div>

      <TurfHeader turfData={turfData} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Info and Reviews */}
          <div className="lg:w-2/3 space-y-8">
            <TurfInfoSection turfData={turfData} />

            <Separator className="border-gray-800" />

            {/* Reviews Section */}
            <TurfReviews turfId={turfId!} turfName={turfData.name} />
          </div>

          {/* Right Column - Booking */}
          <div className="lg:w-1/3 mt-6 lg:mt-0">
            <BookingSection
              turfData={turfData}
              availableSlots={availableSlots}
              isLoading={isLoading}
              onDateSelect={handleDateSelect}
              onSlotSelect={handleSlotSelect}
              onConfirmBooking={handleConfirmBooking}
              bookingStep={bookingStep}
              selectedDate={date}
              selectedSlot={selectedSlot}
              duration={duration}
              onDurationChange={handleDurationChange}
              onBackToCalendar={handleBackToCalendar}
              onBackToSlots={handleBackToSlots}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
