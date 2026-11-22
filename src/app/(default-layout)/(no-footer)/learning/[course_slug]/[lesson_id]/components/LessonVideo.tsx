'use client'

import { useCallback, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import Image from 'next/image'
import { toast } from 'sonner'

import Markdown from '~/components/markdown/Markdown'
import { LessonDetailResponse } from '~/services/lessonService'
import { ApiResponse } from '~/types/apiResponse.type'
import usePassLesson from '~/hooks/usePassLession'

const WATCHED_THRESHOLD = 0.75
const SEEK_TOLERANCE_SECONDS = 2

interface LessonVideoProps {
    lesson: NoInfer<ApiResponse<LessonDetailResponse, never>>
}

const LessonVideo: React.FC<LessonVideoProps> = ({ lesson }) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isThumbnailLoaded, setIsThumbnailLoaded] = useState(false)

    const { passLesson } = usePassLesson(lesson.data)

    const playerRef = useRef<ReactPlayer>(null)
    const durationRef = useRef(0)
    const lastTimeRef = useRef(0)
    const maxWatchedRef = useRef(0)
    const watchedSecondsRef = useRef(0)

    const isCompleted = lesson.data.progress?.status === 'COMPLETED'

    /**
     * Không được tua vượt quá vị trí xa nhất mà người dùng đã xem. Nếu tua vượt, phải quay lại vị trí trước khi thực hiện thao tác tua. Có thể tua lại hoặc di chuyển trong phạm vi video đã xem.
     * Chỉ tính thời gian video thực sự được phát. Nếu khoảng nhảy giữa hai lần cập nhật vượt quá mức sai số cho phép thì được xem là thao tác tua.
     * Bài học được đánh dấu hoàn thành khi người dùng đã xem ít nhất 75% thời lượng video.
     * Sau khi bài học hoàn thành, người dùng được phép tua video tự do.
     */
    const handleProgress = useCallback(
        (state: { playedSeconds: number }) => {
            const currentTime = state.playedSeconds
            const delta = currentTime - lastTimeRef.current

            const isSkippingAhead =
                delta > SEEK_TOLERANCE_SECONDS && currentTime > maxWatchedRef.current + SEEK_TOLERANCE_SECONDS

            if (isSkippingAhead && !isCompleted) {
                playerRef.current?.seekTo(lastTimeRef.current, 'seconds')

                toast.warning('Bạn chưa thể tua qua phần chưa xem', {
                    id: 'video-seek-blocked',
                })

                return
            }

            if (delta > 0 && delta <= SEEK_TOLERANCE_SECONDS) {
                watchedSecondsRef.current += delta
            }

            lastTimeRef.current = currentTime
            maxWatchedRef.current = Math.max(maxWatchedRef.current, currentTime)

            console.log('currentTime', currentTime)
            console.log('durationRef.current', durationRef.current)
            console.log('watchedSecondsRef.current', watchedSecondsRef.current)
            console.log('WATCHED_THRESHOLD', WATCHED_THRESHOLD)

            if (durationRef.current > 0 && watchedSecondsRef.current >= durationRef.current * WATCHED_THRESHOLD) {
                passLesson()
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isCompleted],
    )

    const showThumbnail = !isPlaying

    return (
        <div className="mx-auto gap-x-8 pb-4">
            <div className="max-w-full min-w-0">
                <div className="3xl:px-60 relative w-full overflow-hidden bg-black px-0 xl:px-20">
                    <div className="mx-auto aspect-video w-full max-w-7xl">
                        {isThumbnailLoaded && (
                            <ReactPlayer
                                ref={playerRef}
                                url={`${lesson.data.video?.video_url}`}
                                width="100%"
                                height="100%"
                                controls
                                playing={isPlaying}
                                playsinline
                                onProgress={handleProgress}
                                progressInterval={500}
                                onDuration={(duration) => {
                                    durationRef.current = duration
                                }}
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
