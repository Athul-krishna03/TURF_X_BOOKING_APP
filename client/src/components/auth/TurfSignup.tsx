"use client"

import type React from "react"
import { useState } from "react"
import { Formik, Form } from "formik"
import { turfvalidationSchema } from "../../utils/turfValidation"
import type { TurfFormValues, LocationCoordinates } from "../../types/TurfTypes"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Building2, Mail, Phone, Lock, MapPin, Zap } from "lucide-react"

import PhotoUpload from "../turf/turfDetialsComponents/photo-upload"
import AmenitiesSelector from "../turf/turfDetialsComponents/amenities-selector"
import MapLocationPicker from "../turf/turfDetialsComponents/map-location-picker"
import FormField from "../turf/turfDetialsComponents/form-field"

interface SignupFormProps {
  onSubmit: (values: TurfFormValues, formikHelpers: { setSubmitting: (isSubmitting: boolean) => void }) => void
}

const TurfRegisterForm: React.FC<SignupFormProps> = ({ onSubmit }) => {
  const [coordinates, setCoordinates] = useState<LocationCoordinates>({
    lat: 12.9716, 
    lng: 77.5946,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-8 px-4">
      <div className="mx-auto w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Register Your Turf</h1>
          <p className="text-gray-600">Join our platform and start managing your turf bookings</p>
        </div>

        <Formik<TurfFormValues>
          initialValues={{
            status: "pending",
            name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            courtSize: "",
            description: "",
            pricePerHour: "",
            isBlocked: false,
            aminities: [],
            turfPhotos: [],
            turfPhotoUrls: [],
            location: {
              address:"",
              city:"",
              state:"",
              coordinates:{
                type:"Point",
                coordinates:[coordinates.lng,coordinates.lat]
              }
            },
          }}
          validationSchema={turfvalidationSchema}
          onSubmit={(values, { setSubmitting }) => {
            values.location.coordinates.type="Point"
            values.location.coordinates.coordinates= [coordinates.lng,coordinates.lat]
            console.log("Form values", values)
            onSubmit(values, { setSubmitting })
          }}
        >
          {({ values, touched, setFieldValue, isSubmitting }) => (
            <Form className="space-y-8">
              {/* Basic Information */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl text-gray-800">
                    <Building2 className="w-5 h-5 mr-2 text-green-600" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      name="name"
                      label="Turf Name"
                      placeholder="Enter your turf name"
                      icon={<Building2 />}
                      required
                    />

                    <FormField
                      name="email"
                      label="Email Address"
                      type="email"
                      placeholder="your@email.com"
                      icon={<Mail />}
                      required
                    />

                    <FormField
                      name="phone"
                      label="Phone Number"
                      type="tel"
                      placeholder="+91 98765 43210"
                      icon={<Phone />}
                      required
                    />

                    <FormField name="courtSize" label="Court Size" placeholder="e.g., 40x20 meters" required />

                    <FormField
                      name="pricePerHour"
                      label="Price per Hour (₹)"
                      type="number"
                      placeholder="1000"
                      required
                    />

                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          name="password"
                          label="Password"
                          type="password"
                          placeholder="Create a strong password"
                          icon={<Lock />}
                          required
                        />

                        <FormField
                          name="confirmPassword"
                          label="Confirm Password"
                          type="password"
                          placeholder="Confirm your password"
                          icon={<Lock />}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <FormField
                    name="description"
                    label="Description"
                    as="textarea"
                    placeholder="Describe your turf, its features, and what makes it special..."
                    rows={3}
                  />
                </CardContent>
              </Card>

              {/* Location Information with Map */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl text-gray-800">
                    <MapPin className="w-5 h-5 mr-2 text-green-600" />
                    Location Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-3">
                      <FormField
                        name="location.address"
                        label="Full Address"
                        placeholder="Street address, area, landmarks"
                        required
                      />
                    </div>

                    <FormField name="location.city" label="City" placeholder="City name" required />

                    <FormField name="location.state" label="State" placeholder="State name" required />
                  </div>

                  {/* Map Component */}
                  <div className="mt-6">
                    <MapLocationPicker
                      coordinates={coordinates}
                      onLocationChange={(coords) => {
                        console.log("coords",coords)
                        setCoordinates(coords)
                        setFieldValue("location.coordinates.coordinates",[coords.lng,coords.lat])
                      }}
                      onAddressChange={(addressData) => {
                        console.log("Address data from map:", addressData);
                        
                        if (addressData.address) {
                          setFieldValue("location.address", addressData.address)
                        }
                        if (addressData.city ) {
                          setFieldValue("location.city", addressData.city)
                        }
                        if (addressData.state) {
                          setFieldValue("location.state", addressData.state)
                        }
                      }}
                      showCard={false}
                      title="Select Your Turf Location"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Photo Upload */}
              <PhotoUpload
                photos={values.turfPhotos}
                photoUrls={values.turfPhotoUrls}
                onPhotosChange={(photos) => setFieldValue("turfPhotos", photos)}
                onPhotoUrlsChange={(urls) => setFieldValue("turfPhotoUrls", urls)}
                title="Turf Photos"
                error={values.turfPhotos.length === 0 && touched.turfPhotos ? "At least one photo is required" : ""}
              />

              {/* Amenities */}
              <AmenitiesSelector
                selectedAmenities={values.aminities}
                onAmenitiesChange={(amenities) => setFieldValue("aminities", amenities)}
                title="Amenities & Facilities"
              />

              {/* Submit Button */}
              <Card className="shadow-lg border-0 bg-gradient-to-r from-green-600 to-green-700">
                <CardContent className="p-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 text-lg font-semibold bg-white text-green-700 hover:bg-gray-50 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-700 mr-2"></div>
                        Registering Your Turf...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Zap className="w-5 h-5 mr-2" />
                        Register Your Turf
                      </div>
                    )}
                  </Button>
                  <p className="text-center text-green-100 text-sm mt-3">
                    By registering, you agree to our Terms of Service and Privacy Policy
                  </p>
                </CardContent>
              </Card>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default TurfRegisterForm
