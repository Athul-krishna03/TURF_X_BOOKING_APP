import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Button } from '../../components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Bell, BellRing, Check, CheckCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNotification } from '../../hooks/user/useGetNotification';
import { useUpdateReadStatus } from '../../hooks/user/useUpdateReadStatus'; 
import { NotificationType } from '../../types/NotificationTypes';
import { toast } from 'sonner';


export interface NotificationItemProps {
  id: string;
  title: string;
  message: string;
  createdAt: Date;
  type: NotificationType;
  read: boolean;
}

interface NotificationCenterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NotificationCenter = ({ open, onOpenChange }: NotificationCenterProps) => {
    const { data: notificationsData, isLoading, isError, refetch } = useNotification();
    const updateReadStatus = useUpdateReadStatus();
    const [notifications, setNotifications] = useState<NotificationItemProps[]>([]);

    useEffect(() => {
        if (open) {
        refetch();
        }
    }, [open, refetch]);

    useEffect(() => {
        if (notificationsData?.data) {
        const formatted = notificationsData.data.map((n: {_id:string,title:string,message:string,createdAt:string,type:NotificationType,isRead:boolean}) => ({
            id: n._id,
            title: n.title,
            message: n.message,
            createdAt: new Date(n.createdAt),
            type: n.type,
            read: n.isRead,
        }));
        setNotifications(formatted);
        }
    }, [notificationsData]);

    const unreadCount = notifications.filter((notification) => !notification.read).length;

    const markAsRead = async (id: string) => {
        const previousNotifications = notifications;
        setNotifications((prev) =>
        prev.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification
        )
        );

        try {
        await updateReadStatus.mutateAsync({ id });
        toast.success('Notification marked as read');
        } catch (error) {
        console.error('Failed to mark notification as read:', error);
        setNotifications(previousNotifications); 
        toast.error('Failed to mark notification as read');
        }
    };

    const markAllAsRead = async () => {
        const previousNotifications = notifications;
        setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));

        try {
        await updateReadStatus.mutateAsync({ all: true });
        toast.success('All notifications marked as read');
        } catch (error) {
        console.error('Failed to mark all notifications as read:', error);
        setNotifications(previousNotifications); 
        refetch(); 
        toast.error('Failed to mark all notifications as read');
        }
    };

    const getNotificationStyles = (type: NotificationType) => {
        switch (type) {
        case NotificationType.HOSTED_GAME:
            return 'bg-green-500/20 text-green-400';
        case NotificationType.JOINED_GAME:
            return 'bg-blue-500/20 text-blue-400';
        // case NotificationType.LISTING_APPROVED:
        //     return 'bg-purple-500/20 text-purple-400';
        case NotificationType.CHAT_MESSAGE:
            return 'bg-orange-500/20 text-orange-400';
        case NotificationType.CANCEL_BOOKING:
            return 'bg-red-500/20 text-red-400';
        // case NotificationType.SELLER_REQUEST_APPROVAL:
        //     return 'bg-teal-500/20 text-teal-400';
        default:
            return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] bg-zinc-900 border-zinc-800 text-white p-0">
            <DialogHeader className="px-6 pt-6 pb-4 border-b border-zinc-800 flex flex-row items-center justify-between">
            <div>
                <DialogTitle className="text-xl">Notifications</DialogTitle>
                <p className="text-sm text-gray-400 mt-1">
                {isLoading
                    ? 'Loading notifications...'
                    : isError
                    ? 'Failed to load notifications'
                    : unreadCount > 0
                    ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                    : 'All caught up!'}
                </p>
            </div>
            {notifications.some((n) => !n.read) && (
                <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs bg-zinc-800 hover:bg-zinc-700 border-zinc-700"
                disabled={updateReadStatus.isPending} 
                >
                <CheckCheck size={14} className="mr-1" />
                Mark all as read
                </Button>
            )}
            </DialogHeader>

            <ScrollArea className="max-h-[70vh] px-6 py-4">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="p-6 bg-zinc-800/50 rounded-full mb-4">
                    <Bell size={32} className="text-gray-400" />
                </div>
                <h4 className="text-gray-300 font-medium text-lg">Loading...</h4>
                </div>
            ) : isError ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="p-6 bg-zinc-800/50 rounded-full mb-4">
                    <Bell size={32} className="text-gray-400" />
                </div>
                <h4 className="text-gray-300 font-medium text-lg">Error</h4>
                <p className="text-gray-500 text-sm mt-2 max-w-md">
                    Failed to load notifications. Please try again later.
                </p>
                </div>
            ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="p-6 bg-zinc-800/50 rounded-full mb-4">
                    <Bell size={32} className="text-gray-400" />
                </div>
                <h4 className="text-gray-300 font-medium text-lg">No notifications yet</h4>
                <p className="text-gray-500 text-sm mt-2 max-w-md">
                    We'll let you know when something important happens, like new bids on your vehicles or important system updates.
                </p>
                </div>
            ) : (
                <div className="space-y-3">
                {notifications.map((notification) => (
                    <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 rounded-md transition-all
                        ${notification.read
                        ? 'bg-zinc-800/40 hover:bg-zinc-800'
                        : 'bg-zinc-800 hover:bg-zinc-700 border-l-4 border-blue-500'}`}
                    >
                    <div className={`p-3 rounded-full shrink-0 ${getNotificationStyles(notification.type)}`}>
                        <BellRing size={20} />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                        <h4 className={`font-medium ${notification.read ? 'text-gray-300' : 'text-white'}`}>
                            {notification.title}
                        </h4>
                        <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                        </div>
                        <p className={`mt-1 ${notification.read ? 'text-gray-500' : 'text-gray-400'}`}>
                        {notification.message}
                        </p>
                        <div className="flex justify-end items-center mt-3">
                        {!notification.read && (
                            <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-gray-400 hover:text-black"
                            disabled={updateReadStatus.isPending} 
                            >
                            <Check size={14} className="mr-1" />
                            Mark as read
                            </Button>
                        )}
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            )}
            </ScrollArea>
        </DialogContent>
        </Dialog>
    );
};