import { BaseModel } from './apiResponse.type'

export interface LessonModel extends BaseModel {
    chapter_id: string
    uploaded_by: string
    title: string
    content: string
    order: number
    type: 'VIDEO' | 'CODING' | 'QUESTION' | 'DOCUMENT'
    user_codes?: UserCodingFileModel[]
    lesson_questions?: LessonQuestionModel[]
}

export interface LessonQuestionModel extends BaseModel {
    lesson_id: string
    option: string
    is_correct: boolean
    explanation: string
}

export interface VideoModel extends BaseModel {
    thumbnail_url: string
    video_url: string
    lesson_id: string
    video_id: string | null
    video_provider: 'YOUTUBE' | 'UPLOAD'
    duration: number
}

export interface LessonCoddingModel extends BaseModel {
    hints: string
    lesson_id: string
    files: CodingFileModel[]
    test_cases: TestCaseModel[]
}

export interface TestCaseModel extends BaseModel {
    name: string
    assertion: string
    lesson_coding_id: string
}

export interface CodingFileModel extends BaseModel {
    coding_id: string
    file_name: string
    code: string
    read_only: boolean
}

export interface UserCodingFileModel extends BaseModel {
    user_id: string
    lesson_id: string
    file_name: string
    code: string
}
