"use client";

import { useState, useEffect } from "react";
import { ChatRoomsList } from "../../components/chatRoom/chat-rooms-list";
import { ChatInterface } from "../../components/chatRoom/chat-interface";
import { ChatRoomsListSkeleton } from "../../components/chatRoom/chat-room-list-skeleton";
import { ChatInterfaceSkeleton } from "../../components/chatRoom/chat-interface-skeleton";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import { useGetAllChatRooms } from "../../hooks/user/chatRoom/useGetChatRoom";
import { uploadProfileImageCloudinary } from "../../utils/cloudinaryImageUpload";
import { ChatRoom, Message, User } from "../../types/ChatRoomCommunityTypes";
import { NewsSidebar } from "../../components/chatRoom/news-sidebar";

const socket = io("http://localhost:5000", { autoConnect: false });

export default function CommunityPage() {
  const CURRENT_USER_ID = useSelector((state: any) => state.user.user.id);
  console.log("user id", CURRENT_USER_ID);

  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const { data: chatRoomsData } = useGetAllChatRooms(CURRENT_USER_ID);
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      setSocketConnected(true);
      console.log("Connected to socket server");
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
      console.log("Disconnected from socket server");
    });

    socket.on("error", (error: string) => {
      console.error("Socket error:", error);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("error");
      socket.disconnect();
    };
  }, []);

  console.log("chat rooms data", chatRoomsData);
  useEffect(() => {
    if (chatRoomsData) {
      setChatRooms(chatRoomsData);
      setIsLoadingRooms(false);
    }
  }, [chatRoomsData]);

  // Handle room selection and socket events
  const handleRoomSelect = (room: ChatRoom) => {
    console.log("romm id ", room);

    if (!socketConnected) {
      console.error("Socket not connected");
      return;
    }
    setIsLoadingChat(true);
    setSelectedRoom(room);
    if (selectedRoom) {
      socket.off("chatRoomData");
      socket.off("message");
      socket.off("messageUpdate");
    }

    socket.emit("joinGame", room.gameId, CURRENT_USER_ID);
    socket.on("chatRoomData", ({messages,users}:{messages:Message[],users:User[]}) => {
      console.log("messge data", messages, users);

      setMessages(messages);
      setUsers(users);
      setIsLoadingChat(false);
    });
    socket.on("message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("messageUpdate", (updatedMessage: Message) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg))
      );
    });
  };

  // Send text message
  const handleSendMessage = (content: string) => {
    if (!selectedRoom || !socketConnected) return;

    socket.emit("sendMessage", selectedRoom.gameId, CURRENT_USER_ID, content);
  };

  // Send image
  const handleSendImage = async (file: File) => {
    console.log("file", file);

    if (!selectedRoom || !socketConnected) return;
    const response = await uploadProfileImageCloudinary(file);
    console.log("reponse cloud", response);

    const reader = new FileReader();
    reader.onload = () => {
      socket.emit("sendImage", selectedRoom.gameId, CURRENT_USER_ID, response);
    };
    reader.readAsDataURL(file);
  };

  const getUserInfo = (userId: string): User => {
    const user = users.find((u) => u.id === userId);
    return (
      user || {
        id: userId,
        username: "Unknown User",
        name: "Unknown User",
        avatar: "/placeholder.svg?height=40&width=40",
        isOnline: false,
      }
    );
  };

  const formatTimestamp = (timestamp: Date): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getLastMessage = (room: ChatRoom): string => {
    if (selectedRoom?.gameId === room.gameId && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      return (
        lastMsg.content || (lastMsg.mediaUrl ? "📷 Image" : "No messages yet")
      );
    }
    return "Click to load messages";
  };

  const getUnreadCount = (): number => {
    return 0;
  };

  useEffect(() => {
    return () => {
      socket.off("chatRoomData");
      socket.off("message");
      socket.off("messageUpdate");
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar - Chat Rooms List */}
      <div className="w-1/4 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 bg-gray-900 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-white">
              Chat Rooms
            </h1>
            <div
              className={`w-3 h-3 rounded-full ${
                socketConnected ? "bg-green-500" : "bg-red-500"
              }`}
              title={socketConnected ? "Connected" : "Disconnected"}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoadingRooms ? (
            <ChatRoomsListSkeleton />
          ) : (
            <ChatRoomsList
              rooms={chatRooms}
              selectedRoom={selectedRoom}
              onRoomSelect={handleRoomSelect}
              getUserInfo={getUserInfo}
              formatTimestamp={formatTimestamp}
              getLastMessage={getLastMessage}
              getUnreadCount={getUnreadCount}
            />
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          isLoadingChat ? (
            <ChatInterfaceSkeleton />
          ) : (
            <ChatInterface
              room={selectedRoom}
              messages={messages}
              users={users}
              onSendMessage={handleSendMessage}
              onSendImage={handleSendImage}
              getUserInfo={getUserInfo}
              formatTimestamp={formatTimestamp}
              currentUserId={CURRENT_USER_ID}
              socketConnected={socketConnected}
            />
          )
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-300 mb-2">
                Welcome to Game Chat Rooms
              </h2>
              <p className="text-gray-400">
                Select a chat room to start messaging
              </p>
              {!socketConnected && (
                <p className="text-red-400 mt-2">
                  ⚠️ Socket disconnected - check your server
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      <NewsSidebar className="w-80"/>
    </div>
  );
}
