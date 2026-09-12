import { ApiResponse } from '~/types/apiResponse.type'
import { ProgressModel } from '~/types/course.type'
import {
    LessonCoddingModel,
    LessonModel,
    LessonQuestionModel,
    UserCodingFileModel,
    VideoModel,
} from '~/types/lesson.type'
import axiosClient from '~/utils/axiosClient'

export interface LessonDetailResponse extends LessonModel {
    next_lesson_id: string | null
    prev_lesson_id: string | null
    video?: VideoModel
    progress?: ProgressModel
    coding?: LessonCoddingModel
    document?: string
    answers?: LessonQuestionModel[]
}

export const getLessonDetail = async (lessonId: string): Promise<ApiResponse<LessonDetailResponse>> => {
    const { data } = await axiosClient.get(`/lessons/${lessonId}`)

    return data
}

export const saveUserCode = async ({
    lessonId,
    files,
}: {
    lessonId: string
    files: {
        file_name: string
        code: string
    }[]
}) => {
    const { data } = await axiosClient.patch<ApiResponse<UserCodingFileModel[]>>(`/lessons/${lessonId}/code/save`, {
        files,
    })

    return data
}
