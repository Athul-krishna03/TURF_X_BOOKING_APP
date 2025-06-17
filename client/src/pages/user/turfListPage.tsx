import { useState, useEffect } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Star, MapPin, Heart, ArrowLeft, Search } from 'lucide-react';
import { getAllTurfsData } from '../../services/user/userServices';
import { useGetAllTurfsQuery } from '../../hooks/admin/useGetAllTurfs';
import { ITurf } from '../../types/Type';
import { useDispatch } from 'react-redux';
import { setTurfs } from '../../store/slices/turfsDataslice';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Pagination1 } from '../../components/admin/Pagination';

export default function TurfList() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const limit = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption , setFilterOption] = useState("")
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
          setError("Location permission denied or unavailable")
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

  const { data,isLoading } = useGetAllTurfsQuery(
    getAllTurfsData,
    currentPage,
    limit,
    debouncedSearch,
    filterOption === "near" ?  [location?.lng ?? 0, location?.lat ?? 0] :undefined,
    filterOption !=="near" ? filterOption:undefined
  );
  const handleFilterChange = (val:string)=>{
    setFilterOption(()=>val)

  }
  const totalPages = data?.totalPages || 1
  console.log(filterOption)

  const turfs = (data?.turfs ?? []) as ITurf[];
  dispatch(setTurfs(turfs));
  console.log(turfs);
  return (
  <div className="flex h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      {/* Sidebar */}
      <Sidebar isExpanded={isSidebarExpanded} onToggle={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate("/")}
              className="flex items-center text-gray-400 hover:text-white transition-colors duration-200 group"
            >
              <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </button>
          </div>

          {/* Page Title */}
          <h1 className="text-2xl font-bold text-green-400 mb-6">Venues</h1>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
            <div className="relative md:col-span-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search games, venues, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full bg-white/10 border-gray-700 text-white placeholder-gray-400 rounded-xl"
              />
            </div>
            <div className="md:col-span-4">
              <Select value={filterOption} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-full bg-white/10 border-gray-700 text-white rounded-xl">
                  <SelectValue placeholder={filterOption ? filterOption : "Filters"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="near">Near By</SelectItem>
                  <SelectItem value="top">Top rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Turf Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading && 
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
                  <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700/50">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative w-12 h-12">
                        <div className="absolute inset-0 border-4 border-green-500/30 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <div className="text-sm text-gray-400 animate-pulse">
                        Loading turf details...
                      </div>
                    </div>
                  </div>
                </div>
            }
            {turfs
              .filter((turf) => !turf.isBlocked)
              .map((turf) => (
                <div
                  key={turf._id}
                  className="group bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
                >
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={turf.turfPhotos[0]}
                      alt={turf.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <button 
                      className="absolute top-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur text-white hover:text-red-400 hover:bg-red-500/20 transition-all"
                      aria-label="Add to favorites"
                    >
                      <Heart size={18} />
                    </button>
                    <div className="absolute bottom-3 left-3 flex items-center text-white">
                      <MapPin size={14} className="text-green-400 mr-1" />
                      <span className="text-sm font-medium">{turf.location.city}</span>
                    </div>
                  </div>

                  {/* Info Container */}
                  <div className="p-4 space-y-3">
                    <h3 className="font-bold text-lg text-white line-clamp-1">
                      {turf.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star size={14} className="text-yellow-400" />
                        <span className="text-sm font-medium">{turf?.reviewStats ? turf?.reviewStats.averageRating:0}</span>
                        <span className="text-sm text-gray-400">({turf?.reviewStats ?turf?.reviewStats.totalReviews:0})</span>
                      </div>
                    </div>
                    <button
                      className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl font-semibold transition-all transform hover:scale-105"
                      onClick={() => navigate(`/user/turfDetialsPage/${turf.turfId}`)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <Pagination1
            currentPage={currentPage}
            totalPages={totalPages}
            onPageNext={() => setCurrentPage(currentPage + 1)}
            onPagePrev={() => setCurrentPage(currentPage - 1)}
        />
      </div>
      
    </div>

);
}
