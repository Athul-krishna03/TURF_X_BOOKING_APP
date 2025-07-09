import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Calendar,
  CalendarCheck2,
  TrendingUp,
  Users,
  Users2,
  Wallet,
} from "lucide-react";
import { CardLoadingSkeleton } from "../ui/loading/loading-skeletons";
import NormalBookingCard from "../turf/normalBookingCard";
import { Pagination1 } from "./Pagination";
import HostedgameCard from "../turf/hostedGame";
import { getRevenueData } from "../../services/admin/adminService";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Booking, SharedBooking } from "../../types/Type";

export type RevenueResponse = {
  normal: Booking[];
  hosted: SharedBooking[];
  revenueStats: {
    totalBookings: number;
    totalEarnings: number;
    revenue: number;
    normalBooking: number;
    sharedBooking: number;
  };
};

const RevenueManagement = () => {
  const [tab, setTab] = useState("normal");
  const [normalBookingPage, setNormalBookingPage] = useState(1);
  const [hostedBookingPage, setHostedBookingPage] = useState(1);
  const [bookingData, setBookingData] = useState<RevenueResponse>({
    normal: [],
    hosted: [],
    revenueStats: {
      totalBookings: 0,
      totalEarnings: 0,
      revenue: 0,
      normalBooking: 0,
      sharedBooking: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const ITEMS_PER_PAGE = 3;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const data = await getRevenueData();
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
    (normalBookingPage - 1) * ITEMS_PER_PAGE,
    normalBookingPage * ITEMS_PER_PAGE
  );

  const hostedGamesPaginated = bookingData.hosted.slice(
    (hostedBookingPage - 1) * ITEMS_PER_PAGE,
    normalBookingPage * ITEMS_PER_PAGE
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="ml-4 flex-1  overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500 rounded-bl-full opacity-10"></div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {"Total Platform Revenue"}
                </CardTitle>
                <Calendar className="h-5 w-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                ₹
                {Math.ceil(
                  bookingData.revenueStats.totalEarnings || 0
                ).toLocaleString()}
              </div>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500 rounded-bl-full opacity-10"></div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {"Profit Revenue"}
                </CardTitle>
                <Wallet className="h-5 w-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                ₹
                {Math.ceil(
                  bookingData.revenueStats.revenue || 0
                ).toLocaleString()}
              </div>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500 rounded-bl-full opacity-10"></div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {"Normal Bookings"}
                </CardTitle>
                <Users className="h-5 w-5 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {bookingData.revenueStats.normalBooking || 0}
              </div>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                +6% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500 rounded-bl-full opacity-10"></div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {"Shared Bookings"}
                </CardTitle>
                <Users className="h-5 w-5 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {bookingData.revenueStats.sharedBooking || 0}
              </div>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                +24% from last month
              </p>
            </CardContent>
          </Card>
        </div>

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
              <CardLoadingSkeleton />
            ) : bookingData.normal.length === 0 ? (
              <p className="text-gray-500">No normal bookings found.</p>
            ) : (
              <div className="space-y-4">
                {normalBookingPaginated.map((booking) => (
                  <NormalBookingCard
                    key={booking.id}
                    booking={booking}
                    onCancel={() => {}}
                    userType="admin"
                  />
                ))}
                <Pagination1
                  currentPage={normalBookingPage}
                  totalPages={Math.ceil(
                    bookingData.normal.length / ITEMS_PER_PAGE
                  )}
                  onPagePrev={() =>
                    setNormalBookingPage((p) => Math.max(p - 1, 1))
                  }
                  onPageNext={() =>
                    setNormalBookingPage((p) =>
                      Math.min(
                        p + 1,
                        Math.ceil(bookingData.normal.length / ITEMS_PER_PAGE)
                      )
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
                  <HostedgameCard
                    key={game.id}
                    game={game}
                    onCancel={() => {}}
                    userType="admin"
                  />
                ))}
                <Pagination1
                  currentPage={hostedBookingPage}
                  totalPages={Math.ceil(
                    bookingData.hosted.length / ITEMS_PER_PAGE
                  )}
                  onPagePrev={() =>
                    setHostedBookingPage((p) => Math.max(p - 1, 1))
                  }
                  onPageNext={() =>
                    setHostedBookingPage((p) =>
                      Math.min(
                        p + 1,
                        Math.ceil(bookingData.hosted.length / ITEMS_PER_PAGE)
                      )
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

export default RevenueManagement;
