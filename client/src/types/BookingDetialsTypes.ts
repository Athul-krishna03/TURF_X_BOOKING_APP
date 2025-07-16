export interface User {
    id: string
    name: string
    email: string
    profileImage?: string
    walletBalance: number
}

export interface TurfDetails {
    turfPhotos: string[]
    name: string
    location: {
        city:string,
        state:string,
        coordinates:{
            coordinates:Array<number | undefined>
        }
    }
    imageUrl?: string
    aminities: string[]
}

export interface Booking {
    walletContributions(walletContributions: any): unknown
    playerCount: number
    userIds: {
        _id: string
        name: string
        profileImage?: string
    }[]
    _id: string
    date: string
    time: string
    duration: number
    price: number
    status: "Booked" | "Pending" | "Cancelled"
    participants: User[]
    createdBy: User
}

export interface JoinedGameData {
    booking: Booking
    turf: TurfDetails
}