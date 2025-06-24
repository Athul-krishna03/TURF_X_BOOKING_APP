"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { CalendarCheck2, Users2 } from "lucide-react";
import TurfSideBar from "./turfSideBar";
import { cancelTurfBooking, getTurfBookings } from "../../services/turf/turfServices";
import NormalBookingCard from "../../components/turf/normalBookingCard";
import HostedGameCard from "./hostedGame";
import { Booking, SharedBooking } from "../../types/Type";
import { toast } from "sonner";
import { CardLoadingSkeleton } from "../ui/loading/loading-skeletons";
import { Pagination1 } from "../admin/Pagination";

export type TurfBookingResponse = {
  normal: Booking[];
  hosted: SharedBooking[];
};

const BookingManagement = () => {
  const [tab, setTab] = useState("normal");
  const [normalBookingPage,setNormalBookingPage]= useState(1);
  const [hostedBookingPage,setHostedBookingPage] = useState(1)
  const [bookingData, setBookingData] = useState<TurfBookingResponse>({
    normal: [],
    hosted: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const ITEMS_PER_PAGE = 3;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const data = await getTurfBookings();
        setBookingData(data);
      } catch (err) {
        console.error("Failed to fetch turf bookings", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);
  
  const normalBookingPaginated = bookingData.normal.slice(
    (normalBookingPage-1) * ITEMS_PER_PAGE,
    normalBookingPage*ITEMS_PER_PAGE
  )

  const hostedGamesPaginated = bookingData.hosted.slice(
    (hostedBookingPage-1)*ITEMS_PER_PAGE,
    normalBookingPage*ITEMS_PER_PAGE
  )
  const handleCancelBooking = async (bookingId: string,bookingType:string) => {
    if(bookingType =="single"){
      try {
          console.log('Cancelling booking:', bookingId);
          const response = await cancelTurfBooking(bookingId, "single");
          if (response.success) {
            console.log('Booking cancelled successfully:', bookingId);
            setBookingData((prevData) => ({
              ...prevData,
              normal: prevData.normal.map((booking) =>
                booking._doc._id === bookingId
                  ? { ...booking, _doc: { ...booking._doc, status: 'Cancelled' } }
                  : booking
              ),
            }));
            toast.success('Booking cancelled successfully');
          }
      } catch (error) {
        console.error('Failed to cancel booking:', error);
        toast.error('Failed to cancel booking');
      }
    }else{
      try {
        console.log('Cancelling hosted game:', bookingId);
        const response = await cancelTurfBooking(bookingId, "joined");
        if(response.success) {
          setBookingData((prevData) => ({
          ...prevData,
          hosted: prevData.hosted.map((game) =>
            game.id === bookingId
              ? { ...game, status: 'Cancelled' }
              : game
          ),
          }));
          toast.success('Hosted game cancelled successfully');
        }
        
      } catch (error) {
        
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-10">
        <TurfSideBar />
      </div>
      <div className="ml-64 flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-semibold mb-6">Booking Management</h1>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-white border border-gray-200 mb-6">
            <TabsTrigger
              value="normal"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white px-4 py-2"
            >
              <CalendarCheck2 className="w-4 h-4 mr-2" />
              Normal Bookings
            </TabsTrigger>
            <TabsTrigger
              value="hosted"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white px-4 py-2"
            >
              <Users2 className="w-4 h-4 mr-2" />
              Hosted Games
            </TabsTrigger>
          </TabsList>
          <TabsContent value="normal">
            {isLoading ? (
              <CardLoadingSkeleton/>
            ) : bookingData.normal.length === 0 ? (
              <p className="text-gray-500">No normal bookings found.</p>
            ) : (
              <div className="space-y-4">
                {normalBookingPaginated.map((booking) => (
                  <NormalBookingCard key={booking.id} booking={booking} onCancel={handleCancelBooking}/>
                ))}
                <Pagination1
                    currentPage={normalBookingPage}
                    totalPages={Math.ceil(bookingData.normal.length / ITEMS_PER_PAGE)}
                    onPagePrev={() => setNormalBookingPage((p) => Math.max(p - 1, 1))}
                    onPageNext={() =>
                      setNormalBookingPage((p) =>
                        Math.min(p + 1, Math.ceil(bookingData.normal.length / ITEMS_PER_PAGE))
                      )
                    }
                />
              </div>
            )}
          </TabsContent>
          <TabsContent value="hosted">
            {isLoading ? (
              <p>Loading hosted games...</p>
            ) : bookingData.hosted.length === 0 ? (
              <p className="text-gray-500">No hosted games found.</p>
            ) : (
              <div className="space-y-4">
                {hostedGamesPaginated.map((game) => (
                  <HostedGameCard 
                  key={game.id} 
                  game={game}
                  onCancel={handleCancelBooking}
                  />
                ))}
                <Pagination1
                    currentPage={hostedBookingPage}
                    totalPages={Math.ceil(bookingData.hosted.length / ITEMS_PER_PAGE)}
                    onPagePrev={() => setHostedBookingPage((p) => Math.max(p - 1, 1))}
                    onPageNext={() =>
                      setHostedBookingPage((p) =>
                        Math.min(p + 1, Math.ceil(bookingData.hosted.length / ITEMS_PER_PAGE))
                      )
                    }
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BookingManagement;
