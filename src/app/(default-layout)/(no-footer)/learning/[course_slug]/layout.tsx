import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Bài giảng | H9N',
    description: 'Theo dõi tiến độ học tập của bạn và hoàn thành khóa học của bạn',
}

const LearningLayout = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>
}

export default LearningLayout
