export interface ChatRoom {
    gameId: string
    users: string[]
    hostId: string
    name: string
    imageUrl: string
    status: "active" | "inactive"
    updatedAt: {
        $date: string
    }
    createdAt: {
        $date: string
    }
}

export interface Message {
    id: string;
    senderId: string;
    content: string;
    timestamp: Date;
    mediaUrl?: string;
    reactions?: Array<{
        userId: string;
        reaction: string;
    }>;
}

export interface User {
    id: string;
    username: string;
    name: string;
    avatar: string;
    isOnline: boolean;
}