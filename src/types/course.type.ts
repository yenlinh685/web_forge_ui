import { BaseModel } from './apiResponse.type'

export const COURSE_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const
export const COURSE_STATUS = ['PUBLISHED', 'ARCHIVED'] as const

export type CourseLevel = (typeof COURSE_LEVELS)[number]
export type CourseStatus = (typeof COURSE_STATUS)[number]
export interface CourseTagModel extends BaseModel {
    name: string
}

export interface CourseModel extends BaseModel {
    thumbnail_url: string
    category_id: string
    level: CourseLevel
    title: string
    description: string
    status: CourseStatus
    sort_order: number
    slug: string
    tag: CourseTagModel
    student_count: number
    is_joined?: boolean
    detail: string
}

export interface ChapterModel extends BaseModel {
    course_id: string
    title: string
    order: number
    duration?: number
}

export interface ProgressModel extends BaseModel {
    user_id: string
    lesson_id: string
    status: 'IN_PROGRESS' | 'COMPLETED'
    completed_at: Date | null
}
