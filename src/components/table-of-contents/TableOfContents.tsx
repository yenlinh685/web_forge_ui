'use client'

import { useEffect, useRef, useState } from 'react'

import { listenEvent, sendEvent } from '~/helper/events'
import { cn } from '~/lib/utils'

interface TableOfContentsProps {
    links: {
        href: string
        label: string
    }[]
    className?: string
}

const TableOfContents = ({ links, className = '' }: TableOfContentsProps) => {
    const [activeHash, setActiveHash] = useState(links[0].href)
    const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0 })
    const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])

    useEffect(() => {
        setActiveHash(window.location.hash || links[0].href)

        return listenEvent('toc:section-change', ({ hash }) => {
            setActiveHash(hash)
        })
    }, [links])

    useEffect(() => {
        const activeIndex = links.findIndex((link) => link.href === activeHash)
        if (activeIndex === -1) return

        const el = linkRefs.current[activeIndex]
        if (!el) return

        setIndicatorStyle({
            top: el.offsetTop,
            height: el.offsetHeight,
        })
    }, [activeHash, links])

    return (
        <aside className={cn(className)}>
            <div className="relative flex flex-row gap-3">
                {/* Sliding indicator bar */}
                <div className="bg-border relative w-0.5 self-stretch rounded-full">
                    <div
                        className={cn(
                            'bg-chart-5 absolute left-0 w-full rounded-full transition-all duration-300 ease-in-out',
                            activeHash ? 'opacity-100' : 'opacity-0',
                        )}
                        style={{
                            top: indicatorStyle.top,
                            height: indicatorStyle.height,
                        }}
                    />
                </div>

                {/* Links */}
                <nav className="flex flex-col gap-2">
                    {links.map(({ href, label }, i) => (
                        <a
                            key={href}
                            href={href}
                            ref={(el) => {
                                linkRefs.current[i] = el
                            }}
                            onClick={() => {
                                setActiveHash(href)
                                sendEvent('toc:pause-observer', { duration: 800 })
                            }}
                            className={cn(
                                'hover:text-chart-5 py-1 text-sm font-medium transition-colors duration-200',
                                activeHash === href ? 'text-chart-5' : 'text-muted-foreground',
                            )}
                        >
                            {label}
                        </a>
                    ))}
                </nav>
            </div>
        </aside>
    )
}

export default TableOfContents
