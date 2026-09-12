import { ReactNode } from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Khóa học | H9N',
    description: 'Khóa học | H9N',
}

const CourseDetailLayout = ({ children }: { children: ReactNode }) => {
    return <>{children}</>
}

export default CourseDetailLayout
