'use client'

import { useEffect, useState } from 'react'
import { CirclePlay, Code, FileQuestionMark, Lock } from 'lucide-react'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'
import formatDuration from '~/helper/formatDuration'
import { cn } from '~/lib/utils'
import { CourseDetailResponse } from '~/services/courseServices'
import { ApiResponse } from '~/types/apiResponse.type'

interface CourseAccordionProps {
    course: NoInfer<ApiResponse<CourseDetailResponse, never>> | undefined
}

const CourseAccordion: React.FC<CourseAccordionProps> = ({ course }) => {
    const [defaultExpandChapter, setDefaultExpandChapter] = useState('')

    useEffect(() => {
        if (course) {
            let lastLesson = course.data.chapters[0]?.lessons[0] ?? null

            for (let i = 0; i < course.data.chapters.length; i++) {
                const chapter = course.data.chapters[i]

                let isContinue = true

                for (let j = 0; j < chapter.lessons.length; j++) {
                    const lesson = chapter.lessons[j]

                    lastLesson = lesson

                    if (lesson.progress === null) {
                        isContinue = false

                        break
                    }
                }

                if (!isContinue) {
                    break
                }
            }

            if (lastLesson) {
                setDefaultExpandChapter(lastLesson.chapter_id)
            }
        }
    }, [course])

    return (
        <>
            {defaultExpandChapter && (
                <Accordion type="multiple" defaultValue={[defaultExpandChapter]}>
                    <div className="mt-8 space-y-6">
                        {course?.data.chapters.map((chapter, index) => (
                            <AccordionItem
                                value={chapter.id}
                                key={chapter.id}
                                className="border-border rounded-md border bg-white"
                            >
                                <AccordionTrigger className="flex items-center px-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={cn(
                                                'flex-center size-9 rounded-sm bg-zinc-100 text-lg font-bold',
                                                {
                                                    'bg-black text-white': chapter.id == defaultExpandChapter,
                                                },
                                            )}
                                        >
                                            {index + 1}
                                        </div>

                                        <div>
                                            <p className="font-semibold">
                                                Chương {index + 1}: {chapter.title}
                                            </p>

                                            <p className="text-muted-foreground mt-1 text-[13px]">
                                                {chapter.lessons.length} bài học •{' '}
                                                {formatDuration(chapter.duration || 0)}
                                            </p>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="border-border border-t px-4 py-2">
                                    {chapter.lessons.map((lesson) => {
                                        return (
                                            <div
                                                key={lesson.id}
                                                className={cn(
                                                    'hover:bg-muted flex cursor-pointer items-center justify-between gap-2 rounded-md p-2 py-3 text-black',
                                                    {
                                                        'font-medium': lesson.progress?.status === 'IN_PROGRESS',
                                                    },
                                                )}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {(() => {
                                                        switch (lesson.type) {
                                                            case 'VIDEO':
                                                                return <CirclePlay size={18} />
                                                            case 'CODING':
                                                                return <Code size={18} />
                                                            case 'QUESTION':
                                                                return <FileQuestionMark size={18} />
                                                        }
                                                    })()}

                                                    <p className="text-sm">{lesson.title}</p>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    {lesson.video?.duration && (
                                                        <p className="mb-0! text-xs font-medium">
                                                            {(() => {
                                                                const mins = Math.floor(lesson.video.duration / 60)
                                                                const secs = lesson.video.duration % 60
                                                                return `${String(mins).padStart(2, '0')}:${String(
                                                                    secs,
                                                                ).padStart(2, '0')}`
                                                            })()}
                                                        </p>
                                                    )}

                                                    {!lesson.progress && (
                                                        <Lock size={14} className="text-muted-foreground" />
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </div>
                </Accordion>
            )}
        </>
    )
}

export default CourseAccordion
