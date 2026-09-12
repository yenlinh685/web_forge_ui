'use client'

import { useCallback, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import Image from 'next/image'

import Markdown from '~/components/markdown/Markdown'
import { LessonDetailResponse } from '~/services/lessonService'
import { ApiResponse } from '~/types/apiResponse.type'

interface LessonVideoProps {
    lesson: NoInfer<ApiResponse<LessonDetailResponse, never>>
}

const LessonVideo: React.FC<LessonVideoProps> = ({ lesson }) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isThumbnailLoaded, setIsThumbnailLoaded] = useState(false)

    const expectedTimeRef = useRef(0)
    const maxWatchedRef = useRef(0)

    const handleProgress = useCallback((state: { playedSeconds: number }) => {
        const currentTime = state.playedSeconds
        const diff = Math.abs(currentTime - expectedTimeRef.current)

        if (diff > 2 && currentTime > maxWatchedRef.current + 2) {
            console.log('Phát hiện tua')
        }

        maxWatchedRef.current = Math.max(maxWatchedRef.current, currentTime)
        expectedTimeRef.current = currentTime + 1
    }, [])

    const showThumbnail = !isPlaying

    return (
        <div className="mx-auto gap-x-8 pb-4">
            <div className="max-w-full min-w-0">
                <div className="3xl:px-60 relative w-full overflow-hidden bg-black px-0 xl:px-20">
                    <div className="mx-auto aspect-video w-full max-w-7xl">
                        {isThumbnailLoaded && (
                            <ReactPlayer
                                url={`${lesson.data.video?.video_url}`}
                                width="100%"
                                height="100%"
                                controls
                                playing={isPlaying}
                                playsinline
                                onProgress={handleProgress}
                                config={{
                                    youtube: {
                                        playerVars: {
                                            enablejsapi: 1,
                                            rel: 0,
                                            origin: process.env.NEXT_PUBLIC_SITE_URL,
                                            cc_load_policy: 0,
                                        },
                                    },
                                }}
                            />
                        )}
                    </div>

                    <button
                        type="button"
                        className={`group absolute inset-0 z-10 cursor-pointer bg-black transition-opacity duration-300 ${
                            showThumbnail ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
                        }`}
                        onClick={() => setIsPlaying(true)}
                        aria-label="Phát video"
                        tabIndex={showThumbnail ? 0 : -1}
                    >
                        <Image
                            src={lesson?.data?.video?.thumbnail_url || ''}
                            alt={lesson?.data.title || 'Video thumbnail'}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 66vw"
                            priority
                            onLoad={() => setIsThumbnailLoaded(true)}
                        />

                        <div className="absolute inset-0 flex items-center justify-center bg-linear-to-t from-black/40 to-transparent">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/40 shadow-lg transition-transform duration-200 group-hover:scale-110">
                                <svg className="ml-1 h-9 w-9 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>
                    </button>
                </div>

                <div className="3xl:px-60 mx-auto mt-6 max-w-7xl px-2">
                    <h1 className="line-clamp-2 text-3xl leading-10 font-bold">{lesson?.data.title}</h1>

                    <div className="border-border mt-4 rounded-2xl border bg-white p-6 py-4 shadow-xs">
                        <Markdown>{lesson.data.content}</Markdown>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LessonVideo
