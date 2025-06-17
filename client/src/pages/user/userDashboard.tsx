import { useState, useEffect } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { Star, MapPin, ChevronRight, Heart } from 'lucide-react';
import { getAllTurfsData } from '../../services/user/userServices';
import { useGetAllTurfsQuery } from '../../hooks/admin/useGetAllTurfs';
import { ITurf } from '../../types/Type';
import { useDispatch } from 'react-redux';
import { setTurfs } from '../../store/slices/turfsDataslice';
import { useNavigate } from 'react-router-dom';
import { listenForForegroundMessages, requestNotificationPresmission } from '../../services/firebase/messaging';
import { toast } from 'sonner';
import { useStoreFCMToken } from '../../hooks/user/userDashboard';
import AboutSection from '../../components/user/aboutSection';

export default function TurfXDashboard() {
  const { mutate: storeFCMToken } = useStoreFCMToken();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const limit = 10;
  const [searchQuery, setSearchQuery] = useState("");
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
      (error) => {
        setError(error.message || "Location permission denied or unavailable")
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }, [])

  useEffect(() => {
    const setupFCM = async () => {
      const cachedToken = localStorage.getItem('fcmToken');
      const token = await requestNotificationPresmission();
      if (token && token !== cachedToken) {
        storeFCMToken(token, {
          onSuccess: () => {
            localStorage.setItem('fcmToken', token);
            toast.success('Notifications enabled');
          },
          onError: (err:any) => {
            console.error('Failed to save token:', err);
            toast.error('Failed to enable notifications');
          },
        });
      }
      listenForForegroundMessages();
    };
    setupFCM();
  }, [storeFCMToken]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500); 

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const searchData = (val: string) => {
    setSearchQuery(val);
  };

  const { data ,isLoading  } = useGetAllTurfsQuery(
    getAllTurfsData,
    currentPage,
    limit,
    debouncedSearch,
    [location?.lng ?? 0, location?.lat ?? 0]
  );

  const turfs = (data?.turfs ?? []) as ITurf[];
  dispatch(setTurfs(turfs));
  console.log(turfs);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white overflow-hidden">
      <Sidebar isExpanded={isSidebarExpanded} onToggle={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={toggleSidebar} setSearchVal={searchData} />

        <main className="flex-1 overflow-y-auto">
          <section className="relative h-96 overflow-hidden">
            <div className="absolute inset-0 "></div>
            <img 
              src="\turfImage.jpg" 
              alt="Sports venue at night" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
            <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16">
              <div className="max-w-2xl">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4">
                  <span className="bg-gradient-to-r from-white via-green-200 to-green-400 bg-clip-text text-transparent">
                    Play Your
                  </span>
                  <br />
                  <span className="text-white">Best Game</span>
                </h1>
                <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                  Discover premium sports venues near you and book instantly. Join games, meet players, and elevate your sporting experience.
                </p>
                <div className="flex gap-4">
                  <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-2xl font-semibold transition-all transform hover:scale-105 shadow-xl"
                  onClick={()=>navigate("/user/turfList")}>
                    Find Venues
                  </button>
                  <button className="px-8 py-4 bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 rounded-2xl font-semibold transition-all"
                  onClick={()=>navigate("/user/hostedGames")}
                  >
                    Join a Game
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="px-6 md:px-16 mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">
                Popular Venues <span className="bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">Near You</span>
              </h2>
              <button className="text-green-400 hover:text-green-300 flex items-center transition-colors">
                View All <ChevronRight size={18} className="ml-1" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading  || error &&
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
              <div key={turf._id} className="group bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={turf.turfPhotos[0]} 
                    alt={turf.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <button className="absolute top-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur text-white hover:text-red-400 hover:bg-red-500/20 transition-all">
                    <Heart size={18} />
                  </button>
                  <div className="absolute bottom-3 left-3 flex items-center text-white">
                    <MapPin size={14} className="text-green-400 mr-1" />
                    <span className="text-sm font-medium">{turf.location.city}</span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 text-white">{turf.name}</h3>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Star size={14} className="text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{turf?.reviewStats ? turf?.reviewStats.averageRating:0}</span>
                      <span className="text-sm text-gray-400 ml-1">({turf?.reviewStats ?turf?.reviewStats.totalReviews:0})</span>
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
          </section>
          <section>
            <AboutSection/>
          </section>
        </main>
      </div>
    </div>
  );
}
