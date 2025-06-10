import { useState } from "react";
import { 
    Users, 
    PieChart, 
    CalendarDays, 
    LogOut, 
    Settings, 
    Home,
} from "lucide-react";
import UserManagement from "../../components/admin/UserManagement";
import TurfManagement from "../../components/admin/TurfManagement";
import TurfRequestManagement from "../../components/admin/TurfRequestManagement";
import { adminLogout } from "../../store/slices/admin.slice";
import { useDispatch } from "react-redux";
import { useadminLogout } from "../../hooks/admin/useAdminLogout";
import AdminDashboardComponent from "../../components/admin/AdminDashboard";


const AdminDashboard = () => {
    const [activeMenu, setActiveMenu] = useState("dashboard");
    const dispatch = useDispatch()
    const logoutAdmin = useadminLogout()
    const handleLogout=async ()=>{
        try {
            const response = await logoutAdmin.mutateAsync();
            console.log("Logout response:", response);
            dispatch(adminLogout());
            } catch (error) {
            console.error("Logout error:", error);
            dispatch(adminLogout());
        }
    }
    return (
        <div className="flex h-screen bg-gray-100">
        {/* Sidebar - Desktop */}
        <div className="hidden md:flex flex-col w-64 bg-black text-white">
            <div className="p-5 border-b border-gray-700">
            <h2 className="text-2xl font-bold flex items-center">
                <span className="text-green-500 mr-2">
                <img src="/turf_x.png" alt="Turf-X Logo" className="h-8 w-8" />    
                </span> TURF_X
            </h2>
            </div>
            <div className="flex-1 overflow-y-auto">
            <nav className="px-2 py-4">
                <a 
                href="#" 
                className={`flex items-center px-4 py-3 mb-2 rounded-lg ${activeMenu === "dashboard" ? "bg-green-600 text-white" : "text-gray-300 hover:bg-gray-800"}`}
                onClick={() => setActiveMenu("dashboard")}
                >
                <Home className="h-5 w-5 mr-3" />
                Dashboard
                </a>
                <a 
                href="#" 
                className={`flex items-center px-4 py-3 mb-2 rounded-lg ${activeMenu === "customers" ? "bg-green-600 text-white" : "text-gray-300 hover:bg-gray-800"}`}
                onClick={() => setActiveMenu("customers")}
                >
                <Users className="h-5 w-5 mr-3" />
                Customers
                </a>
                <a 
                href="#" 
                className={`flex items-center px-4 py-3 mb-2 rounded-lg ${activeMenu === "turfs" ? "bg-green-600 text-white" : "text-gray-300 hover:bg-gray-800"}`}
                onClick={() => setActiveMenu("turfs")}
                >
                <PieChart className="h-5 w-5 mr-3" />
                Turfs
                </a>
                <a 
                href="#" 
                className={`flex items-center px-4 py-3 mb-2 rounded-lg ${activeMenu === "bookings" ? "bg-green-600 text-white" : "text-gray-300 hover:bg-gray-800"}`}
                onClick={() => setActiveMenu("request")}
                >
                <CalendarDays className="h-5 w-5 mr-3" />
                Turf Requests
                </a>
            </nav>
            </div>
            <div className="p-4 border-t border-gray-700">
            <a href="#" className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800">
                <Settings className="h-5 w-5 mr-3" />
                Settings
            </a>
            <a href="#" className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800" onClick={handleLogout}>
                <LogOut className="h-5 w-5 mr-3" />
                Logout
            </a>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Header */}
            <header className="bg-white shadow-sm z-10 md:pt-0 pt-16">
            <div className="px-4 py-4 md:px-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                {activeMenu === "dashboard" && "Dashboard Overview"}
                {activeMenu === "customers" && "Customer Management"}
                {activeMenu === "turfs" && "Turf Management"}
                {activeMenu === "request" && "Request Management"}
                {activeMenu === "analytics" && "Analytics & Reports"}
                </h1>
            </div>
            </header>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
            {activeMenu === "dashboard" && (
                <>
                <AdminDashboardComponent/>
                </>
            )}

            {activeMenu === "customers" && (
            <UserManagement/>
            )}

            {activeMenu === "turfs" && (
                <TurfManagement/>
            )}

            {activeMenu === "request" && (
                <TurfRequestManagement/>
            )}
            </main>
        </div>
        </div>
    );
};

export default AdminDashboard;