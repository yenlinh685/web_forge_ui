'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { emmetCSS, emmetHTML, emmetJSX } from 'emmet-monaco-es'
import type * as Monaco from 'monaco-editor'
import { editor } from 'monaco-editor'

import LessonCodingSubmit from './LessonCodingSubmit'
import Editor, { useMonaco } from '@monaco-editor/react'
import EditorTab from '~/components/editor-tab/EditorTab'
import Markdown from '~/components/markdown/Markdown'
import { Spinner } from '~/components/ui/spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { getMonacoLanguage } from '~/helper/editor'
import { listenEvent } from '~/helper/events'
import handleApiError from '~/helper/handleApiError'
import { cn } from '~/lib/utils'
import * as lessonServices from '~/services/lessonService'
import { LessonDetailResponse } from '~/services/lessonService'
import { ApiResponse } from '~/types/apiResponse.type'
import { CodingFileModel } from '~/types/lesson.type'

interface LessonCodingProps {
    lesson: NoInfer<ApiResponse<LessonDetailResponse, never>>
}

const LessonCoding = ({ lesson }: LessonCodingProps) => {
    const monaco = useMonaco()

    const editorRef = useRef<editor.IStandaloneCodeEditor>(null)

    const savedVersionsRef = useRef<Map<string, number>>(new Map())

    const [activeFileId, setActiveFileId] = useState<string | null>(() => {
        const filesList = lesson.data.coding?.files || []
        return filesList[0]?.id ?? null
    })

    const [files, setFiles] = useState<CodingFileModel[]>(() => {
        const originalFiles = lesson.data.coding?.files || []
        const userCodes = lesson.data.user_codes || []

        if (userCodes.length > 0) {
            return originalFiles.map((origFile) => {
                const userFile = userCodes.find((userCode) => {
                    return userCode.file_name === origFile.file_name
                })
                return {
                    ...origFile,
                    code: userFile ? userFile.code : origFile.code,
                }
            })
        }

        return originalFiles
    })

    const activeFileIdRef = useRef<string | null>(activeFileId)

    const [previewHtml, setPreviewHtml] = useState<string | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    const [dirtyFileIds, setDirtyFileIds] = useState<Set<string>>(new Set())

    const [activeTab, setActiveTab] = useState<'code' | 'content' | 'browser'>('content')

    const filesRef = useRef(files)

    useEffect(() => {
        filesRef.current = files
    }, [files])

    const currentTab = files.find((file) => file.id === activeFileId) || null

    /**
     * Handle set new files when lesson change.
     */
    useEffect(() => {
        const newFiles = lesson.data.coding?.files || []
        const userCodes = lesson.data.user_codes || []

        if (userCodes.length > 0) {
            setFiles(
                newFiles.map((origFile) => {
                    const userFile = userCodes.find((userCode) => {
                        return userCode.file_name === origFile.file_name
                    })
                    return {
                        ...origFile,
                        code: userFile ? userFile.code : origFile.code,
                    }
                }),
            )
        } else {
            setFiles(newFiles)
        }

        setActiveFileId(newFiles[0]?.id ?? null)
    }, [lesson])

    useEffect(() => {
        editorRef.current?.focus()
    }, [activeFileId])

    const buildHtmlPreview = (files: CodingFileModel[]) => {
        const htmlFile = files.find((f) => f.file_name.endsWith('.html'))
        const cssFile = files.find((f) => f.file_name.endsWith('.css'))
        const jsFile = files.find((f) => f.file_name.endsWith('.js'))

        const bodyContent = htmlFile?.code ?? ''
        const cssTag = cssFile ? `<style>${cssFile.code}</style>` : ''
        const jsTag = jsFile ? `<script>${jsFile.code}</script>` : ''

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                ${cssTag}
            </head>
            <body>
                ${bodyContent}
                ${jsTag}
            </body>
            </html>
        `
    }

    useEffect(() => {
        setPreviewHtml(buildHtmlPreview(files))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!previewHtml) return

        const blob = new Blob([previewHtml], {
            type: 'text/html',
        })

        const url = URL.createObjectURL(blob)
        setPreviewUrl(url)

        return () => URL.revokeObjectURL(url)
    }, [previewHtml])

    const handleSaveFile = useCallback(
        async (files: Array<{ file_name: string; code: string }>) => {
            try {
                const { data: savedFiles } = await lessonServices.saveUserCode({
                    lessonId: lesson.data.id,
                    files,
                })

                /**
                 *  handle dirty state after save
                 */

                requestIdleCallback(() => {
                    setDirtyFileIds((prev) => {
                        const next = new Set(prev)

                        savedFiles.forEach((file) => {
                            const fileName = file.file_name

                            const fileEntry = filesRef.current.find((f) => {
                                return f.file_name === fileName
                            })

                            if (fileEntry) {
                                next.delete(fileEntry.id)
                            }
                        })

                        return next
                    })
                })
            } catch (error) {
                handleApiError(error)
            }
        },
        [lesson.data.id],
    )

    useEffect(() => {
        const remove = listenEvent('lesson-code:run-test-case', () => {
            /**
             * Handle save all files that has changed when run test case
             */
            requestIdleCallback(async () => {
                const filesToSave = Array.from(dirtyFileIds)
                    .map((fileId) => {
                        const model = monaco?.editor.getModel(monaco.Uri.parse(fileId))

                        const fileEntry = filesRef.current.find((file) => {
                            return file.id === fileId
                        })

                        if (!fileEntry || !model) {
                            return null
                        }

                        return {
                            file_name: fileEntry.file_name,
                            code: model.getValue(),
                        }
                    })
                    .filter((item) => {
                        return !!item
                    })

                if (filesToSave.length > 0) {
                    await handleSaveFile(filesToSave)
                }
            })
        })

        return remove
    }, [dirtyFileIds, files, handleSaveFile, monaco])

    const handleSave = (editor: editor.IStandaloneCodeEditor) => {
        editor.onKeyDown((e) => {
            if (e.ctrlKey && e.code === 'KeyS') {
                e.preventDefault()

                const model = editor.getModel()
                const currentActiveId = activeFileIdRef.current

                if (!currentActiveId || !model) {
                    return
                }

                const currentVersion = model.getAlternativeVersionId()
                const savedVersion = savedVersionsRef.current.get(currentActiveId) ?? 1

                const hasChanged = currentVersion !== savedVersion

                if (!hasChanged) {
                    return
                }

                savedVersionsRef.current.set(currentActiveId, currentVersion)

                setDirtyFileIds((prev) => {
                    const next = new Set(prev)
                    next.delete(currentActiveId)
                    return next
                })

                setPreviewHtml(buildHtmlPreview(filesRef.current))

                const currentFileEntry = files.find((file) => file.id === currentActiveId)

                if (!currentFileEntry) {
                    return
                }

                /**
                 * Handle call API to save the code to the database.
                 */

                handleSaveFile([
                    {
                        file_name: currentFileEntry.file_name,
                        code: editor.getValue(),
                    },
                ])
            }
        })
    }

    const handleEditorChange = (value: string | undefined) => {
        const currentActiveId = activeFileIdRef.current

        if (currentActiveId === null || value === undefined) {
            return
        }

        /**
         * Avoid triggering onChange when switching tabs/mounting if the value hasn't changed.
         */
        const currentActiveFile = files.find((file) => file.id === currentActiveId)

        if (currentActiveFile && currentActiveFile.code === value) {
            return
        }

        setFiles((prevFiles) =>
            prevFiles.map((file) => {
                if (file.id === currentActiveId) {
                    return {
                        ...file,
                        code: value,
                    }
                }

                return file
            }),
        )

        const model = editorRef.current?.getModel()

        if (!model) {
            return
        }

        const savedVersion = savedVersionsRef.current.get(currentActiveId) ?? 1
        const isDirty = model.getAlternativeVersionId() !== savedVersion

        setDirtyFileIds((prev) => {
            const next = new Set(prev)

            if (isDirty) {
                next.add(currentActiveId)
            } else {
                next.delete(currentActiveId)
            }

            return next
        })
    }

    const handleEditorWillMount = (monaco: typeof Monaco) => {
        emmetHTML(monaco)
        emmetCSS(monaco)
        emmetJSX(monaco)

        // Support TSX, follow this issue: https://github.com/microsoft/monaco-editor/issues/264#issuecomment-654578687
        monaco.typescript.typescriptDefaults.setCompilerOptions({
            target: monaco.typescript.ScriptTarget.Latest,
            allowNonTsExtensions: true,
            moduleResolution: monaco.typescript.ModuleResolutionKind.NodeJs,
            module: monaco.typescript.ModuleKind.CommonJS,
            noEmit: true,
            esModuleInterop: true,
            jsx: monaco.typescript.JsxEmit.React,
            reactNamespace: 'React',
            allowJs: true,
            typeRoots: ['node_modules/@types'],
        })

        monaco.typescript.typescriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: false,
            noSyntaxValidation: false,
        })

        // Loading React data types asynchronously does not block the main thread. (Avoid blocking Emmet.)
        fetch('https://cdn.jsdelivr.net/npm/@types/react@19.2.4/index.d.ts')
            .then((res) => res.text())
            .then((text) => {
                monaco.typescript.typescriptDefaults.addExtraLib(text, `file:///node_modules/@types/react/index.d.ts`)
            })
            .catch((err) => console.error('Failed to load React types:', err))
    }

    const handleTabChange = (fileId: string) => {
        setActiveFileId(fileId)

        activeFileIdRef.current = fileId
    }

    return (
        <div className="flex flex-1 flex-col lg:grid lg:grid-cols-12">
            {/* Mobile Tab Bar */}
            <div className="w-full select-none lg:hidden">
                <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)}>
                    <TabsList variant="line" className="border-border h-12 w-full gap-0 border-b">
                        <TabsTrigger value="code" className="flex-1">
                            Code
                        </TabsTrigger>
                        <TabsTrigger value="content" className="flex-1">
                            Nội dung
                        </TabsTrigger>

                        <TabsTrigger value="browser" className="flex-1">
                            Trình duyệt
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Left Column - Code Editor */}
            <div
                className={cn(
                    'border-border col-span-12 border-r lg:col-span-7',
                    activeTab === 'code' ? 'block' : 'hidden lg:block',
                )}
            >
                {/* editor height = 100dvh - (header height + footer height) */}
                <div className="flex h-[calc(100dvh-calc(var(--header-height)+var(--footer-height)+48px))] flex-col overflow-hidden lg:h-[calc(100dvh-calc(var(--header-height)+var(--footer-height)))]">
                    <div className="flex w-full items-center border-b border-zinc-700 bg-(--editor-tab-bg)/90 select-none">
                        {files.map((file: CodingFileModel, index: number) => (
                            <EditorTab
                                key={file.id}
                                file={file}
                                index={index}
                                activeFileId={activeFileId}
                                setActiveFileId={handleTabChange}
                                dirtyFileIds={dirtyFileIds}
                            />
                        ))}
                    </div>

                    <div className="flex-1">
                        <Editor
                            onMount={(editor) => {
                                editorRef.current = editor

                                handleSave(editor)
                            }}
                            path={currentTab?.id}
                            height={'100%'}
                            language={getMonacoLanguage(currentTab?.file_name || '')}
                            value={currentTab?.code}
                            onChange={handleEditorChange}
                            theme="vs-dark"
                            loading={<Spinner />}
                            beforeMount={handleEditorWillMount}
                            options={{
                                minimap: {
                                    enabled: false,
                                },
                                tabSize: 4,
                                smoothScrolling: true,
                                stickyScroll: {
                                    enabled: false,
                                },
                                readOnly: currentTab?.read_only ?? false,
                            }}
                        />
                    </div>

                    <LessonCodingSubmit lesson={lesson.data} buildHtmlPreview={buildHtmlPreview} files={files} />
                </div>
            </div>

            {/* Right Column - Content & Browser */}
            <div className={cn('col-span-12 lg:col-span-5', activeTab !== 'code' ? 'block' : 'hidden lg:block')}>
                <div className="flex h-[calc(100dvh-calc(var(--header-height)+var(--footer-height)+48px))] flex-col overflow-hidden lg:h-[calc(100dvh-calc(var(--header-height)+var(--footer-height)))]">
                    <Tabs
                        value={activeTab === 'code' ? 'content' : activeTab}
                        onValueChange={(val) => setActiveTab(val as any)}
                        className="flex flex-1 flex-col overflow-hidden"
                    >
                        <TabsList variant="line" className="border-border hidden h-12 w-full gap-0 border-b lg:flex">
                            <TabsTrigger value="content">Nội dung</TabsTrigger>
                            <TabsTrigger value="browser">Trình duyệt</TabsTrigger>
                        </TabsList>
                        <TabsContent value="content" className="flex-1 overflow-y-auto px-2 py-4">
                            <Markdown>{lesson.data.content}</Markdown>
                        </TabsContent>
                        <TabsContent value="browser" className="flex-1 overflow-hidden">
                            {files.some((file) => file.file_name.endsWith('.html')) ? (
                                <iframe
                                    src={previewUrl ?? undefined}
                                    className="h-full w-full border-0"
                                    title="preview"
                                />
                            ) : (
                                <div className="flex h-full p-4">
                                    <p className="text-lg font-medium">
                                        Nội dung của bạn sẽ được hiển thị ở đây nếu có file html
                                    </p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

export default LessonCoding
