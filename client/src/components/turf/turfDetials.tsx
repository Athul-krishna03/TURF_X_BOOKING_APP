"use client"

import type React from "react"
import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import {
  ArrowLeft,
  Building,
  Edit,
  MapPin,
  Phone,
  Mail,
  KeyRound,
  Camera,
  Star,
  DollarSign,
  Ruler,
  FileText,
} from "lucide-react"
import { turfDetailsSchema } from "../../utils/validations/turfValidator"
import { updateTurfDetails, type updateTurfProfilePayload } from "../../store/slices/turf.slice"
import type { AppDispatch } from "../../store/store"
import { useTurfChangePassword } from "../../hooks/turf/useTurfDashboard"
import ChangeTurfPassword from "../modals/change-password-turf"
import FormField from "../turf/turfDetialsComponents/form-field"
import PhotoUpload from "../turf/turfDetialsComponents/photo-upload"
import AmenitiesSelector from "../turf/turfDetialsComponents/amenities-selector"
import MapLocationPicker from "../turf/turfDetialsComponents/map-location-picker"
import type { LocationCoordinates } from "../../types/TurfTypes"
import { Form, Formik } from "formik"

export default function TurfDetails() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const turf = useSelector((state: any) => state.turf?.turf || {})

  const { mutateAsync } = useTurfChangePassword()
  const [editMode, setEditMode] = useState(false)
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [turfPhotos, setTurfPhotos] = useState<File[]>([])
  const [turfPhotoUrls, setTurfPhotoUrls] = useState<string[]>(turf.turfPhotos || [])

  const [coordinates, setCoordinates] = useState<LocationCoordinates>({
    lat: turf?.location?.coordinates?.lat || 12.9716,
    lng: turf?.location?.coordinates?.lng || 77.5946,
  })

  // Enhanced form data state
  const [formData, setFormData] = useState({
    name: turf.name || "",
    description: turf.description || "",
    address: turf?.location?.address || "",
    city: turf?.location?.city || "",
    state: turf?.location?.state || "",
    phone: turf.phone || "",
    email: turf.email || "",
    courtSize: turf.courtSize || "",
    pricePerHour: turf.pricePerHour || "",
    aminities: turf.aminities || ["Parking", "Changing Rooms", "Floodlights"],
  })

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Save turf details (implementation remains the same as before)
  const saveChanges = async () => {
    try {
      setIsSubmitting(true)
      await turfDetailsSchema.validate(formData, { abortEarly: false })

      const updatedTurfData: updateTurfProfilePayload = {
        ...formData,
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          coordinates: {
            lat: coordinates.lat,
            lng: coordinates.lng,
          },
        },
        turfPhotos: turfPhotoUrls,
      }

      await dispatch(updateTurfDetails(updatedTurfData))
      toast.success("Turf details updated successfully")
      setEditMode(false)
    } catch (error) {
      console.error("Error updating turf details:", error)
      toast.error("Failed to update turf details")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle password change
  const handlePasswordChange = async (data: { currentPassword: string; newPassword: string }) => {
    try {
      const response = await mutateAsync({ currPass: data.currentPassword, newPass: data.newPassword })
      if (response.success) {
        toast.success("Password updated successfully")
      }
      setShowPasswordChange(false)
      return Promise.resolve()
    } catch (error: any) {
      toast.error(`Failed to change password: ${error.message || "Unknown error"}`)
      return Promise.reject(error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-6">
        <Button onClick={() => navigate("/turf/dashboard")} variant="ghost" className="mb-8 hover:bg-white/80">
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </Button>

        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Turf Management</h1>
            <p className="text-gray-600">Manage your turf details, photos, and settings</p>
          </div>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="mb-6 bg-white shadow-sm">
              <TabsTrigger value="details" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                Basic Details
              </TabsTrigger>
              <TabsTrigger value="photos" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                Photos
              </TabsTrigger>
              <TabsTrigger
                value="facilities"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                Facilities
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                Security
              </TabsTrigger>
            </TabsList>

            {/* Basic Details Tab */}
            <TabsContent value="details">
              <Card className="shadow-lg border-0">
                <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-green-50 to-green-100">
                  <div>
                    <CardTitle className="text-2xl text-gray-900">Basic Information</CardTitle>
                    <CardDescription className="text-gray-600">
                      Manage your turf's essential details and location
                    </CardDescription>
                  </div>
                  {!editMode && (
                    <Button onClick={() => setEditMode(true)} className="bg-green-600 hover:bg-green-700">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Details
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="p-8">
                  {editMode ? (
                    <Formik
                      initialValues={formData}
                      enableReinitialize
                      onSubmit={(values) => {
                        saveChanges(values)
                      }}
                    >
                      {({ isSubmitting, handleChange, values }) => (
                        <Form>
                          <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField
                                name="name"
                                label="Turf Name"
                                icon={<Building />}
                                value={values.name}
                                onChange={handleChange}
                              />

                              <FormField
                                name="email"
                                label="Email"
                                type="email"
                                icon={<Mail />}
                                value={values.email}
                                onChange={handleChange}
                                readOnly
                              />

                              <FormField
                                name="phone"
                                label="Phone Number"
                                icon={<Phone />}
                                value={values.phone}
                                onChange={handleChange}
                              />

                              <FormField
                                name="courtSize"
                                label="Court Size"
                                icon={<Ruler />}
                                placeholder="e.g., 40x20 meters"
                                value={values.courtSize}
                                onChange={handleChange}
                              />

                              <FormField
                                name="pricePerHour"
                                label="Price per Hour (₹)"
                                type="number"
                                icon={<DollarSign />}
                                placeholder="1000"
                                value={values.pricePerHour}
                                onChange={handleChange}
                              />

                              <div className="md:col-span-2">
                                <FormField
                                  name="description"
                                  label="Description"
                                  as="textarea"
                                  placeholder="Describe your turf..."
                                  rows={3}
                                  value={values.description}
                                  onChange={handleChange}
                                />
                              </div>

                              <div className="md:col-span-2">
                                <FormField
                                  name="address"
                                  label="Address"
                                  value={values.address}
                                  onChange={handleChange}
                                />
                              </div>

                              <FormField
                                name="city"
                                label="City"
                                value={values.city}
                                onChange={handleChange}
                              />

                              <FormField
                                name="state"
                                label="State"
                                value={values.state}
                                onChange={handleChange}
                              />

                              <div className="md:col-span-2">
                                <MapLocationPicker
                                  coordinates={coordinates}
                                  onLocationChange={setCoordinates}
                                  onAddressChange={(addressData) => {
                                    if(addressData.address) {
                                      handleChange({ target: { name: "address", value: addressData.address } })
                                    }
                                    if (addressData.city) {
                                      handleChange({ target: { name: "city", value: addressData.city } })
                                    }
                                    if (addressData.state) {
                                      handleChange({ target: { name: "state", value: addressData.state } })
                                    }
                                  }}
                                  showCard={false}
                                  title="Update Location"
                                />
                              </div>
                            </div>

                            <div className="flex space-x-4 pt-6 border-t">
                              <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-green-600 hover:bg-green-700 px-8 py-2 text-white rounded"
                              >
                                {isSubmitting ? "Saving..." : "Save Changes"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditMode(false)}
                                className="px-8 py-2 border rounded"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </Form>
                      )}
                    </Formik>

                  ) : (
                    // Display mode (same as before but with better styling)
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Turf Information</h3>
                          <div className="space-y-4">
                            <div className="flex items-start">
                              <Building className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                              <div>
                                <p className="font-medium text-gray-900">{formData.name}</p>
                                <p className="text-sm text-gray-500">Turf Name</p>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <FileText className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                              <div>
                                <p className="text-gray-700">{formData.description || "No description provided"}</p>
                                <p className="text-sm text-gray-500">Description</p>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <Ruler className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                              <div>
                                <p className="font-medium text-gray-900">{formData.courtSize}</p>
                                <p className="text-sm text-gray-500">Court Size</p>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <DollarSign className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                              <div>
                                <p className="font-medium text-gray-900">₹{formData.pricePerHour}/hour</p>
                                <p className="text-sm text-gray-500">Pricing</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Contact & Location</h3>
                          <div className="space-y-4">
                            <div className="flex items-start">
                              <MapPin className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                              <div>
                                <p className="text-gray-700">{formData.address}</p>
                                <p className="text-gray-700">
                                  {formData.city}, {formData.state}
                                </p>
                                <p className="text-sm text-gray-500">Address</p>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <Phone className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                              <div>
                                <p className="font-medium text-gray-900">{formData.phone}</p>
                                <p className="text-sm text-gray-500">Phone Number</p>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <Mail className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                              <div>
                                <p className="font-medium text-gray-900">{formData.email}</p>
                                <p className="text-sm text-gray-500">Email Address</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Photos Tab */}
            <TabsContent value="photos">
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
                  <CardTitle className="flex items-center text-2xl text-gray-900">
                    <Camera className="mr-3 h-6 w-6 text-green-600" />
                    Turf Photos
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Showcase your turf with high-quality photos
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <PhotoUpload
                    photos={turfPhotos}
                    photoUrls={turfPhotoUrls}
                    onPhotosChange={setTurfPhotos}
                    onPhotoUrlsChange={setTurfPhotoUrls}
                    showCard={false}
                    title="Manage Photos"
                  />

                  {editMode && (
                    <div className="flex space-x-4 pt-6 border-t mt-6">
                      <Button
                        onClick={saveChanges}
                        disabled={isSubmitting}
                        className="bg-green-600 hover:bg-green-700 px-8"
                      >
                        {isSubmitting ? "Saving..." : "Save Photos"}
                      </Button>
                      <Button onClick={() => setEditMode(false)} variant="outline" className="px-8">
                        Cancel
                      </Button>
                    </div>
                  )}

                  {!editMode && (
                    <div className="text-center mt-6">
                      <Button onClick={() => setEditMode(true)} className="bg-green-600 hover:bg-green-700">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Photos
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Facilities Tab */}
            <TabsContent value="facilities">
              <Card className="shadow-lg border-0">
                <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-green-50 to-green-100">
                  <div>
                    <CardTitle className="flex items-center text-2xl text-gray-900">
                      <Star className="mr-3 h-6 w-6 text-green-600" />
                      Facilities & Amenities
                    </CardTitle>
                    <CardDescription className="text-gray-600">Highlight what makes your turf special</CardDescription>
                  </div>
                  {!editMode && (
                    <Button onClick={() => setEditMode(true)} className="bg-green-600 hover:bg-green-700">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Facilities
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="p-8">
                  <AmenitiesSelector
                    selectedAmenities={formData.aminities}
                    onAmenitiesChange={(amenities) => setFormData((prev) => ({ ...prev, aminities: amenities }))}
                    showCard={false}
                    title="Available Amenities"
                  />

                  {editMode && (
                    <div className="flex space-x-4 pt-6 border-t mt-6">
                      <Button
                        onClick={saveChanges}
                        disabled={isSubmitting}
                        className="bg-green-600 hover:bg-green-700 px-8"
                      >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button onClick={() => setEditMode(false)} variant="outline" className="px-8">
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
                  <CardTitle className="flex items-center text-2xl text-gray-900">
                    <KeyRound className="mr-3 h-6 w-6 text-green-600" />
                    Security Settings
                  </CardTitle>
                  <CardDescription className="text-gray-600">Manage your account security and privacy</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div>
                      <Button
                        onClick={() => setShowPasswordChange(!showPasswordChange)}
                        className="flex items-center bg-green-600 hover:bg-green-700"
                      >
                        <KeyRound className="mr-2" size={16} />
                        {showPasswordChange ? "Hide Password Change" : "Change Password"}
                      </Button>
                    </div>
                    {showPasswordChange && (
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <ChangeTurfPassword
                          onSubmit={handlePasswordChange}
                          onCancel={() => setShowPasswordChange(false)}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
