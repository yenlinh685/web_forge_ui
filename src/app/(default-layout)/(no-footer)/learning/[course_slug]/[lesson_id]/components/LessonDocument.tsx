'use client'

import Markdown from '~/components/markdown/Markdown'
import { LessonDetailResponse } from '~/services/lessonService'
import { ApiResponse } from '~/types/apiResponse.type'

interface LessonDocumentProps {
    lesson: NoInfer<ApiResponse<LessonDetailResponse, never>>
}

const LessonDocument: React.FC<LessonDocumentProps> = ({ lesson }) => {
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
