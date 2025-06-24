"use client"

import type { ChatRoom, User } from "../../types/ChatRoomCommunityTypes"
import { cn } from "../../lib/utils"
import {  MessageCircle, Target } from "lucide-react"

interface ChatRoomsListProps {
  rooms: ChatRoom[]
  selectedRoom: ChatRoom | null
  onRoomSelect: (room: ChatRoom) => void
  getUserInfo: (userId: string) => User
  formatTimestamp: (timestamp: Date) => string;
  getLastMessage: (room: ChatRoom) => string
  getUnreadCount: (room: ChatRoom) => number
}

export function ChatRoomsList({
  rooms,
  selectedRoom,
  onRoomSelect,
  getUserInfo,
  formatTimestamp,
  getLastMessage,
  getUnreadCount,
}: ChatRoomsListProps) {
    if (rooms.length === 0) {
      console.log("userinfo",getUserInfo)
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-green-500/30">
            <MessageCircle className="w-16 h-16 text-green-400" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-500 to-violet-500 rounded-full flex items-center justify-center animate-bounce">
            <Target   className="w-4 h-4 text-white" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-green-400 to-pink-400 bg-clip-text text-transparent">
          No Chat Rooms Yet
        </h3>
        <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
          Join a game! Connect with like-minded individuals and start meaningful conversations.
        </p>
      </div>
    );
  }
  return (
    <div className="divide-y divide-gray-700">
      {rooms
        .slice() 
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .map((room) => {
        const unreadCount = getUnreadCount(room)
        const lastMessage = getLastMessage(room)
        const lastUpdated = formatTimestamp(room.updatedAt)

        return (
          <div
            key={room.gameId}
            onClick={() => onRoomSelect(room)}
            className={cn(
              "p-4 hover:bg-gray-700 cursor-pointer transition-colors",
              selectedRoom?.gameId === room.gameId && "bg-gray-700 border-r-2 border-green-500",
            )}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={room.imageUrl || "/placeholder.svg"}
                  alt={room.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {room.status === "active" && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-medium text-white truncate">{room.name}</h3>
                  </div>
                  <span className="text-xs text-gray-400">{lastUpdated}</span>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-400 truncate">{lastMessage}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{room.users.length} members</span>
                    {unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-green-600 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
