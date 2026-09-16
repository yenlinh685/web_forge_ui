'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { FileText, Infinity } from 'lucide-react'
import { toast } from 'sonner'

import { useQuery } from '@tanstack/react-query'
import CourseAccordion from '~/components/course-accordion/CourseAccordion'
import Markdown from '~/components/markdown/Markdown'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import UserAvatar from '~/components/user-avatar/UserAvatar'
import formatDuration from '~/helper/formatDuration'
import handleApiError from '~/helper/handleApiError'
import { queryKeys } from '~/lib/queryKey'
import { selectCurrentUser } from '~/redux/selector'
import { useAppSelector } from '~/redux/types'
import * as courseServices from '~/services/courseServices'

const courseLevelMapping = {
    BEGINNER: 'Cơ bản',
    INTERMEDIATE: 'Trung cấp',
    ADVANCED: 'Nâng cao',
}

const CourseDetailPage = () => {
    const currentUser = useAppSelector(selectCurrentUser)

    const { slug } = useParams()
    const router = useRouter()

    const { data: course } = useQuery({
        queryKey: queryKeys.courses.detail(slug as string),
        queryFn: () => courseServices.getCourseBySlug(slug as string),
        enabled: !!slug,
    })

    const handleRegisterCourse = async () => {
        // check if user is not logged in => redirect to login page
        if (!currentUser) {
            router.push(`/auth/login?redirect_to=${window.location.pathname}`)
            return
        }

        try {
            await courseServices.registerCourse({
                courseId: course?.data.id as string,
            })

            toast.success('Đăng kí khóa học thành công')

            // redirect to learning page after 2 seconds
            setTimeout(() => {
                router.push(`/learning/${course?.data.slug}`)
            }, 2000)
        } catch (error) {
            handleApiError(error)
        }
    }

    return (
        <div className="px-0 py-12 sm:px-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div className="space-y-4">
                    <h1 className="text-5xl leading-15 font-bold">{course?.data.title}</h1>

                    <p className="line-clamp-4 leading-7 text-[#45464D]">{course?.data.description}</p>

                    {course && (
                        <div className="border-border grid grid-cols-3 border-y py-6">
                            <div className="text-center">
                                <p className="text-sm">Thời lượng</p>
                                <p className="text-base font-bold">
                                    {formatDuration(
                                        course.data.chapters.reduce((acc, curr) => {
                                            return acc + (curr.duration || 0)
                                        }, 0) || 0,
                                    )}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm">Bài học</p>
                                <p className="text-base font-bold">
                                    {course.data.chapters.reduce((acc, curr) => {
                                        return acc + (curr.lessons.length || 0)
                                    }, 0)}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm">Cấp độ</p>
                                <p className="text-base font-bold">{courseLevelMapping[course.data.level]}</p>
                            </div>
                        </div>
                    )}
                </div>

                {course && (
                    <div className="flex w-full justify-end">
                        <div className="relative hidden max-h-75 sm:block">
                            <div className="absolute inset-0 max-w-120 rounded-xl bg-linear-to-t from-[#131b2e]/95 to-transparent"></div>
                            <Image
                                src={course.data.thumbnail_url}
                                alt="thumbnail"
                                width={1000}
                                height={1000}
                                className="h-full w-full max-w-120 rounded-xl object-cover"
                            />

                            <div className="absolute bottom-4 left-4 flex gap-2">
                                <UserAvatar
                                    src={course.data.creator?.avatar_url}
                                    className="size-11 border-2 border-white"
                                />

                                <div className="flex flex-col text-white">
                                    <p className="text-sm text-white/90">Giảng viên</p>
                                    <p className="text-base font-semibold">{course.data.creator?.full_name}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col-reverse gap-6 md:mt-16 md:flex-row">
                <div className="flex-1 rounded-xl border border-b p-8">
                    <Markdown>{course?.data.detail || ''}</Markdown>
                </div>
                <div className="h-fit min-w-70 space-y-4 rounded-xl border border-b p-8 shadow-md lg:min-w-80">
                    <h2 className="text-4xl leading-10 font-bold">Miễn phí</h2>

                    {course?.data.is_joined ? (
                        <Link href={`/learning/${course.data.slug}`}>
                            <Button className="w-full py-5">Truy cập khóa học</Button>
                        </Link>
                    ) : (
                        <Button className="w-full py-5" onClick={handleRegisterCourse}>
                            Đăng ký ngay
                        </Button>
                    )}

                    <small className="mt-4 block text-center">Bắt đầu học ngay khi đăng ký</small>

                    <Separator />

                    <p className="text-sm font-semibold">Khóa học bao gồm:</p>

                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                            <Infinity size={18} />
                            Truy cập trọn đời
                        </li>
                        <li className="flex items-center gap-2">
                            <FileText size={18} />
                            Tài liệu & mã nguồn đi kèm
                        </li>
                    </ul>
                </div>
            </div>

            <CourseAccordion course={course} />
        </div>
    )
}

export default CourseDetailPage
