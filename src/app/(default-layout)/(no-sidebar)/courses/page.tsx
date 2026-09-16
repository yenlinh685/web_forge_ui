'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronDown, Search, Star } from 'lucide-react'

import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import CourseItem from '~/components/course-item/CourseItem'
import { Button } from '~/components/ui/button'
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from '~/components/ui/combobox'
import { Input } from '~/components/ui/input'
import { Spinner } from '~/components/ui/spinner'
import { queryKeys } from '~/lib/queryKey'
import * as courseServices from '~/services/courseServices'
import * as statsServices from '~/services/statsService'
import { CourseLevel } from '~/types/course.type'

interface CourseLevelsMapping {
    label: string
    value?: CourseLevel
}

const courseLevelsMapping: CourseLevelsMapping[] = [
    { label: 'Tất cả', value: undefined }, // value is undefined mean all, ignore when send to api
    { label: 'Cơ bản', value: 'BEGINNER' },
    { label: 'Trung bình', value: 'INTERMEDIATE' },
    { label: 'Nâng cao', value: 'ADVANCED' },
]

const LIMIT = 10

const CoursesPage = () => {
    const { data: stats } = useQuery({
        queryKey: ['stats'],
        queryFn: statsServices.getStats,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    const { data: categories } = useQuery({
        queryKey: queryKeys.categories.all,
        queryFn: courseServices.getCategories,
        staleTime: Infinity, // Category will not change frequently
    })

    const { data: tags } = useQuery({
        queryKey: queryKeys.tags.all,
        queryFn: courseServices.getAllTags,
        staleTime: Infinity, // Tag will not change frequently
    })

    const inputRef = useRef<HTMLInputElement | null>(null)
    const searchButtonRef = useRef<HTMLButtonElement | null>(null)

    const [currentCategory, setCurrentCategory] = useState<string>('all')
    const [currentLevel, setCurrentLevel] = useState<string | undefined>(undefined)
    const [currentTag, setCurrentTag] = useState<string | undefined>(undefined)
    const [searchValue, setSearchValue] = useState<string>('')

    const {
        data: courses,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: queryKeys.courses.list({
            category_id: currentCategory,
            level: currentLevel,
            tag_id: currentTag,
            q: searchValue,
            perPage: LIMIT,
        }),

        initialPageParam: 1,
        queryFn: ({ pageParam }: { pageParam: number }) =>
            courseServices.getCourses({
                category_id: currentCategory === 'all' ? undefined : currentCategory,
                page: pageParam,
                perPage: LIMIT,
                level: currentLevel,
                tag_id: currentTag,
                q: searchValue,
            }),
        getNextPageParam: (lastPage) => {
            if (lastPage.meta.pagination.current_page < lastPage.meta.pagination.total_pages) {
                return lastPage.meta.pagination.current_page + 1
            }
            return undefined
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    return (
        <div className="flex h-full flex-col px-0 py-10 md:px-12">
            <div className="grid gap-8 md:grid-cols-[4fr_3fr] xl:grid-cols-[4fr_2fr]">
                <div className="w-full text-center md:text-left">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mt-2 flex flex-col text-5xl leading-15 font-extrabold"
                    >
                        Khám phá lộ trình{' '}
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="text-chart-5"
                        >
                            Thực chiến
                        </motion.span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="text-muted-foreground mx-auto mt-4 max-w-md leading-7 md:mx-0"
                    >
                        Hệ thống bài học và dự án được thiết kế chuẩn doanh nghiệp, giúp bạn nắm vững tư duy giải quyết
                        vấn đề và xây dựng portfolio chuyên nghiệp.
                    </motion.p>
                    <div className="xs:flex-row mt-6 flex w-full flex-col items-center justify-center gap-3 md:justify-start">
                        <div className="relative w-full max-w-100">
                            <Input
                                className="py-5 pl-8"
                                placeholder="Tìm tên các khóa học hoặc dự án"
                                autoFocus
                                ref={inputRef}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (e.target.value === '') {
                                        setSearchValue('') // reset search when input is empty
                                    }
                                }}
                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                    if (e.key === 'Enter') {
                                        searchButtonRef.current?.click()
                                    }
                                }}
                            />

                            <Search
                                className="text-muted-foreground absolute top-1/2 left-2 -translate-y-1/2"
                                size={16}
                            />
                        </div>

                        <Button
                            ref={searchButtonRef}
                            className="xs:w-fit w-full px-6 py-5"
                            onClick={() => {
                                setSearchValue(inputRef.current?.value || '')
                            }}
                        >
                            Tìm kiếm
                        </Button>
                    </div>
                </div>
                <div className="invisible relative flex w-full justify-end md:visible">
                    <div className="absolute inset-0 rounded-xl bg-linear-to-t from-[#131b2e]/95 via-[#131b2e]/60 to-transparent"></div>
                    <Image
                        src={'/static/community.png'}
                        alt="community"
                        width={1000}
                        height={1000}
                        className="h-70 w-full min-w-75 rounded-xl object-cover"
                    />

                    <div className="absolute bottom-6 left-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center gap-2"
                        >
                            <div className="bg-chart-4 flex-center size-6 rounded-full">
                                <Star size={12} className="text-white" />
                            </div>
                            <p className="selection-inverted text-[13px] font-normal text-white uppercase">
                                Cộng đồng đáng tin cậy
                            </p>
                        </motion.div>

                        {stats && (
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="selection-inverted mt-2 text-2xl leading-8 font-semibold text-white"
                            >
                                {stats?.data.user_count} học viên
                            </motion.p>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-20">
                <h2 className="text-2xl font-semibold">Tất cả tài nguyên</h2>

                <div className="mt-6 flex flex-col-reverse justify-between gap-4 md:flex-row">
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant={currentCategory === 'all' ? 'default' : 'outline'}
                            onClick={() => setCurrentCategory('all')}
                        >
                            Tất cả
                        </Button>

                        {categories?.data.map((category) => (
                            <Button
                                key={category.id}
                                variant={currentCategory === category.id ? 'default' : 'outline'}
                                onClick={() => setCurrentCategory(category.id)}
                            >
                                {category.name}
                            </Button>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <Combobox
                            items={courseLevelsMapping}
                            itemToStringValue={(level) => level.label}
                            itemToStringLabel={(level) => `Độ khó: ${level.label}`}
                            defaultValue={courseLevelsMapping[0]}
                            onValueChange={(value) => {
                                setCurrentLevel(value?.value)
                            }}
                        >
                            <ComboboxInput placeholder="Chọn cấp độ" />
                            <ComboboxContent>
                                <ComboboxEmpty>Không tìm thấy cấp độ nào</ComboboxEmpty>
                                <ComboboxList>
                                    {(item) => (
                                        <ComboboxItem key={item.label} value={item}>
                                            {item.label}
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>

                        <Combobox
                            items={[
                                { label: 'Tất cả', value: undefined },
                                ...(tags?.data?.map((tag) => {
                                    return {
                                        label: tag.name,
                                        value: tag.id,
                                    }
                                }) || []),
                            ]}
                            itemToStringValue={(level) => level.label}
                            itemToStringLabel={(level) => `Loại: ${level.label}`}
                            defaultValue={courseLevelsMapping[0]}
                            onValueChange={(value) => {
                                setCurrentTag(value?.value)
                            }}
                        >
                            <ComboboxInput placeholder="Chọn loại" />
                            <ComboboxContent>
                                <ComboboxEmpty>Không tìm thấy loại nào</ComboboxEmpty>
                                <ComboboxList>
                                    {(item) => (
                                        <ComboboxItem key={item.label} value={item}>
                                            {item.label}
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </div>
                </div>
            </div>
            <div className="flex-1">
                {!isLoading && courses?.pages[0].data.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-3xl font-bold">
                        Không tìm thấy khóa học nào phù hợp
                    </div>
                ) : (
                    <div className="mt-10 flex flex-col items-center">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {isLoading ? (
                                <Spinner />
                            ) : (
                                courses?.pages
                                    .flatMap((page) => page.data)
                                    .map((course) => <CourseItem key={course.id} course={course} />)
                            )}
                        </div>

                        {hasNextPage && (
                            <Button
                                variant="outline"
                                className="group mt-4 px-6 py-5"
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                            >
                                {isFetchingNextPage ? (
                                    <Spinner />
                                ) : (
                                    <>
                                        <ChevronDown className="linear size-5 transition-all duration-300 group-hover:rotate-180" />
                                        Tải thêm khóa học & dự án
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CoursesPage
