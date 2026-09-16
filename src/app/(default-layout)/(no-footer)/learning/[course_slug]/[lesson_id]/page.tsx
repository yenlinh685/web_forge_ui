'use client'

import React, { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Menu } from 'lucide-react'
import { toast } from 'sonner'

import LessonCoding from './components/LessonCoding'
import LessonDocument from './components/LessonDocument'
import LessonQuiz from './components/LessonQuiz'
import LessonVideo from './components/LessonVideo'
import RightSidebarTrigger from './components/RightSidebarTrigger'
import { useQuery } from '@tanstack/react-query'
import { Button } from '~/components/ui/button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '~/components/ui/drawer'
import { Sidebar, SidebarHeader, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar'
import { Skeleton } from '~/components/ui/skeleton'
import { getErrMessageFromAPI } from '~/helper/handleApiError'
import { queryKeys } from '~/lib/queryKey'
import * as lessonServices from '~/services/lessonService'

const LessonPage = () => {
    const router = useRouter()

    const { lesson_id, course_slug } = useParams()

    const {
        data: lesson,
        isFetching,
        isFetched,
        error,
    } = useQuery({
        queryKey: queryKeys.lessons.detail(lesson_id as string),
        queryFn: () => lessonServices.getLessonDetail(lesson_id as string),
        enabled: !!lesson_id,
    })

    useEffect(() => {
        if (isFetched && error) {
            toast.error(getErrMessageFromAPI(error))
            router.push(`/learning/${course_slug}`)
        }
    }, [course_slug, error, isFetched, router])

    if (isFetching && !lesson) {
        return (
            <div className="mx-auto grid max-w-400 grid-cols-1 gap-x-8 p-6 px-0 md:px-6 lg:grid-cols-12">
                <div className="col-span-1 lg:col-span-8">
                    <Skeleton className="h-10 w-2/3 rounded-lg" />
                    <Skeleton className="mt-4 aspect-video w-full rounded-2xl" />
                </div>
                <div className="hidden lg:col-span-4 lg:block">
                    <Skeleton className="h-6 w-1/3 rounded-md" />
                    <Skeleton className="mt-4 h-40 w-full rounded-xl" />
                    <Skeleton className="mt-4 h-40 w-full rounded-xl" />
                </div>
            </div>
        )
    }

    if (error) {
        return null
    }

    const handleNextLesson = () => {
        if (!lesson) {
            return
        }

        if (lesson.data.next_lesson_id) {
            router.push(`/learning/${course_slug}/${lesson.data.next_lesson_id}`)
        }
    }

    const handlePrevLesson = () => {
        if (!lesson) {
            return
        }

        if (lesson.data.prev_lesson_id) {
            router.push(`/learning/${course_slug}/${lesson.data.prev_lesson_id}`)
        }
    }

    return (
        <SidebarProvider className="min-h-0!">
            <RightSidebarTrigger />

            <div className="w-full pb-(--footer-height)">
                {(() => {
                    switch (lesson?.data.type) {
                        case 'VIDEO':
                            return <LessonVideo lesson={lesson} />
                        case 'CODING':
                            return <LessonCoding lesson={lesson} />
                        case 'DOCUMENT':
                            return <LessonDocument lesson={lesson} />
                        case 'QUESTION':
                            return <LessonQuiz lesson={lesson} />
                        default:
                            return null
                    }
                })()}
            </div>

            <Sidebar
                className="overflow-y-auto pt-(--header-height)"
                side="right"
                collapsible="offcanvas"
                variant="sidebar"
                style={
                    {
                        '--sidebar-width': '17.5rem',
                        '--sidebar-width-mobile': '0rem',
                    } as React.CSSProperties
                }
            >
                <SidebarTrigger />
                <SidebarHeader className="w-fit">
                    <SidebarMenuItem className="list-none text-base font-medium">Ghi chú</SidebarMenuItem>
                </SidebarHeader>
            </Sidebar>

            <footer className="rounded-0 border-border fixed right-0 bottom-0 left-0 z-50 flex h-(--footer-height) items-center justify-center gap-4 border-t bg-white">
                <Button variant="outline" size="lg" className="rounded-0" onClick={handlePrevLesson}>
                    Bài học trước đó
                </Button>

                <Button
                    variant="default"
                    size="lg"
                    className="rounded-0"
                    disabled={!lesson?.data.progress || lesson?.data.progress.status !== 'COMPLETED'}
                    onClick={handleNextLesson}
                >
                    Bài học tiếp theo
                </Button>

                <Drawer direction="right">
                    <DrawerTrigger asChild>
                        <Button
                            className="absolute top-1/2 right-4 -translate-y-1/2 active:translate-y-[calc(-50%+3px)]!"
                            size={'icon'}
                            variant={'secondary'}
                        >
                            <Menu />
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Bài học, phòng học ...</DrawerTitle>
                        </DrawerHeader>
                    </DrawerContent>
                </Drawer>
            </footer>
        </SidebarProvider>
    )
}

export default LessonPage
