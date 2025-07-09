"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { MessageCircle, Upload, X, Users, Camera, Hash } from "lucide-react"
import { toast } from "sonner"
import { uploadProfileImageCloudinary } from "../../utils/cloudinaryImageUpload"

interface CreateChatRoomModalProps {
    trigger?: React.ReactNode
    gameId?: string
    users?: Array<{
        id: string
        name: string
        profileImage?: string
        email: string
    }>
    onCreateRoom?: (roomData: ChatRoomData) => void
    className?: string
}

interface ChatRoomData {
    name: string
    description: string
    imageUrl?: string
}

export default function CreateChatRoomModal({
    trigger,
    users = [],
    onCreateRoom,
    className = "",
    }: CreateChatRoomModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [roomPhoto, setRoomPhoto] = useState<File | null>(null)
    const [photoPreview, setPhotoPreview] = useState<string>("")

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        isPrivate: true,
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
        toast.error("Photo size should be less than 5MB")
        return
        }

        // Validate file type
        if (!file.type.match("image/*")) {
        toast.error("Please select a valid image file")
        return
        }

        setRoomPhoto(file)
        const reader = new FileReader()
        reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    const removePhoto = () => {
        setRoomPhoto(null)
        setPhotoPreview("")
        // Reset file input
        const fileInput = document.getElementById("room-photo-upload") as HTMLInputElement
        if (fileInput) fileInput.value = ""
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name.trim()) {
        toast.error("Please enter a room name")
        return
        }

        if (formData.name.length < 3) {
        toast.error("Room name should be at least 3 characters long")
        return
        }

        setIsSubmitting(true)

        try {
            let imageUrl=""
            if(roomPhoto){
                const response = await uploadProfileImageCloudinary(roomPhoto)
                if(response) imageUrl=response
            }
        const roomData: ChatRoomData = {
            name: formData.name.trim(),
            description: formData.description.trim(),
            imageUrl: imageUrl || "",
        }
        if (onCreateRoom) {
            await onCreateRoom(roomData)
        }

        toast.success("Chat room created successfully!")

        // Reset form
        setFormData({ name: "", description: "", isPrivate: true })
        setRoomPhoto(null)
        setPhotoPreview("")
        setIsOpen(false)
        } catch (error) {
        console.error("Error creating chat room:", error)
        toast.error("Failed to create chat room. Please try again.")
        } finally {
        setIsSubmitting(false)
        }
    }

    const defaultTrigger = (
        <Button className="bg-green-600 hover:bg-green-700 text-white">
        <MessageCircle className="w-4 h-4 mr-2" />
        Create Chat Room
        </Button>
    )

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild className={className}>
            {trigger || defaultTrigger}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-700 text-white">
            <DialogHeader>
            <DialogTitle className="flex items-center text-xl text-green-400">
                <MessageCircle className="w-6 h-6 mr-2" />
                Create Chat Room
            </DialogTitle>
            <DialogDescription className="text-gray-400">
                Set up a chat room for your game session. All participants will be automatically added.
            </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
            {/* Room Photo Upload */}
            <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-300 flex items-center">
                <Camera className="w-4 h-4 mr-2" />
                Room Photo (Optional)
                </Label>

                {!photoPreview ? (
                <div
                    className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-green-500 hover:bg-gray-800/50 transition-all duration-200"
                    onClick={() => document.getElementById("room-photo-upload")?.click()}
                >
                    <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mb-3">
                        <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-400 mb-1">Click to upload room photo</p>
                    <p className="text-xs text-gray-500">JPG, PNG up to 5MB</p>
                    </div>
                    <input
                    id="room-photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    />
                </div>
                ) : (
                <div className="relative">
                    <img
                    src={photoPreview || "/placeholder.svg"}
                    alt="Room preview"
                    className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={removePhoto}
                    className="absolute top-2 right-2 w-8 h-8 p-0"
                    >
                    <X className="w-4 h-4" />
                    </Button>
                </div>
                )}
            </div>

            {/* Room Name */}
            <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-300 flex items-center">
                <Hash className="w-4 h-4 mr-2" />
                Room Name *
                </Label>
                <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter chat room name"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                required
                />
            </div>
            {/* Participants Preview */}
            {users.length > 0 && (
                <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm font-medium text-gray-300 flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        Participants ({users.length})
                    </Label>
                    <Badge variant="outline" className="text-green-400 border-green-600">
                        Auto-added
                    </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                    {users.slice(0, 6).map((participant) => (
                        <div key={participant.id} className="flex items-center bg-gray-700 rounded-full px-3 py-1 text-xs">
                        <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center mr-2 text-white text-xs">
                            {participant.name.charAt(0)}
                        </div>
                        <span className="text-gray-300">{participant.name}</span>
                        </div>
                    ))}
                    {users.length > 6 && (
                        <div className="flex items-center bg-gray-700 rounded-full px-3 py-1 text-xs text-gray-400">
                        +{users.length - 6} more
                        </div>
                    )}
                    </div>
                </CardContent>
                </Card>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
                <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                disabled={isSubmitting}
                >
                Cancel
                </Button>
                <Button
                type="submit"
                disabled={isSubmitting || !formData.name.trim()}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                {isSubmitting ? (
                    <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                    </div>
                ) : (
                    <div className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Create Room
                    </div>
                )}
                </Button>
            </div>
            </form>
        </DialogContent>
        </Dialog>
    )
}
