'use client'

import { useRef, useState } from 'react'
import { Check, X } from 'lucide-react'

import Markdown from '~/components/markdown/Markdown'
import { Button } from '~/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { sendEvent } from '~/helper/events'
import { cn } from '~/lib/utils'
import { LessonDetailResponse } from '~/services/lessonService'
import { CodingFileModel } from '~/types/lesson.type'
import { createCanvasConfetti } from '~/utils/createCanvasConfetti'
import usePassLesson from '~/hooks/usePassLession'

interface LessonCodingSubmitProps {
    lesson: NoInfer<LessonDetailResponse>
    buildHtmlPreview: (files: CodingFileModel[]) => string | null
    files: CodingFileModel[]
}

interface TestResult {
    id: string
    name: string
    passed: boolean | null // null = not run
    message?: string
}

const LessonCodingSubmit = ({ lesson, buildHtmlPreview, files }: LessonCodingSubmitProps) => {
    const iframeRunnerRef = useRef<HTMLIFrameElement>(null)

    const { passLesson } = usePassLesson(lesson)

    const [testResults, setTestResults] = useState<TestResult[]>(() => {
        return (
            lesson.coding?.test_cases.map((testCase) => {
                return {
                    id: testCase.id,
                    name: testCase.name,
                    passed: null,
                    message: '',
                }
            }) || []
        )
    })

    const handleRunTestCase = async () => {
        const iframe = iframeRunnerRef.current
        if (!iframe) {
            return
        }

        const html = buildHtmlPreview(files)

        if (html) {
            iframe.srcdoc = html
        } else {
            return
        }

        /**
         * Wait for iframe to load before running test cases
         */
        await new Promise<void>((resolve) => {
            iframe.onload = () => resolve()
        })

        interface IframeWindow extends Window {
            assert: {
                equal: (actual: unknown, expected: unknown, message: string) => void
                notEqual: (actual: unknown, expected: unknown, message: string) => void
            }
            Function: typeof Function
        }

        const iframeWindow = iframe.contentWindow as IframeWindow

        /**
         * The test case will contain assertions and equality checks, so inject it into the iframe to run the test.
         */
        iframeWindow.assert = {
            equal: (actual, expected, message) => {
                if (actual !== expected) {
                    throw new Error(message)
                }
            },
            notEqual: (actual, expected, message) => {
                if (actual === expected) {
                    throw new Error(message)
                }
            },
        }

        const results: TestResult[] = []

        for (const testCase of lesson.coding?.test_cases || []) {
            try {
                const fn = new iframeWindow.Function(`return (${testCase.assertion})`)()

                await fn.call(iframeWindow)
                results.push({
                    id: testCase.id,
                    name: testCase.name,
                    passed: true,
                })
            } catch (err) {
                results.push({
                    id: testCase.id,
                    name: testCase.name,
                    passed: false,
                    message: err instanceof Error ? err.message : String(err),
                })
            }
        }

        /**
         * Run all test cases and show results
         */
        setTestResults(results)

        /**
         * Handle save all file
         */

        sendEvent('lesson-code:run-test-case', null)

        /**
         * If pass all test cases, run confetti effect and mark the lesson as completed
         */
        if (results.every((result) => result.passed)) {
            passLesson()

            requestIdleCallback(() => {
                createCanvasConfetti({ x: 0.5, y: 1 })
            })
        }
    }

    return (
        <div className="max-h-50 min-h-50 overflow-y-scroll py-1">
            <iframe className="hidden" ref={iframeRunnerRef} />

            <Tabs defaultValue="testcase">
                <div className="border-border flex justify-between border-b">
                    <TabsList variant="line" className="gap-0">
                        <TabsTrigger value="testcase">Testcase</TabsTrigger>
                        <TabsTrigger value="hints">Gợi ý</TabsTrigger>
                    </TabsList>

                    <Button onClick={handleRunTestCase} className="px-5">
                        Kiểm tra
                    </Button>
                </div>
                <TabsContent value="testcase" className="mt-4 space-y-2 overflow-y-scroll px-3">
                    {testResults.map((testResult) => {
                        return (
                            <div key={testResult.id} className="flex items-center gap-3">
                                <div
                                    className={cn('flex-center border-border size-5 rounded-full border', {
                                        'bg-cyan-600': testResult.passed,
                                        'bg-destructive': testResult.passed === false,
                                    })}
                                >
                                    {testResult.passed === true && (
                                        <Check size={12} className="stroke-white" strokeWidth={3} />
                                    )}
                                    {testResult.passed === false && (
                                        <X size={12} className="stroke-white" strokeWidth={3} />
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium">{testResult.name}</p>
                                    {testResult.passed === false && (
                                        <p className="text-destructive">{testResult.message}</p>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </TabsContent>
                <TabsContent value="hints" className="px-2">
                    {lesson.coding?.hints ? (
                        <Markdown>{lesson.coding.hints}</Markdown>
                    ) : (
                        <p className="py-4 text-center">Không có gợi ý</p>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default LessonCodingSubmit
