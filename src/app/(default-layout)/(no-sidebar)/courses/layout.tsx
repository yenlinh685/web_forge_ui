import { ReactNode } from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Khóa học | H9N',
    description:
        'H9N Learning kết hợp lộ trình cá nhân hóa, dự án thực chiến và không gian học tập cộng đồng theo thời gian thực để thúc đẩy hiệu suất của bạn.',
}

const CoursesLayout = ({ children }: { children: ReactNode }) => {
    return <>{children}</>
}

export default CoursesLayout
