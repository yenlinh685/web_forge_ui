'use client'

import { useRef } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Bell } from 'lucide-react'

import NotificationItem from './NotificationItem'
import { InfiniteData, useInfiniteQuery, useMutation } from '@tanstack/react-query'
import { Button } from '~/components/ui/button'
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from '~/components/ui/popover'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip'
import handleApiError from '~/helper/handleApiError'
import { queryClient } from '~/lib/queryClient'
import { queryKeys } from '~/lib/queryKey'
import { selectCurrentUser } from '~/redux/selector'
import { useAppSelector } from '~/redux/types'
import * as notificationServices from '~/services/notificationService'
import { NotificationResponse } from '~/types/notification.type'

const LIMIT = 20

const queryParams = { limit: LIMIT }

const Notification = () => {
    const currentUser = useAppSelector(selectCurrentUser)

    const hasMounted = useRef(false)

    const {
        data: notifications,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: queryKeys.notifications.list(queryParams),
        queryFn: ({ pageParam }) =>
            notificationServices.getNotifications({
                limit: LIMIT,
                cursor: pageParam,
            }),
        getNextPageParam: (lastPage) => {
            if (!lastPage.meta.pagination.has_next_page) {
                return undefined
            }
            return lastPage.meta.pagination.next_cursor
        },
        initialPageParam: undefined as string | undefined,

        enabled: !!currentUser,
    })

    const { mutate: markAllAsSeen } = useMutation({
        mutationFn: notificationServices.markAllAsSeen,
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: queryKeys.notifications.list({ limit: LIMIT }) })

            const previousData = queryClient.getQueryData<InfiniteData<NotificationResponse>>(
                queryKeys.notifications.list({ limit: LIMIT }),
            )

            queryClient.setQueryData<InfiniteData<NotificationResponse>>(
                queryKeys.notifications.list({ limit: LIMIT }),
                (oldData) => {
                    if (!oldData) {
                        return oldData
                    }

                    return {
                        ...oldData,
                        pages: oldData.pages.map((page) => {
                            return {
                                ...page,
                                meta: {
                                    ...page.meta,
                                    unseen_count: 0,
                                },
                            }
                        }),
                    }
                },
            )

            return { previousData }
        },
        onError: (err, _, context) => {
            queryClient.setQueryData(queryKeys.notifications.list({ limit: LIMIT }), context?.previousData)
        },
    })

    const handleMarkAllAsSeen = (open: boolean) => {
        // only call api when open popover first time

        if (!hasMounted.current && open && !!notifications?.pages[0].meta.unseen_count) {
            try {
                markAllAsSeen()
            } catch (error) {
                handleApiError(error)
            }

            hasMounted.current = true
        }
    }

    return (
        <Popover onOpenChange={handleMarkAllAsSeen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell size={28} className="mt-1 size-5" />
                            {!!notifications?.pages[0].meta.unseen_count && (
                                <div className="flex-center absolute -top-1 -right-1 size-4.5 rounded-full bg-red-500 text-xs text-white">
                                    {notifications?.pages[0].meta.unseen_count}
                                </div>
                            )}
                        </Button>
                    </PopoverTrigger>
                </TooltipTrigger>

                <TooltipContent>
                    <p>Thông báo</p>
                </TooltipContent>
            </Tooltip>

            <PopoverContent align="end" className="flex w-110 max-w-[calc(100vw-10px)] flex-col pr-0">
                <PopoverHeader>
                    <PopoverTitle className="text-lg font-semibold">Thông báo</PopoverTitle>
                </PopoverHeader>

                <ScrollArea className="max-h-[calc(100dvh-var(--header-height)*3)]">
                    <InfiniteScroll
                        dataLength={notifications?.pages.flatMap((page) => page.data).length || 0}
                        next={fetchNextPage}
                        hasMore={hasNextPage}
                        loader={<p>Loading...</p>}
                        className="overflow-hidden! pr-3"
                        scrollableTarget="scroll-notification"
                    >
                        {notifications &&
                            notifications.pages
                                .flatMap((page) => page.data)
                                .map((notification) => {
                                    return (
                                        <NotificationItem
                                            key={notification.id}
                                            notification={notification}
                                            queryParams={queryParams}
                                        />
                                    )
                                })}
                    </InfiniteScroll>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    )
}

export default Notification
