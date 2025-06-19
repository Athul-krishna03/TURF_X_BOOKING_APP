export interface TurfFormValues {
    status: string
    name: string
    email: string
    phone: string
    password: string
    confirmPassword: string
    courtSize: string
    description: string
    pricePerHour: string
    isBlocked: boolean
    aminities: string[]
    games:string[]
    turfPhotos: File[]
    turfPhotoUrls: string[]
    location: {
        address: string;
        city: string;
        state?: string;
        coordinates: {
            type:string,
            coordinates:[number,number]
        };
    };
}

export interface PhotoPreview {
    file: File
    preview: string
}

export interface LocationCoordinates {
    lat: number 
    lng: number 
}
