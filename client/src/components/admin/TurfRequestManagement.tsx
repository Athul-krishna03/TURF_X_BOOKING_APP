"use client"
import { Search, Eye, FileQuestion } from "lucide-react"
import { Button } from "../ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { type SetStateAction, useEffect, useState } from "react"
import { debounce } from "lodash"
import { useGetAllTurfRequestsQuery } from "../../hooks/admin/useGetAllTurfRequests"
import { getAllTurfRequests } from "../../services/admin/adminService"
import type { ITurf, TurfFormValues } from "../../types/Type"
import { Pagination1 } from "./Pagination"
import { useUpdateTurfRequest } from "../../hooks/admin/useUpdateTurfRequest"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Textarea } from "../ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { NoDataFound } from "../layout/NoDataFound"
import { TableLoadingSkeleton } from "../ui/loading/loading-skeletons"

export default function TurfRequestManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery)
  const [currentPage, setCurrentPage] = useState(1)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedTurfId, setSelectedTurfId] = useState<string | null>(null)
  const [selectedTurf, setSelectedTurf] = useState<TurfFormValues | ITurf | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  const limit = 10
  const { mutate: updateRequestStatus } = useUpdateTurfRequest(currentPage, limit, debouncedSearch)

  useEffect(() => {
    const handler = debounce(() => setDebouncedSearch(searchQuery), 300)
    handler()
    return () => handler.cancel()
  }, [searchQuery])

  const { data,isLoading } = useGetAllTurfRequestsQuery(getAllTurfRequests, currentPage, limit, debouncedSearch)

  const turfs = (data?.turfs ?? []) as ITurf[]

  const totalPages = data?.totalPages || 1

  function StatusBadge({ status }: { status: string }) {
    const color = status !== "approved" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
    const label = status !== "approved" ? "Pending" : "Active"

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {label}
      </span>
    )
  }

  const handleApprove = (turfId: string) => {
    updateRequestStatus({ turfId, status: "approved" })
  }

  const openRejectModal = (turfId: string) => {
    setSelectedTurfId(turfId)
    setRejectionReason("")
    setIsRejectModalOpen(true)
  }

  const handleReject = () => {
    if (selectedTurfId) {
      updateRequestStatus({
        turfId: selectedTurfId,
        status: "rejected",
        reason: rejectionReason,
      })
      setIsRejectModalOpen(false)
      setSelectedTurfId(null)
      setRejectionReason("")
    }
  }

  const openViewModal = (turf: ITurf) => {
    setSelectedTurf(turf)
    setIsViewModalOpen(true)
  }

  return (
    
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between mb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>
        {isLoading && <TableLoadingSkeleton rows={5} columns={5} />}
        {turfs.length === 0 && !isLoading && (
          <NoDataFound message="No turf requests found" icon={<FileQuestion className="h-10 w-10 text-gray-400" />} />
        )}
        {!isLoading && turfs.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {turfs.map((turf) => (
              <TableRow key={turf._id}>
                <TableCell className="font-medium">{turf.name}</TableCell>
                <TableCell>{turf.email}</TableCell>
                <TableCell>{turf.phone}</TableCell>
                <TableCell>
                  <StatusBadge status={turf.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => openViewModal(turf)}
                    >
                      <Eye size={16} />
                      View
                    </Button>

                    {turf.status === "Pending" ? (
                      <>
                        <Button variant="destructive" size="sm" onClick={() => openRejectModal(turf._id)}>
                          Reject
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-600"
                          onClick={() => handleApprove(turf._id)}
                        >
                          Approve
                        </Button>
                      </>
                    ) : turf.status === "rejected" ? (
                      <p className="text-red-600 border-red-600">Rejected</p>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}

        {/* Pagination */}
        <Pagination1
          currentPage={currentPage}
          totalPages={totalPages}
          onPageNext={() => setCurrentPage(currentPage + 1)}
          onPagePrev={() => setCurrentPage(currentPage - 1)}
        />
      </div>

      {/* Rejection Reason Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Turf Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this turf request. This will be sent to the turf owner.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e: { target: { value: SetStateAction<string> } }) => setRejectionReason(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectionReason.trim()}>
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Turf Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Turf Details</DialogTitle>
            <DialogDescription>Complete information about the turf registration request</DialogDescription>
          </DialogHeader>

          {selectedTurf && (
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Primary details about the turf</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Status:</span>
                      <Badge
                        variant={
                          selectedTurf.status === "approved"
                            ? "default"
                            : selectedTurf.status === "rejected"
                              ? "destructive"
                              : "outline"
                        }
                      >
                        {selectedTurf.status === "approved"
                          ? "Approved"
                          : selectedTurf.status === "rejected"
                            ? "Rejected"
                            : "Pending"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Turf Name</h4>
                        <p className="text-base">{selectedTurf.name}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Email</h4>
                        <p className="text-base">{selectedTurf.email}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                        <p className="text-base">{selectedTurf.phone}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Type</h4>
                        <p className="text-base">{selectedTurf.courtSize || "Not specified"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Registration Date</h4>
                        <p className="text-base">
                          {new Date(Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Location Details</CardTitle>
                    <CardDescription>Address and location information</CardDescription>
                    <CardContent>
                      
                    </CardContent>
                  </CardHeader>
                </Card>
              </TabsContent>

              <TabsContent value="amenities" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Amenities & Features</CardTitle>
                    <CardDescription>Facilities and services offered</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                          <Separator />
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Amenities</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {selectedTurf.aminities && selectedTurf.aminities.length > 0 ? (
                          selectedTurf.aminities.map((amenity, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span>{amenity}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500">No amenities specified</p>
                        )}
                      </div>
                    </div>

                    <Separator />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Documents & Verification</CardTitle>
                    <CardDescription>Legal documents and verification information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Turf Images</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {selectedTurf.turfPhotos && selectedTurf.turfPhotos.length > 0 ? (
                          selectedTurf.turfPhotos.map((image, index) => (
                            <div
                              key={index}
                              className="aspect-square bg-gray-100 rounded-md flex items-center justify-center"
                            >
                              <img src={image as string} alt="" />
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 col-span-full">No images provided</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter className="flex space-x-2 justify-end mt-4">
            {selectedTurf && selectedTurf.status === "Pending" && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsViewModalOpen(false)
                    if ("_id" in selectedTurf) {
                      openRejectModal(selectedTurf._id)
                    }
                  }}
                >
                  Reject
                </Button>
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    if ("_id" in selectedTurf) {
                      handleApprove(selectedTurf._id)
                    }
                    setIsViewModalOpen(false)
                  }}
                >
                  Approve
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

