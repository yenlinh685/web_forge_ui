'use client'

import { useEffect, useRef } from 'react'

import { listenEvent, sendEvent } from '~/helper/events'

interface SectionObserverProps {
    sectionIds: string[]
}

const SectionObserver = ({ sectionIds }: SectionObserverProps) => {
    const isPausedRef = useRef(false)

    // listen event toc:pause-observer from TableOfContents
    useEffect(() => {
        return listenEvent('toc:pause-observer', ({ duration }) => {
            isPausedRef.current = true
            setTimeout(() => {
                isPausedRef.current = false
            }, duration)
        })
    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (isPausedRef.current) return

                const intersecting = entries.filter((e) => e.isIntersecting)
                if (!intersecting.length) return

                const topmost = intersecting.reduce((prev, curr) =>
                    curr.boundingClientRect.top < prev.boundingClientRect.top ? curr : prev,
                )

                sendEvent('toc:section-change', { hash: `#${topmost.target.id}` })
            },
            {
                rootMargin: '-10% 0px -70% 0px',
                threshold: 0,
            },
        )

        sectionIds.forEach((id) => {
            const el = document.getElementById(id)
            if (el) observer.observe(el)
        })

        return () => observer.disconnect()
    }, [sectionIds])

    return null
}

export default SectionObserver
