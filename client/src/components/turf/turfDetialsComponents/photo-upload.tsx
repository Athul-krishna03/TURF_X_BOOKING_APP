"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Button } from "../../ui/button"
import { Label } from "../../ui/label"
import { Upload, X, Camera } from "lucide-react"

interface PhotoUploadProps {
    photos: File[]
    photoUrls: string[]
    onPhotosChange: (photos: File[]) => void
    onPhotoUrlsChange: (urls: string[]) => void
    maxFiles?: number
    maxSizeInMB?: number
    showCard?: boolean
    title?: string
    error?: string
}

export default function PhotoUpload({
    photos,
    photoUrls,
    onPhotosChange,
    onPhotoUrlsChange,
    maxFiles = 10,
    maxSizeInMB = 5,
    showCard = true,
    title = "Upload Photos",
    error,
}: PhotoUploadProps) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (!e.target.files || e.target.files.length === 0) return

        const selectedFiles = Array.from(e.target.files)
        const validFiles: File[] = []
        const newUrls: string[] = []

        selectedFiles.forEach((file) => {
        // Validate file size
        if (file.size > maxSizeInMB * 1024 * 1024) {
            alert(`${file.name} is too large. Maximum size is ${maxSizeInMB}MB.`)
            return
        }

        // Validate file type
        if (!file.type.match("image/*")) {
            alert(`${file.name} is not an image file.`)
            return
        }

        // Check total files limit
        if (photos.length + validFiles.length >= maxFiles) {
            alert(`Maximum ${maxFiles} files allowed.`)
            return
        }

        validFiles.push(file)
        newUrls.push(URL.createObjectURL(file))
        })

        onPhotosChange([...photos, ...validFiles])
        onPhotoUrlsChange([...photoUrls, ...newUrls])
    }

    const removePhoto = (index: number): void => {
        const updatedPhotos = [...photos]
        const updatedUrls = [...photoUrls]

        // Revoke object URL to prevent memory leaks
        if (updatedUrls[index] && updatedUrls[index].startsWith("blob:")) {
        URL.revokeObjectURL(updatedUrls[index])
        }

        updatedPhotos.splice(index, 1)
        updatedUrls.splice(index, 1)

        onPhotosChange(updatedPhotos)
        onPhotoUrlsChange(updatedUrls)
    }

    const uploadContent = (
        <div className="space-y-6">
        <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all duration-200"
            onClick={() => document.getElementById("photo-upload")?.click()}
        >
            <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Photos</h3>
            <p className="text-gray-500 mb-4">Drag and drop photos or click to browse</p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>JPG, PNG or WEBP</span>
                <span>•</span>
                <span>Max {maxSizeInMB}MB each</span>
                <span>•</span>
                <span>Up to {maxFiles} files</span>
            </div>
            </div>
            <input id="photo-upload" type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {photoUrls.length > 0 && (
            <div>
            <Label className="block mb-3 font-medium text-gray-700">
                Uploaded Photos ({photoUrls.length}/{maxFiles})
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {photoUrls.map((url, index) => (
                <div key={index} className="relative group">
                    <img
                    src={url || "/placeholder.svg"}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg shadow-md transition-transform group-hover:scale-105"
                    />
                    <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                    <X className="w-3 h-3" />
                    </Button>
                </div>
                ))}
            </div>
            </div>
        )}
        </div>
    )

    if (!showCard) {
        return uploadContent
    }

    return (
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-xl text-gray-800">
            <Camera className="w-5 h-5 mr-2 text-green-600" />
            {title}
            </CardTitle>
        </CardHeader>
        <CardContent>{uploadContent}</CardContent>
        </Card>
    )
}
