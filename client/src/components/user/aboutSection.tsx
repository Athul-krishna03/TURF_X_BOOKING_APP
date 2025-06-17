import { Users, MapPin, Calendar, Trophy } from 'lucide-react';

export default function AboutSection() {
    return (
        <section className="px-6 md:px-16 mb-12">
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white via-green-200 to-green-400 bg-clip-text text-transparent">
                MADE FOR THE HOST IN YOU
                </span>
            </h2>
            <p className="text-xl md:text-2xl text-white mb-4">
                ORGANISING A <span className="text-green-400 font-bold">GAME</span> HAS NEVER BEEN THIS EASY!
            </p>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Discover Section */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur border border-gray-700 rounded-3xl p-8">
                <h3 className="text-3xl font-bold text-white mb-6">
                DISCOVER THE BEST<br />
                PLACES TO <span className="text-green-400">PLAY</span>
                </h3>
                <p className="text-gray-300 mb-8 leading-relaxed">
                BROWSE THROUGH THE HOTTEST VENUES IN TOWN, 
                LOOK UP PHOTOS, READ REVIEWS, 
                AND START HOSTING WITHIN MINUTES!
                </p>
                
                {/* Venue Preview Image */}
                <div className="relative rounded-2xl overflow-hidden group">
                <img 
                    src="/vecteezy_ai-generated-soccer-match-on-the-field_42054042.jpg" 
                    alt="Premium Sports Venues"
                    className="w-full h-100 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                    <div className="absolute bottom-4 left-4">
                    <p className="text-white text-lg font-bold">Premium Venues</p>
                    <p className="text-gray-300 text-sm">Discover the best places to play</p>
                    </div>
                </div>
                </div>
            </div>

            {/* Player Management Section */}
            <div className="space-y-8">
                {/* Never Run Short */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur border border-gray-700 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                    NEVER RUN <span className="text-green-400">SHORT</span> OF PLAYERS
                </h3>
                <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                    POST YOUR GAME ON PLAYO AND GET NOTIFICATIONS TO JOIN IN AND COMPLETE YOUR SQUAD!
                </p>
                
                {/* Player Avatars Animation */}
                <div className="relative h-32 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center">
                    {/* Central organizing player */}
                    <div className="w-12 h-12 rounded-full bg-green-500 border-2 border-white flex items-center justify-center z-10">
                        <Users size={20} className="text-white" />
                    </div>
                    
                    {/* Surrounding players */}
                    {[...Array(8)].map((_, index) => {
                        const angle = (index * 45) * (Math.PI / 180);
                        const radius = 50;
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;
                        
                        return (
                        <div
                            key={index}
                            className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border border-white/50 animate-pulse"
                            style={{
                            transform: `translate(${x}px, ${y}px)`,
                            animationDelay: `${index * 0.2}s`
                            }}
                        />
                        );
                    })}
                    </div>
                </div>
                </div>

                {/* Split Bill Section */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur border border-gray-700 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                    <span className="text-green-400">SPLIT</span> THE BILL EFFORTLESSLY
                </h3>
                <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                    GET EACH PLAYER TO PAY FOR THEIR SLOT VIA THE PLAYO APP - PAYMENTS DONE!
                </p>
                
                {/* Payment UI Mockup */}
                <div className="bg-gray-900/50 rounded-2xl p-4 border border-gray-600">
                    <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400">Total Amount</span>
                    <span className="text-white font-bold">₹2,400</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white flex items-center justify-center">
                        <span className="text-xs text-white font-bold">{index + 1}</span>
                        </div>
                    ))}
                    <span className="text-xs text-gray-400 ml-2">5 players</span>
                    </div>
                    <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Per player</span>
                    <span className="text-green-400 font-bold">₹480</span>
                    </div>
                </div>
                </div>
            </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur border border-gray-700/50 rounded-2xl p-6 text-center group hover:border-green-500/50 transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin size={24} className="text-white" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Find Venues</h4>
                <p className="text-gray-400 text-sm">Discover premium sports venues near your location</p>
            </div>

            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur border border-gray-700/50 rounded-2xl p-6 text-center group hover:border-green-500/50 transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar size={24} className="text-white" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Easy Booking</h4>
                <p className="text-gray-400 text-sm">Book your favorite venue in just a few clicks</p>
            </div>

            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur border border-gray-700/50 rounded-2xl p-6 text-center group hover:border-green-500/50 transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Trophy size={24} className="text-white" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Join Games</h4>
                <p className="text-gray-400 text-sm">Connect with players and join exciting matches</p>
            </div>
            </div>
        </div>
        </section>
    );
}