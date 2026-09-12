'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Users } from 'lucide-react'

import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { cn } from '~/lib/utils'
import { selectCurrentUser } from '~/redux/selector'
import { useAppSelector } from '~/redux/types'
import { CourseModel } from '~/types/course.type'
import { CourseCategoryModel } from '~/types/courseCategory.type'

const RANDOM_COLORS = [
    '#006B57', // Dark green
    '#9863FF', // Light purple
]

const stringToIndex = (str: string, max: number) => {
    let hash = 0

    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i)
        hash |= 0 // convert to 32-bit integer
    }

    return Math.abs(hash) % max
}

const levelMatch = {
    BEGINNER: 'Cơ bản',
    INTERMEDIATE: 'Trung cấp',
    ADVANCED: 'Nâng cao',
} as const

interface CourseItemProps {
    course: CourseModel & {
        category: CourseCategoryModel
    }
    ref?: React.Ref<HTMLDivElement>
}

const CourseItem: React.FC<CourseItemProps> = ({ course, ref }) => {
    const router = useRouter()

    const currentUser = useAppSelector(selectCurrentUser)

    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            className="relative flex flex-col overflow-hidden rounded-lg border border-[#E2E8F0] bg-white transition-shadow duration-200 hover:shadow-xl"
            ref={ref}
        >
            <Link href={`${currentUser ? '/learning' : '/courses'}/${course.slug}`} className="flex flex-1 flex-col">
                <div className="bg-chart-5 absolute top-2 left-3 rounded-md px-3 py-1">
                    <p className="text-xs font-medium text-white">{course.tag.name}</p>
                </div>

                <Image
                    src={course.thumbnail_url}
                    alt=""
                    className="aspect-video object-cover"
                    width={1000}
                    height={1000}
                    loading="eager"
                />
                <div className="flex flex-1 flex-col px-6 pt-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <p
                                className="line-clamp-1 text-sm leading-4 font-semibold uppercase"
                                style={{
                                    color: RANDOM_COLORS[stringToIndex(course.category.name, RANDOM_COLORS.length)],
                                }}
                            >
                                {course.category.name}
                            </p>

                            <div className="size-1 rounded-full bg-gray-300" />
                            <p className="flex items-center gap-1 text-sm leading-4 font-medium whitespace-nowrap">
                                <span className="hidden md:block">Cấp độ:</span> {levelMatch[course.level]}
                            </p>
                        </div>

                        <h3 className="mt-3 line-clamp-2 text-2xl font-bold">{course.title}</h3>

                        <p className="mt-2 line-clamp-2 h-10 text-sm text-gray-600">{course.description}</p>
                    </div>
                </div>
            </Link>

            <div className="px-6 pb-6">
                <Separator className="my-4" />
                <div className="flex w-full items-center justify-between">
                    <p className="flex items-center gap-1 text-sm font-semibold">
                        <Users className="size-4" />
                        {course.student_count} học viên
                    </p>
                    <Button
                        className={cn('border-chart-4 text-chart-4 hover:text-chart-4')}
                        variant={'outline'}
                        onClick={() => {
                            router.push(`/courses/${course.slug}`)
                        }}
                    >
                        Xem chi tiết
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}

export default CourseItem
