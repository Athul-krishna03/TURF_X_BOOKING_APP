// SlotList.tsx
import React from 'react';
import { Clock, Calendar, IndianRupee, CheckCircle, XCircle, Ban, Unlock } from 'lucide-react';
import { updateSlotStatus } from '../../../services/turf/turfServices';

export interface Slot {
  _id?: string;
  startTime: string;
  endTime: string;
  price: number;
  date: string;
  isBooked: boolean;
  isBlocked?: boolean; // Added for better state management
}

interface SlotListProps {
  slots: Slot[];
  refetchSlots: () => void;
}

const SlotList: React.FC<SlotListProps> = ({ slots, refetchSlots }) => { 
  const toggleBlock = async (slot: Slot) => {
    try { 
      await updateSlotStatus(slot._id!);
      await refetchSlots();
    } catch (error) {
      console.error('Error toggling block:', error);
      alert('Failed to update slot.');
    }
  };

  const getStatusInfo = (slot: Slot) => {
    if (slot.isBooked) {
      return {
        label: 'Booked',
        color: 'bg-red-500',
        textColor: 'text-red-700',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: <XCircle size={16} className="text-red-500" />
      };
    }
    if (slot.isBlocked) {
      return {
        label: 'Blocked',
        color: 'bg-orange-500',
        textColor: 'text-orange-700',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        icon: <Ban size={16} className="text-orange-500" />
      };
    }
    return {
      label: 'Available',
      color: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      icon: <CheckCircle size={16} className="text-emerald-500" />
    };
  };

  const formatTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return time;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-600 px-6 py-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Clock size={24} />
          Manage Slots
        </h2>
        <p className="text-indigo-100 mt-1">
          {slots.length} slots • {slots.filter(s => !s.isBooked).length} available
        </p>
      </div>

      {/* Slots Grid */}
      <div className="p-6">
        {slots.length === 0 ? (
          <div className="text-center py-12">
            <Clock size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No slots available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {slots.map((slot) => {
              const statusInfo = getStatusInfo(slot);
              
              return (
                <div
                  key={slot._id}
                  className={`relative rounded-xl border-2 ${statusInfo.borderColor} ${statusInfo.bgColor} 
                    transition-all duration-200 hover:shadow-lg hover:scale-105 overflow-hidden group`}
                >
                  {/* Status Badge */}
                  <div className={`absolute top-0 right-0 ${statusInfo.color} text-white px-3 py-1 
                    rounded-bl-lg text-xs font-semibold flex items-center gap-1`}>
                    {statusInfo.icon}
                    {statusInfo.label}
                  </div>

                  <div className="p-4 pt-8">
                    {/* Time Display */}
                    <div className="flex items-center gap-2 mb-3">
                      <Clock size={18} className="text-gray-600" />
                      <span className="text-lg font-bold text-gray-800">
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </span>
                    </div>

                    {/* Date Display */}
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-600 font-medium">
                        {formatDate(slot.date)}
                      </span>
                    </div>

                    {/* Price Display */}
                    <div className="flex items-center gap-2 mb-4">
                      <IndianRupee size={16} className="text-gray-500" />
                      <span className="text-xl font-bold text-gray-800">
                        {slot.price}
                      </span>
                      <span className="text-sm text-gray-500">per hour</span>
                    </div>

                    {/* Action Button */}
                    {!slot.isBooked && (
                      <button
                        onClick={() => toggleBlock(slot)}
                        className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm 
                          transition-all duration-200 flex items-center justify-center gap-2
                          ${slot.isBlocked 
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-emerald-500/25' 
                            : 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-500/25'
                          }`}
                      >
                        {slot.isBlocked ? (
                          <>
                            <Unlock size={16} />
                            Unblock Slot
                          </>
                        ) : (
                          <>
                            <Ban size={16} />
                            Block Slot
                          </>
                        )}
                      </button>
                    )}

                    {slot.isBooked && (
                      <div className="w-full py-2.5 px-4 rounded-lg bg-gray-100 text-gray-500 
                        text-sm font-medium text-center">
                        Cannot modify booked slot
                      </div>
                    )}
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-gray-600">
              {slots.filter(s => !s.isBooked && !s.isBlocked).length} Available
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">
              {slots.filter(s => s.isBooked).length} Booked
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-gray-600">
              {slots.filter(s => s.isBlocked).length} Blocked
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotList;