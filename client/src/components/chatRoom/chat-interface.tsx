"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Send, Users, ImageIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { ChatRoom, Message, User } from "../../types/ChatRoomCommunityTypes";

interface ChatInterfaceProps {
  room: ChatRoom;
  messages: Message[];
  users: User[];
  onSendMessage: (content: string) => void;
  onSendImage: (file: File) => void;
  getUserInfo: (userId: string) => User;
  formatTimestamp: (timestamp: Date) => string;
  currentUserId: string;
  socketConnected: boolean;
}

export function ChatInterface({
  room,
  messages,
  users,
  onSendMessage,
  onSendImage,
  getUserInfo,
  formatTimestamp,
  currentUserId,
  socketConnected,
}: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim() && socketConnected) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSendImage = () => {
    if (selectedImage && socketConnected) {
      onSendImage(selectedImage);
      setSelectedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  console.log("messages", messages, users);
  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={room.imageUrl || "/placeholder.svg"}
              alt={room.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            {socketConnected && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
            )}
          </div>
          <div>
            <h2 className="font-semibold text-white">{room.name}</h2>
            <p className="text-sm text-gray-400">
              {socketConnected ? "Connected" : "Disconnected"} • {users.length}{" "}
              members
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-400">
            <Users className="h-5 w-5" />
            <span className="text-sm">{users.length}</span>
          </div>
          <div
            className={`w-3 h-3 rounded-full ${
              socketConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
        </div>
      </div>

      {/* Participants List */}
      <div className="p-2 bg-gray-800 border-b border-gray-700">
        <div className="flex flex-wrap gap-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center space-x-1 bg-gray-700 rounded-full px-2 py-1"
            >
              <img
                src={user.avatar || "/placeholder.svg"}
                alt={user.name}
                className="w-4 h-4 rounded-full"
              />
              <span className="text-xs text-gray-300">
                {user.username || user.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const sender = getUserInfo(
              users.find((u) => u.id === message.senderId)?.id || ""
            );
            console.log("sender", sender);
            const isOwn = message.senderId === currentUserId;
            const timestamp = formatTimestamp(message.timestamp);

            return (
              <div
                key={message.id}
                className={cn("flex", isOwn ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative group",
                    isOwn ? "bg-green-600 text-white" : "bg-gray-800 text-white"
                  )}
                >
                  {!isOwn && (
                    <p className="text-xs font-medium mb-1 text-green-400">
                      {sender.username || sender.name}
                    </p>
                  )}

                  {message.content && (
                    <p className="text-sm">{message.content}</p>
                  )}

                  {message.mediaUrl && (
                    <div className="mt-2">
                      <img
                        src={message.mediaUrl || "/placeholder.svg"}
                        alt="Shared image"
                        className="max-w-full rounded cursor-pointer hover:opacity-90"
                        onClick={() => window.open(message.mediaUrl, "_blank")}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-1">
                    <p
                      className={cn(
                        "text-xs",
                        isOwn ? "text-green-200" : "text-gray-400"
                      )}
                    >
                      {timestamp}
                    </p>
                  </div>
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {message.reactions.map((reaction, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-700 rounded px-1 py-0.5"
                          title={`${reaction.reaction} by ${
                            getUserInfo(reaction.userId).username
                          }`}
                        >
                          {reaction.reaction}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview */}
      {selectedImage && (
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <div className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
            <div className="flex items-center space-x-3">
              <img
                src={URL.createObjectURL(selectedImage) || "/placeholder.svg"}
                alt="Preview"
                className="w-12 h-12 rounded object-cover"
              />
              <span className="text-white text-sm">{selectedImage.name}</span>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleSendImage}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                Send
              </Button>
              <Button
                onClick={() => {
                  setSelectedImage(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            size="icon"
            variant="outline"
            className="border-gray-600 text-gray-400 hover:text-white"
            disabled={!socketConnected}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              socketConnected ? "Type a message..." : "Connecting..."
            }
            className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            disabled={!socketConnected}
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="bg-green-600 hover:bg-green-700"
            disabled={!socketConnected || !newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
