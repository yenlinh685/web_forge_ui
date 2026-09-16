'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ChartSpline, CodeXml, Plus, SquareTerminal } from 'lucide-react'

import { useQuery } from '@tanstack/react-query'
import CourseItem from '~/components/course-item/CourseItem'
import { Rocket, RocketLaunch } from '~/components/icon/Icon'
import { Button } from '~/components/ui/button'
import { queryKeys } from '~/lib/queryKey'
import * as courseServices from '~/services/courseServices'

const ButtonAnimate = motion.create(Button)
const CourseItemAnimate = motion.create(CourseItem)

const COURSES_LENGTH = 4

const trendingParams = { page: 1, perPage: COURSES_LENGTH, trending: true }

const HomePage = () => {
    const { data: coursesTrending } = useQuery({
        queryKey: queryKeys.courses.list(trendingParams),
        queryFn: async () => {
            const res = await courseServices.getCourses(trendingParams)

            return res.data
        },
    })

    return (
        <div>
            <section className="hero-background px-4 pt-14 pb-20 md:px-10">
                <div className="mx-auto flex max-w-7xl flex-col items-center py-12 md:px-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.3 }}
                        whileInView={{
                            opacity: 1,
                            scale: 1,
                        }}
                        viewport={{
                            once: true,
                        }}
                        className="mb-6 flex items-center gap-2 rounded-full bg-[#ECEEF0] p-1 px-3 text-xs"
                    >
                        <div className="size-2 rounded-full bg-green-500" />
                        Hệ sinh thái học tập đang online
                    </motion.div>

                    <motion.h1
                        className="overflow-hidden text-center text-5xl leading-15 font-bold"
                        initial={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.5 }}
                        whileInView={{
                            opacity: 1,
                            x: 0,
                        }}
                        viewport={{
                            once: true,
                        }}
                    >
                        Không chỉ là video. Đây là{' '}
                        <span className="relative inline-block align-bottom">
                            <motion.span
                                className="from-chart-5 to-chart-3 inline-block bg-linear-to-r bg-clip-text text-transparent"
                                initial={{ y: -40, opacity: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: 0.7,
                                    ease: [0.33, 1, 0.68, 1],
                                }}
                                whileInView={{
                                    y: 0,
                                    opacity: 1,
                                }}
                                viewport={{
                                    once: true,
                                }}
                            >
                                Hệ sinh thái học tập
                            </motion.span>
                        </span>{' '}
                        <span className="overflow-hidden">
                            <motion.span
                                className="inline-block"
                                initial={{ y: 60 }}
                                transition={{ duration: 0.6, delay: 1.3, ease: [0.33, 1, 0.68, 1] }}
                                whileInView={{
                                    y: 0,
                                }}
                                viewport={{
                                    once: true,
                                }}
                            >
                                thực chiến.
                            </motion.span>
                        </span>
                    </motion.h1>

                    <motion.p
                        className="text-muted-foreground mt-6 px-4 text-center sm:px-16 xl:px-40"
                        initial={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.5, delay: 1.2 }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                        }}
                        viewport={{
                            once: true,
                        }}
                    >
                        H9N Learning kết hợp lộ trình cá nhân hóa, dự án thực chiến và không gian học tập cộng đồng theo
                        thời gian thực để thúc đẩy hiệu suất của bạn.
                    </motion.p>

                    <div className="mt-10 flex items-center gap-4">
                        <Link href={'/courses'}>
                            <ButtonAnimate
                                initial={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.8, delay: 2 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="px-8 py-5 transition-colors"
                            >
                                Bắt đầu ngay <ArrowRight className="size-4" />
                            </ButtonAnimate>
                        </Link>
                        <ButtonAnimate
                            initial={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.8, delay: 2 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            variant="outline"
                            className="px-8 py-5 transition-colors"
                        >
                            Khám phá lộ trình
                        </ButtonAnimate>
                    </div>
                </div>
            </section>
            <section className="bg-[#F2F4F6] py-24 sm:px-10">
                <motion.h2
                    className="text-3xl leading-10 font-bold"
                    initial={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.5 }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                    }}
                >
                    Lộ trình học lập trình tương tác
                </motion.h2>
                <motion.p
                    className="text-muted-foreground mt-3 sm:max-w-1/2"
                    initial={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.5 }}
                    whileInView={{
                        opacity: 1,
                        x: 0,
                    }}
                    viewport={{
                        once: true,
                    }}
                >
                    Hành trình được thiết kế trực quan, giúp bạn nắm bắt mục tiêu và tiến độ một cách rõ ràng nhất.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    whileInView={{
                        opacity: 1,
                    }}
                    viewport={{
                        once: true,
                    }}
                    className="group relative mt-12 flex h-75 w-full items-center justify-center overflow-hidden rounded-xl border p-8 shadow-sm transition-colors duration-300"
                >
                    <div className="absolute inset-0 overflow-hidden">
                        <Image
                            src="/static/hero-img.png"
                            alt=""
                            fill
                            className="object-cover opacity-100 transition-all duration-500"
                            loading="eager"
                        />
                    </div>
                    <div className="relative z-10 flex w-full max-w-3xl items-center justify-between">
                        <div className="flex flex-col items-center gap-3">
                            <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 shadow-sm">
                                <RocketLaunch className="text-chart-5" />
                            </div>
                            <span className="text-primary text-center text-sm font-medium">Nền tảng</span>
                        </div>
                        <div className="bg-chart-4 relative mx-4 mb-7 h-1 flex-1">
                            <div className="bg-chart-4 absolute top-0 left-0 h-full w-1/2 rounded-full"></div>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="bg-primary z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 shadow-sm">
                                <CodeXml className="text-white" />
                            </div>
                            <span className="text-primary text-center text-sm font-medium">Thực hành</span>
                        </div>
                        <div className="bg-chart-4 mx-4 mb-7 h-1 flex-1"></div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="bg-muted z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 shadow-sm">
                                <Rocket className="text-black" />
                            </div>
                            <span className="text-primary text-center text-sm font-medium">Dự án cuối khóa</span>
                        </div>
                    </div>
                </motion.div>
            </section>

            <section className="grid grid-cols-12 gap-6 py-24 shadow-xs sm:px-10 md:gap-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                    }}
                    className="col-span-12 flex flex-col gap-10 rounded-xl border border-[#E2E8F0] p-6 sm:p-10 md:col-span-7 lg:flex-row lg:items-center"
                >
                    <div className="flex flex-col gap-4">
                        <ChartSpline size={20} strokeWidth={2.8} className="text-chart-4" />

                        <h2 className="text-2xl font-semibold">Lộ trình học tập (Roadmap)</h2>

                        <p className="text-muted-foreground xl:max-w-2/3">
                            Đừng chỉ học rời rạc. Chúng tôi xây dựng các &apos;Learning Paths&apos; dựa trên mục tiêu
                            nghề nghiệp của bạn.
                        </p>
                    </div>

                    <ButtonAnimate
                        initial={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                        whileInView={{
                            opacity: 1,
                            x: 0,
                        }}
                        viewport={{
                            once: true,
                        }}
                        variant="default"
                        className="bg-chart-5 hover:bg-chart-4 w-fit px-6 py-5 transition-colors"
                    >
                        Khám phá Roadmap ngay
                    </ButtonAnimate>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                    }}
                    className="col-span-12 flex flex-col gap-4 rounded-xl border border-[#E2E8F0] p-10 md:col-span-5"
                >
                    <SquareTerminal size={20} strokeWidth={2.8} className="text-chart-4" />

                    <h2 className="text-2xl font-semibold">Dự án thực chiến</h2>

                    <p className="text-muted-foreground">
                        Xây dựng sản phẩm thực tế từ ngày đầu. Không gian 24/7 để bạn code cùng bạn bè. Live-share code
                        và tài liệu dùng chung.
                    </p>

                    <ButtonAnimate
                        initial={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                        }}
                        viewport={{
                            once: true,
                        }}
                        className="w-fit px-6 py-5 transition-colors"
                    >
                        <Plus />
                        Tạo dự án
                    </ButtonAnimate>
                </motion.div>
            </section>

            <section className="hero-background py-24 shadow-xs sm:px-10">
                <div className="w-full justify-between sm:flex sm:items-center">
                    <div className="flex-1">
                        <motion.h1
                            initial={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            viewport={{
                                once: true,
                            }}
                            className="text-4xl leading-10 font-bold"
                        >
                            Khóa Học & Dự Án
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.5 }}
                            whileInView={{
                                opacity: 1,
                                x: 0,
                            }}
                            viewport={{
                                once: true,
                            }}
                            className="text-muted-foreground mt-2 sm:max-w-[75%]"
                        >
                            Áp dụng kiến thức ngay lập tức vào các dự án thực tế.
                        </motion.p>
                    </div>

                    <div className="flex w-full justify-end sm:w-fit">
                        <Link href={'/courses'}>
                            <Button variant={'link'} className="text-chart-4 mt-4 sm:mt-0">
                                Xem tất cả <ArrowRight />
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {coursesTrending?.map((course, index) => {
                        return (
                            <React.Fragment key={course.id}>
                                <CourseItemAnimate
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    course={course}
                                />
                            </React.Fragment>
                        )
                    })}
                </div>
            </section>
        </div>
    )
}

export default HomePage
