'use client'

import { useRef, useState } from 'react'

import Markdown from '~/components/markdown/Markdown'
import { Button } from '~/components/ui/button'
import handleApiError from '~/helper/handleApiError'
import usePassLesson from '~/hooks/usePassLession'
import { cn } from '~/lib/utils'
import { LessonDetailResponse } from '~/services/lessonService'
import { ApiResponse } from '~/types/apiResponse.type'
import { createCanvasConfetti } from '~/utils/createCanvasConfetti'

interface LessonQuizProps {
    lesson: NoInfer<ApiResponse<LessonDetailResponse, never>>
}

const LessonQuiz: React.FC<LessonQuizProps> = ({ lesson }) => {
    const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null)
    const [checkedOption, setCheckedOption] = useState<string | null>(null)

    const { passLesson } = usePassLesson(lesson.data)

    const submitBtnRef = useRef<HTMLButtonElement>(null)

    const handleSelectOption = (answerId: string) => {
        setCheckedOption(null)
        setSelectedAnswerId(answerId)
    }

    const handleCheck = () => {
        try {
            const answer = lesson.data.answers?.find((answer) => answer.id === selectedAnswerId)

            if (answer) {
                setCheckedOption(answer.id)
            }

            // check if answer is correct => submit to API
            if (answer?.is_correct) {
                requestIdleCallback(() => {
                    createCanvasConfetti({
                        x: 0.5,
                        y: 0,
                    })
                })

                if (submitBtnRef.current) {
                    submitBtnRef.current.disabled = true
                }

                passLesson()
            }
        } catch (error) {
            handleApiError(error)
        } finally {
            if (submitBtnRef.current) {
                submitBtnRef.current.disabled = false
            }
        }
    }

    return (
        <div className="mx-auto max-w-7xl px-6 py-8">
            <h2 className="text-3xl font-semibold">{lesson.data.title}</h2>

            <div className="mt-4">
                <Markdown>{lesson.data.content}</Markdown>
            </div>

            {/* Quiz options */}
            <div className="mt-6 space-y-4">
                {lesson.data.answers?.map((answer) => {
                    return (
                        <div
                            key={answer.id}
                            className={cn('border-border cursor-pointer rounded-md border px-6 py-3 select-none', {
                                'border-2 border-blue-500': selectedAnswerId === answer.id && checkedOption === null,
                                'border-2 border-green-500 bg-green-50':
                                    answer.is_correct && checkedOption !== null && answer.id === checkedOption,
                                'border-2 border-red-500 bg-red-50':
                                    !answer.is_correct && checkedOption !== null && answer.id === checkedOption,
                            })}
                            onClick={() => handleSelectOption(answer.id)}
                        >
                            <p className="text-sm">{answer.option}</p>
                        </div>
                    )
                })}
            </div>

            <div className="flex w-full justify-end">
                <Button
                    ref={submitBtnRef}
                    className="mt-4 ml-auto px-4"
                    onClick={handleCheck}
                    disabled={!selectedAnswerId}
                >
                    Kiểm tra
                </Button>
            </div>

            {/* Show explanation if isSubmitted and correct answer */}
            {checkedOption && (
                <div>
                    <p className="text-lg font-semibold">Giải thích</p>

                    <div className="mt-3 text-sm">
                        {(() => {
                            const answer = lesson.data.answers?.find((answer) => answer.id === checkedOption)

                            return <Markdown>{answer?.explanation || 'Không có giải thích'}</Markdown>
                        })()}
                    </div>
                </div>
            )}
        </div>
    )
}

export default LessonQuiz
