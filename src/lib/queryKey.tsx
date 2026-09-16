import { GetCoursesParams as CourseListParams } from '~/services/courseServices'
import { GetNotificationsParams } from '~/services/notificationService'

export const queryKeys = {
    courses: {
        all: ['courses'] as const,
        list: (params: Partial<CourseListParams>) => ['courses', 'list', params] as const,
        detail: (slug: string) => ['courses', 'detail', slug] as const,
    },
    notifications: {
        all: ['notifications'] as const,
        list: (params: Partial<GetNotificationsParams>) => ['notifications', 'list', params] as const,
    },
    categories: {
        all: ['categories'] as const,
    },
    tags: {
        all: ['tags'] as const,
    },
    lessons: {
        all: ['lessons'] as const,
        detail: (lessonId: string) => ['lessons', 'detail', lessonId] as const,
    },
} as const
