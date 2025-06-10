export interface IPushNotificationService {
    sendNotification(
        userId: string,
        title: string,
        body: string,
        notificationType: string,
    ): Promise<void>
}
