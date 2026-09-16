'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '~/lib/queryKey'
import * as courseServices from '~/services/courseServices'

/**
 *
 * This component will redirect to the first lesson of the course if the user is enrolled in the course.
 * If the user is not enrolled in the course, it will redirect to the course detail page.
 */

const LearningPage = () => {
    const router = useRouter()
    const { course_slug } = useParams()

    const { data: course } = useQuery({
        queryKey: queryKeys.courses.detail(course_slug as string),
        queryFn: () => courseServices.getCourseBySlug(course_slug as string),
        enabled: !!course_slug,
    })

    useEffect(() => {
        if (course) {
            let lastLesson = course.data.chapters[0]?.lessons[0] ?? null

            for (let i = 0; i < course.data.chapters.length; i++) {
                const chapter = course.data.chapters[i]

                let isContinue = true

                for (let j = 0; j < chapter.lessons.length; j++) {
                    const lesson = chapter.lessons[j]

                    lastLesson = lesson

                    if (lesson.progress === null || lesson.progress?.status === 'IN_PROGRESS') {
                        isContinue = false

                        break
                    }
                }

                if (!isContinue) {
                    break
                }
            }

            if (lastLesson) {
                router.replace(`/learning/${course_slug}/${lastLesson.id}`)
            } else {
                toast.error('Không tìm thấy bài học')

                router.replace('/courses')
            }
        }
    }, [course, router, course_slug])

    return <></>
}

export default LearningPage
