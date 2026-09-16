'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'

import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

const slides = [
    {
        imageUrl: '/static/auth_banner_1.png',
        title: 'Không gian học tập ảo.',
        description: 'Trải nghiệm không gian học tập sinh động, tương tác với bạn học như đang ở một phòng.',
    },
    {
        imageUrl: '/static/auth_banner_2.png',
        title: 'Học lập trình cộng tác.',
        description: 'Nền tảng giáo dục hiệu suất cao kết nối người học trong môi trường học tập thực tế.',
    },
    {
        imageUrl: '/static/auth_banner_3.png',
        title: 'Thực chiến cùng đồng đội',
        description: 'Tham gia vào các dự án thực tế, cùng nhau giải quyết vấn đề và xây dựng sản phẩm chất lượng cao.',
    },
]

const AuthFormLayout = ({ children }: { children: React.ReactNode }) => {
    const autoplay = Autoplay({
        delay: 6000,
        stopOnInteraction: false,
    })

    const [selectedIndex, setSelectedIndex] = useState(0)
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay])

    // reset autoplay timer when select image, next or prev button click
    useEffect(() => {
        if (!emblaApi) return

        const handleSelect = () => {
            autoplay.reset()
            setSelectedIndex(emblaApi.selectedScrollSnap())
        }

        emblaApi.on('select', handleSelect)

        return () => {
            emblaApi.off('select', handleSelect)
        }
    }, [emblaApi, autoplay])

    return (
        <div className="grid min-h-dvh grid-cols-12 overflow-hidden">
            <div className="relative col-span-6 hidden md:block">
                <div className="relative h-full max-h-full w-full overflow-hidden" ref={emblaRef}>
                    <div className="flex h-full">
                        {slides.map((slide, index) => (
                            <div key={index} className="relative h-full max-h-full min-w-full flex-[0_0_100%]">
                                <Image
                                    src={slide.imageUrl}
                                    alt="Auth Banner"
                                    fill
                                    className="object-cover select-none"
                                    loading="eager"
                                    sizes="100dvh"
                                />

                                <div className="absolute inset-0 bg-linear-to-t from-[#131b2e]/95 via-[#131b2e]/60 to-transparent"></div>

                                <div className="absolute bottom-16 left-10 pr-10 select-none">
                                    <h2 className="text-5xl font-bold text-white">{slide.title}</h2>
                                    <p className="mt-4 text-lg text-[#BEC6E0]">{slide.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-8 left-10 mt-5 flex items-center">
                    {slides.map((_, index) => (
                        <div
                            className="cursor-pointer p-1"
                            key={index}
                            onClick={() => {
                                emblaApi?.scrollTo(index)
                            }}
                        >
                            <button
                                className={cn(
                                    'h-1.5 rounded-full bg-white/30 transition-all duration-500 ease-in-out',
                                    selectedIndex === index
                                        ? 'w-6 bg-[#00E0FF]'
                                        : 'w-1.5 bg-white/30 hover:bg-white/50',
                                )}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="col-span-12 md:col-span-6">
                <div className="flex h-full w-full flex-col justify-center bg-[#F7F9FB] px-6 py-10 md:px-10 lg:px-20 xl:px-24">
                    {children}

                    <Button variant={'link'} className="text-chart-5 mx-auto mt-4 font-medium" asChild>
                        <Link href={'/'}> Quay về trang chủ</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default AuthFormLayout
