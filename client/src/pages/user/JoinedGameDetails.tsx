"use client"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { CalendarDays, Clock, MapPin, Users, Wallet, Star, Trophy, MessageCircle, Plus, X } from "lucide-react"
import type { JoinedGameData } from "../../types/BookingDetialsTypes"
import { useSelector } from "react-redux"
import CreateChatRoomModal from "../../components/modals/create-chat-room-modal"
import { toast } from "sonner"
import { useCreateChatRoom } from "../../hooks/user/chatRoom/useCreateChatRoom"
import { useGetChatRoomByGameId } from "../../hooks/user/chatRoom/useGetChatRoomByGameId"
import { useGetJoinedGameDetials } from "../../hooks/user/useGetJoinedGameDetials"
import MapLocationPicker from "../../components/turf/turfDetialsComponents/map-location-picker"
import { LocationCoordinates } from "../../types/TurfTypes"

const JoinedGameDetails = () => {
  const { joinedGameId } = useParams()
  const [joinedGameData, setJoinedGameData] = useState<JoinedGameData | null>(null)
  const [existingChatRoom, setExistingChatRoom] = useState<any>(null)
  const [open, setOpen] = useState(false)

  const totalContributions = joinedGameData
    ? Object.values(joinedGameData?.booking.walletContributions).reduce((acc, val) => acc + val, 0)
    : 0
  const navigate = useNavigate()

  const {data:joinedGameDetials,isLoading}=useGetJoinedGameDetials(joinedGameId || "")
  useEffect(() => {
    if(joinedGameDetials){
      setJoinedGameData(joinedGameDetials)
      console.log(
        "",joinedGameDetials
      )
    }
  }, [joinedGameDetials])
  
  const { data: chatRoomData } = useGetChatRoomByGameId(joinedGameData?.booking._id || '');

  useEffect(() => {
    
    if (chatRoomData) {
      console.log("chat", chatRoomData);
      setExistingChatRoom(chatRoomData);
    }
  }, [chatRoomData]);

  const user = useSelector((state: any) => state.user.user)
  const { mutateAsync: createChatRoom } = useCreateChatRoom();
  const handleCreateChatRoom = async (roomData: any) => {
    try {
      const {data} = await createChatRoom({
        ...roomData,
        hostId:joinedGameData?.booking.userIds[0]._id,
        gameId: joinedGameData?.booking._id,
        users: joinedGameData?.booking.userIds.map((u: any) => u._id) || [],
      })

      if (data) {
        navigate(`/user/messages`)
      }

      toast.success("Chat room created successfully!")
    } catch (error) {
      console.error("Error creating chat room:", error)
      toast.error("Failed to create chat room")
      throw error
    }
  }
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-32 bg-gray-700 rounded mb-4"></div>
          <div className="text-gray-400">Loading turf details...</div>
        </div>
      </div>
    )
  }
  const booking = joinedGameData?.booking;
  const turf = joinedGameData?.turf;
  const coordinates: LocationCoordinates = {
      lat: turf?.location?.coordinates.coordinates[1] ?? 0,
      lng: turf?.location?.coordinates.coordinates[0] ?? 0
    }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header Section */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl"></div>
          <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                  Game Session
                </h1>
                <div className="flex items-center gap-4 text-gray-300">
                  <div className="flex items-center">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    {booking?.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {booking?.time}
                  </div>
                  <div className="flex items-center">
                    <Trophy className="w-4 h-4 mr-2" />
                    {booking?.duration} hrs
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  className={`${
                    booking?.status === "Booked"
                      ? "bg-green-800/50 text-green-200 border-green-600"
                      : booking?.status === "Pending"
                        ? "bg-yellow-700/50 text-yellow-200 border-yellow-600"
                        : "bg-red-800/50 text-red-200 border-red-600"
                  } px-4 py-2 text-sm capitalize border backdrop-blur-sm`}
                >
                  {booking?.status}
                </Badge>
              </div>
            </div>

            {/* Chat Room Actions */}
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-700">
          {existingChatRoom && booking?.status !== "Cancelled" ? (
            <Button
              onClick={() => navigate(`/user/messages`)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Join Chat Room
            </Button>
          ) : booking?.userIds?.[0]?._id === user?.id && booking?.status !== "Cancelled" ? (
            <CreateChatRoomModal
              gameId={booking?._id}
              users={booking?.userIds.map((user: any) => ({
                id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage,
              }))}
              onCreateRoom={handleCreateChatRoom}
              trigger={
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Chat Room
                </Button>
              }
            />
          ) : null}

          <div className="flex gap-2 items-center">
          <Button
            onClick={() => setOpen(true)}
            className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
          >
            See On Map
          </Button>
        </div>
        </div>

        </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Turf Details */}
          <div className="xl:col-span-2 space-y-6">
            {/* Turf Information Card */}
            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800 overflow-hidden">
              <div className="relative h-64 md:h-80">
                <img
                  src={turf?.turfPhotos[0] || "/placeholder.svg?height=320&width=800"}
                  alt={turf?.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-2xl font-bold text-white mb-2">{turf?.name}</h2>
                  <div className="flex items-center text-gray-300">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>
                      {turf?.location.city}, {turf?.location.state}
                    </span>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div>
                  <h3 className="font-semibold text-green-400 mb-3 flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    Available Facilities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {turf?.aminities.map((facility: string, index: number) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-700/50 transition-colors"
                      >
                        {facility}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Participants Card */}
            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center text-green-400">
                  <Users className="w-5 h-5 mr-2" />
                  Team Members ({booking?.userIds.length})
                </CardTitle>
                <CardDescription className="text-gray-400">Players joining this game session</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {booking?.userIds.map((user: any, index: number) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-800/50 hover:bg-gray-800/80 transition-all duration-200 border border-gray-700/50"
                    >
                      <div className="flex items-center">
                        <div className="relative">
                          <Avatar className="h-12 w-12 border-2 border-green-500/30">
                            <AvatarImage src={user.profileImage || "/placeholder.svg"} />
                            <AvatarFallback className="bg-green-600 text-white">{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {index === 0 && (
                            <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                              <Trophy className="w-3 h-3 text-black" />
                            </div>
                          )}
                        </div>
                        <div className="ml-3">
                          <div className="font-medium text-white">
                            {user.name}
                            {index === 0 && <span className="text-yellow-400 text-xs ml-2">ORGANIZER</span>}
                          </div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center text-green-300 bg-green-500/10 px-3 py-1 rounded-lg">
                        <Wallet className="w-4 h-4 mr-1" />
                        <span className="font-medium">₹{booking.price / booking.playerCount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Payment & Summary */}
          <div className="space-y-6">
            {/* Booking Summary */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-green-400">Booking Summary</CardTitle>
                <CardDescription className="text-gray-400">Payment and pricing details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-6 bg-gray-800/50 rounded-xl border border-gray-700">
                  <div className="text-sm text-gray-400 mb-2">Total Game Cost</div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    ₹{booking?.price.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400 mt-2">
                    ₹{booking?.price && booking?.playerCount ? (booking.price / booking.playerCount).toFixed(2) : "0.00"} per player
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white">{booking?.duration} hours</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Players</span>
                    <span className="text-white">{booking?.playerCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Date & Time</span>
                    <span className="text-white">
                      {booking?.date}, {booking?.time}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <div className="text-sm text-gray-400 mb-2">Organized by</div>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarImage src={booking?.userIds[0].profileImage || "/placeholder.svg"} />
                      <AvatarFallback className="bg-green-600 text-white text-sm">
                        {booking?.userIds[0].name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-white font-medium">{booking?.userIds[0].name}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Game Wallet */}
            <Card className="bg-gradient-to-br from-emerald-900/30 to-green-900/30 border-green-700/50 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center text-green-400">
                  <Wallet className="w-5 h-5 mr-2" />
                  Game Wallet
                </CardTitle>
                <CardDescription className="text-gray-400">Collected contributions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6 bg-green-500/10 rounded-xl border border-green-600/30">
                  <div className="text-sm text-gray-400 mb-2">Current Balance</div>
                  <div className="text-3xl font-bold text-green-300">₹{totalContributions.toFixed(2)}</div>
                  <div className="text-sm text-gray-400 mt-2">
                    {booking?.price ? ((totalContributions / booking.price) * 100).toFixed(1) : "0.0"}% collected
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${booking?.price ? Math.min((totalContributions / booking.price) * 100, 100) : 0}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
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
                {turf?.name} - Location Map
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

export default JoinedGameDetails
