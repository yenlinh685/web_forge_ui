import { ResponsePagination } from '~/types/apiResponse.type'
import { ChapterModel, CourseModel, CourseTagModel, ProgressModel } from '~/types/course.type'
import { CourseCategoryModel } from '~/types/courseCategory.type'
import axiosClient from '~/utils/axiosClient'

export interface GetCoursesParams {
    page: number
    perPage: number
    category_id?: string
    level?: string
    trending?: boolean
    tag_id?: string
    q?: string
}

export const getCourses = async ({
    page,
    perPage,
    category_id,
    level,
    trending,
    tag_id,
    q,
}: GetCoursesParams): Promise<ResponsePagination<(CourseModel & { category: CourseCategoryModel })[]>> => {
    const response = await axiosClient.get('/courses', {
        params: {
            page,
            per_page: perPage,
            category_id,
            level,
            trending,
            tag_id,
            q,
        },
    })

    return response.data
}

import { ApiResponse } from '~/types/apiResponse.type'
import { LessonModel } from '~/types/lesson.type'
import { UserModel } from '~/types/user.type'

export const getCategories = async (): Promise<ApiResponse<CourseCategoryModel[]>> => {
    const response = await axiosClient.get('/courses/categories')
    return response.data
}

export const getAllTags = async (): Promise<ApiResponse<CourseTagModel[]>> => {
    const response = await axiosClient.get('/courses/tags')
    return response.data
}

export interface CourseDetailResponse extends CourseModel {
    chapters: (ChapterModel & {
        lessons: (LessonModel & {
            progress?: ProgressModel
            video?: {
                duration: number
            }
        })[]
    })[]
    creator?: UserModel
}

export const getCourseBySlug = async (slug: string): Promise<ApiResponse<CourseDetailResponse>> => {
    const response = await axiosClient.get(`/courses/${slug}`)
    return response.data
}

export const registerCourse = async ({ courseId }: { courseId: string }): Promise<ApiResponse<CourseModel>> => {
    const response = await axiosClient.post(`/courses/${courseId}/register`)

    return response.data
}
