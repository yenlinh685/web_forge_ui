import moment from 'moment-timezone'

import 'moment/locale/vi'
import { InfiniteData, useMutation } from '@tanstack/react-query'
import UserAvatar from '~/components/user-avatar/UserAvatar'
import handleApiError from '~/helper/handleApiError'
import { queryClient } from '~/lib/queryClient'
import { queryKeys } from '~/lib/queryKey'
import { cn } from '~/lib/utils'
import * as notificationServices from '~/services/notificationService'
import { NotificationResponse } from '~/types/notification.type'

interface NotificationItemProps {
    notification: NotificationResponse['data'][0]
    queryParams: {
        limit: number
    }
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, queryParams }) => {
    const { mutate: markAsRead } = useMutation({
        mutationFn: () => notificationServices.markAsRead(notification.id),
        onMutate: async (notificationId: string) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.notifications.list(queryParams) })

            const previousData = queryClient.getQueryData<InfiniteData<NotificationResponse>>(
                queryKeys.notifications.list(queryParams),
            )

            queryClient.setQueryData<InfiniteData<NotificationResponse>>(
                queryKeys.notifications.list(queryParams),
                (oldData) => {
                    if (!oldData) {
                        return oldData
                    }
                    return {
                        ...oldData,
                        pages: oldData.pages.map((page) => {
                            return {
                                ...page,
                                data: page.data.map((notification) => {
                                    if (notification.id === notificationId) {
                                        return {
                                            ...notification,
                                            recipient: {
                                                ...notification.recipient,
                                                is_read: true,
                                            },
                                        }
                                    }

                                    return notification
                                }),
                            }
                        }),
                    }
                },
            )

            return { previousData }
        },
        onError: (err, _, context) => {
            queryClient.setQueryData(queryKeys.notifications.list(queryParams), context?.previousData)
        },
    })

    const handleNavigate = () => {
        switch (notification.meta_data?.type) {
            case 'course':
                break
            case 'group':
                break
            default:
                break
        }

        // mark as read if not read
        if (notification.recipient.is_read) {
            return
        }

        try {
            markAsRead(notification.id)
        } catch (error) {
            handleApiError(error)
        }
    }

    return (
        <div className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded-md p-2" onClick={handleNavigate}>
            <UserAvatar src={notification.actor.avatar_url} className="size-13" />

            <div className="flex-1 pr-4">
                <p className="line-clamp-2 text-sm font-medium">{notification.content}</p>

                <span className="text-muted-foreground text-xs">
                    {moment.tz(notification.created_at, 'Asia/Ho_Chi_Minh').fromNow()}
                </span>
            </div>

            <div
                className={cn('bg-chart-2 size-2 rounded-full', {
                    'bg-transparent': !!notification.recipient.is_read,
                })}
            />
        </div>
    )
}

export default NotificationItem
