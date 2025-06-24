import { useState, useEffect } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Star, MapPin, Heart, ArrowLeft, Search, Map, X, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { getAllTurfsData } from '../../services/user/userServices';
import { useGetAllTurfsQuery } from '../../hooks/admin/useGetAllTurfs';
import { ITurf } from '../../types/Type';
import { useDispatch } from 'react-redux';
import { setTurfs } from '../../store/slices/turfsDataslice';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Pagination1 } from '../../components/admin/Pagination';
import MapLocationPicker from '../../components/turf/turfDetialsComponents/map-location-picker';

export default function TurfList() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMapPanelOpen, setIsMapPanelOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const limit = 4;
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (err) => {
        setError(err.message || "Location permission denied or unavailable")
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }, [])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const { data, isLoading } = useGetAllTurfsQuery(
    getAllTurfsData,
    currentPage,
    limit,
    debouncedSearch,
    filterOption === "near" ? [location?.lng ?? 0, location?.lat ?? 0] : undefined,
    filterOption !== "near" ? filterOption : undefined
  );

  const handleFilterChange = (val: string) => {
    setFilterOption(() => val)
  }

  const handleLocationSelect = (coords: { lat: number; lng: number }) => {
    setLocation(coords);
    setFilterOption("near");
    setIsMapPanelOpen(false);
  }

  const clearFilters = () => {
    setFilterOption("");
    setSearchQuery("");
  }

  const totalPages = data?.totalPages || 1
  const turfs = (data?.turfs ?? []) as ITurf[];
  dispatch(setTurfs(turfs));

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white overflow-hidden relative">
      {/* Sidebar */}
      <Sidebar isExpanded={isSidebarExpanded} onToggle={toggleSidebar} />

      {/* Main Content */}
      <div className={`flex-1 overflow-y-auto transition-all duration-300 ${isMapPanelOpen ? 'mr-96' : ''}`}>
        <div className="container mx-auto px-4 lg:px-8 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate("/")}
              className="flex items-center text-gray-400 hover:text-white transition-all duration-200 group"
            >
              <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                {turfs.length} venues found
              </div>
            </div>
          </div>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Discover <span className="text-green-400">Premium Venues</span>
            </h1>
            <p className="text-gray-400">Find the perfect turf for your game</p>
          </div>

          {/* Enhanced Search and Filters */}
          <div className="bg-gray-800/30 backdrop-blur border border-gray-700/50 rounded-2xl p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Search Bar */}
              <div className="relative lg:col-span-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search venues, locations, or amenities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 w-full bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                />
              </div>

              {/* Filter Dropdown */}
              <div className="lg:col-span-3">
                <Select value={filterOption} onValueChange={handleFilterChange}>
                  <SelectTrigger className="h-12 w-full bg-gray-700/50 border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-green-500/50">
                    <div className="flex items-center">
                      <SlidersHorizontal className="mr-2 h-4 w-4 text-gray-400" />
                      <SelectValue placeholder="All Venues" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="near" className="text-white hover:bg-gray-700">
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-green-400" />
                        Near By
                      </div>
                    </SelectItem>
                    <SelectItem value="top" className="text-white hover:bg-gray-700">
                      <div className="flex items-center">
                        <Star className="mr-2 h-4 w-4 text-yellow-400" />
                        Top Rated
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Map Location Button */}
              <div className="lg:col-span-2">
                <button
                  onClick={() => setIsMapPanelOpen(true)}
                  className="h-12 w-full px-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 rounded-xl text-white font-medium transition-all duration-200 flex items-center justify-center group shadow-lg shadow-green-500/20"
                >
                  <Map className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">Pick Location</span>
                  <span className="sm:hidden">Map</span>
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Clear Filters */}
              <div className="lg:col-span-1">
                {(filterOption || searchQuery) && (
                  <button
                    onClick={clearFilters}
                    className="h-12 w-full px-4 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 rounded-xl text-gray-300 hover:text-white transition-all duration-200 flex items-center justify-center"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Active Filters Display */}
            {(filterOption || searchQuery) && (
              <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-700/50">
                <span className="text-sm text-gray-400">Active filters:</span>
                {searchQuery && (
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm border border-green-500/30">
                    Search: "{searchQuery}"
                  </span>
                )}
                {filterOption && (
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30">
                    {filterOption === "near" ? "Near By" : "Top Rated"}
                  </span>
                )}
                {location && filterOption === "near" && (
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">
                    Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Loading State */}
          {(isLoading || error) && (
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700/50">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-4 border-green-500/30 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div className="text-sm text-gray-400 animate-pulse">
                    {error ? error : "Loading turf details..."}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Turf Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {turfs
              .filter((turf) => !turf.isBlocked)
              .map((turf) => (
                <div
                  key={turf._id}
                  className="group bg-gray-800/40 backdrop-blur border border-gray-700/50 rounded-2xl overflow-hidden hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300 hover:border-green-500/30"
                >
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={turf.turfPhotos[0]}
                      alt={turf.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Favorite Button */}
                    <button
                      className="absolute top-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur text-white hover:text-red-400 hover:bg-red-500/20 transition-all duration-200 hover:scale-110"
                      aria-label="Add to favorites"
                    >
                      <Heart size={18} />
                    </button>

                    {/* Location Badge */}
                    <div className="absolute bottom-3 left-3 flex items-center bg-black/50 backdrop-blur rounded-full px-3 py-1">
                      <MapPin size={14} className="text-green-400 mr-1" />
                      <span className="text-sm font-medium text-white">{turf.location.city}</span>
                    </div>
                  </div>

                  {/* Info Container */}
                  <div className="p-5 space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg text-white line-clamp-1 group-hover:text-green-400 transition-colors">
                        {turf.name}
                      </h3>
                      
                      {/* Rating */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <div className="flex items-center bg-yellow-500/20 rounded-full px-2 py-1">
                            <Star size={14} className="text-yellow-400 mr-1" fill="currentColor" />
                            <span className="text-sm font-medium text-yellow-400">
                              {turf?.reviewStats ? turf?.reviewStats.averageRating.toFixed(1) : '0.0'}
                            </span>
                          </div>
                          <span className="text-sm text-gray-400">
                            ({turf?.reviewStats ? turf?.reviewStats.totalReviews : 0} reviews)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Book Button */}
                    <button
                      className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-green-500/20 hover:shadow-green-500/30"
                      onClick={() => navigate(`/user/turfDetialsPage/${turf.turfId}`)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* Empty State */}
          {!isLoading && turfs.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-gray-800/30 rounded-2xl p-8 max-w-md mx-auto">
                <div className="text-gray-400 mb-4">
                  <Search size={48} className="mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-white mb-2">No venues found</h3>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination1
                currentPage={currentPage}
                totalPages={totalPages}
                onPageNext={() => setCurrentPage(currentPage + 1)}
                onPagePrev={() => setCurrentPage(currentPage - 1)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Right Side Map Panel */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-gray-900/95 backdrop-blur-xl border-l border-gray-700/50 transform transition-transform duration-300 z-40 ${
        isMapPanelOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Panel Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div>
            <h3 className="text-xl font-semibold text-white">Choose Location</h3>
            <p className="text-sm text-gray-400 mt-1">Select a location to find nearby venues</p>
          </div>
          <button
            onClick={() => setIsMapPanelOpen(false)}
            className="p-2 rounded-full hover:bg-gray-700/50 transition-colors group"
          >
            <X className="h-5 w-5 text-gray-400 group-hover:text-white" />
          </button>
        </div>

        {/* Map Container */}
        <div className="h-full p-6 pb-24">
          <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 h-full">
            <MapLocationPicker
              coordinates={location ?? { lat: 10.0, lng: 76.0 }}
              onLocationChange={handleLocationSelect}
            />
          </div>
        </div>

        {/* Panel Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gray-900/95 backdrop-blur border-t border-gray-700/50">
          <div className="flex space-x-3">
            <button
              onClick={() => setIsMapPanelOpen(false)}
              className="flex-1 px-4 py-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-xl text-gray-300 hover:text-white transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (location) {
                  setFilterOption("near");
                  setIsMapPanelOpen(false);
                }
              }}
              disabled={!location}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-all"
            >
              Apply Location
            </button>
          </div>
          
          {location && (
            <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Selected Coordinates:</div>
              <div className="text-sm text-green-400 font-mono">
                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </div>
            </div>
          )}
        </div>
      </div>
      {isMapPanelOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setIsMapPanelOpen(false)}
        />
      )}
    </div>
  );
}