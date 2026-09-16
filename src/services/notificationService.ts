import { NotificationResponse } from '~/types/notification.type'
import axiosClient from '~/utils/axiosClient'

export interface GetNotificationsParams {
    limit: number
    cursor?: string
}

export const getNotifications = async ({ limit, cursor }: GetNotificationsParams): Promise<NotificationResponse> => {
    const res = await axiosClient.get('/notifications', {
        params: {
            limit,
            cursor,
        },
    })

    return res.data
}

export const markAllAsSeen = async (): Promise<void> => {
    await axiosClient.patch('/notifications/seen')
}

export const markAsRead = async (notificationId: string): Promise<void> => {
    await axiosClient.patch(`/notifications/${notificationId}/read`)
}
