import { useRef } from 'react'
import { useParams } from 'next/navigation'

import { useMutation } from '@tanstack/react-query'
import handleApiError from '~/helper/handleApiError'
import { queryClient } from '~/lib/queryClient'
import { queryKeys } from '~/lib/queryKey'
import * as lessonServices from '~/services/lessonService'
import { LessonDetailResponse } from '~/services/lessonService'

const usePassLesson = (lesson: LessonDetailResponse) => {
    const { course_slug } = useParams()

    const isPassedRef = useRef(lesson.progress?.status === 'COMPLETED')

    const { mutate, isPending } = useMutation({
        mutationFn: () => lessonServices.passLesson(lesson.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.lessons.detail(lesson.id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.courses.detail(course_slug as string) })
        },
        onError: (error) => {
            isPassedRef.current = false
            handleApiError(error)
        },
    })

    const passLesson = () => {
        if (isPassedRef.current || isPending) {
            return
        }

        isPassedRef.current = true
        mutate()
    }

    return { passLesson }
}

export default usePassLesson
