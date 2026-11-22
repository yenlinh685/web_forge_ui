'use client'

import { useEffect } from 'react'

import Markdown from '~/components/markdown/Markdown'
import usePassLesson from '~/hooks/usePassLession'
import { LessonDetailResponse } from '~/services/lessonService'
import { ApiResponse } from '~/types/apiResponse.type'

interface LessonDocumentProps {
    lesson: NoInfer<ApiResponse<LessonDetailResponse, never>>
}

const LessonDocument: React.FC<LessonDocumentProps> = ({ lesson }) => {
    const { passLesson } = usePassLesson(lesson.data)

    /**
     * Bài học tài liệu (document) được coi là đã hoàn thành ngay khi người dùng mở
     */
    useEffect(() => {
        passLesson()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lesson.data.id])

    return (
        <div className="mx-auto gap-x-8 p-6 pb-4">
            <h1 className="line-clamp-2 text-3xl leading-10 font-bold">{lesson?.data.title}</h1>

            <div className="mt-8">
                <Markdown>{lesson.data.content}</Markdown>
            </div>
        </div>
    )
}

export default LessonDocument
