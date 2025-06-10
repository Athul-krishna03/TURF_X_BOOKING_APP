"use client"
import { Calendar as CalendarComponent } from "../../components/ui/calendar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs"
import { Card, CardContent } from "../../components/ui/card"
import { Calendar, Clock, Mail, Shield } from "lucide-react"
import BookingSlots from "../booking/booking-slots"
import BookingConfirmation from "../booking/booking-confirmation"
import type { ITurf } from "../../types/Type"
import type { Slot } from "../../types/SlotsType"

interface BookingSectionProps {
  turfData: ITurf
  availableSlots: Slot[]
  isLoading: boolean
  onDateSelect: (date: Date | undefined) => void
  onSlotSelect: (slot: Slot) => void
  onConfirmBooking: () => void
  bookingStep: "calendar" | "slots" | "confirmation"
  selectedDate: Date | undefined
  selectedSlot: Slot | null
  duration: number
  onDurationChange: (duration: number) => void
  onBackToCalendar: () => void
  onBackToSlots: () => void
}

export default function BookingSection({
  turfData,
  availableSlots,
  isLoading,
  onDateSelect,
  onSlotSelect,
  onConfirmBooking,
  bookingStep,
  selectedDate,
  selectedSlot,
  duration,
  onDurationChange,
  onBackToCalendar,
  onBackToSlots,
}: BookingSectionProps) {
  return (
    <Card className="bg-gray-900/80 border-gray-800 overflow-hidden rounded-lg shadow-lg shadow-green-900/10">
      <div className="bg-gradient-to-r from-green-900/30 to-green-800/20 h-2"></div>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <span className="bg-gradient-to-r from-green-400 to-green-200 bg-clip-text text-transparent">
            Book this venue
          </span>
        </h2>
        <div className="mb-5 bg-gray-800/50 p-4 rounded-lg">
          <img
            src={turfData.turfPhotos[0] || "/placeholder.svg"}
            alt="Turf Preview"
            className="w-full h-24 object-cover rounded-md mb-3"
          />
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Shield size={16} className="text-green-400" />
            <span>Ideal for {turfData.courtSize} matches</span>
          </div>
        </div>

        <Tabs defaultValue="booking" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-5 bg-gray-800/30 p-1">
            <TabsTrigger
              value="booking"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-900/40 data-[state=active]:to-green-800/30 data-[state=active]:text-white"
            >
              Book Now
            </TabsTrigger>
            <TabsTrigger
              value="info"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-900/40 data-[state=active]:to-green-800/30 data-[state=active]:text-white"
            >
              Venue Info
            </TabsTrigger>
          </TabsList>

          <TabsContent value="booking" className="space-y-4">
            {bookingStep === "calendar" && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Calendar size={18} className="text-green-400" />
                  <h3 className="font-medium text-white">Select a date</h3>
                </div>
                <div className="bg-gray-800/50 p-1 rounded-lg">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={onDateSelect}
                    className="rounded-md border border-gray-700 bg-gray-800/80 p-3 pointer-events-auto"
                    disabled={(date: Date) => {
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      date.setHours(0, 0, 0, 0)
                      return date < today
                    }}
                  />
                </div>
              </div>
            )}

            {bookingStep === "slots" &&
              selectedDate &&
              (isLoading ? (
                <div className="py-8 flex flex-col items-center">
                  <div className="animate-spin h-8 w-8 border-t-2 border-green-500 rounded-full mb-4"></div>
                  <p className="text-gray-400">Loading available slots...</p>
                </div>
              ) : (
                <BookingSlots
                  date={selectedDate}
                  availableSlots={availableSlots}
                  onSlotSelect={onSlotSelect}
                  onBack={onBackToCalendar}
                />
              ))}

            {bookingStep === "confirmation" && selectedDate && selectedSlot && (
              <BookingConfirmation
                date={selectedSlot.date}
                slot={selectedSlot}
                duration={duration}
                currency={"₹"}
                onDurationChange={onDurationChange}
                onBack={onBackToSlots}
                onConfirm={onConfirmBooking}
                price={0}
              />
            )}
          </TabsContent>

          <TabsContent value="info">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3 flex items-center text-green-300">
                  <Clock size={16} className="mr-2" /> Hours
                </h3>
                <p className="text-sm text-gray-400 ml-7">Open from 6:00 AM to 11:00 PM daily</p>
              </div>

              <div>
                <h3 className="font-medium mb-3 flex items-center text-green-300">
                  <Mail size={16} className="mr-2" /> Contact
                </h3>
                <p className="text-sm text-gray-400 ml-7">
                  Email: {turfData.email}
                  <br />
                  Phone: {turfData.phone}
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-3 flex items-center text-green-300">Established</h3>
                <p className="text-sm text-gray-400 ml-7">Since April 2025</p>
              </div>

              <div>
                <h3 className="font-medium mb-3 flex items-center text-green-300">Cancellation Policy</h3>
                <p className="text-sm text-gray-400">
                  Free cancellation up to 24 hours before your booking. After that, a 50% fee applies.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-3 flex items-center text-green-300">Venue Rules</h3>
                <ul className="text-sm text-gray-400 list-disc pl-5 space-y-2">
                  <li>Proper sports shoes required</li>
                  <li>No food or drinks on the playing area</li>
                  <li>Arrive 15 minutes before your slot</li>
                  <li>Equipment rentals available at extra cost</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
