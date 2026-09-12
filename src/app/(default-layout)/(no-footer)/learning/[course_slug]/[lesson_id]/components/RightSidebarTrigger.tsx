'use client'

import { ChevronsLeft } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { useSidebar } from '~/components/ui/sidebar'
import { cn } from '~/lib/utils'

const RightSidebarTrigger = () => {
    const { open, openMobile, setOpen, isMobile } = useSidebar()

    const isOpen = isMobile ? openMobile : open
    const handleOpen = () => {
        setOpen(true)
    }

    if (isOpen) return null

    return (
        <Button
            onClick={handleOpen}
            className={cn(
                'fixed top-[calc(var(--header-height)+20px)] right-0 z-50 -translate-y-1/2 rounded-r-none border-y border-l shadow-md active:translate-y-[calc(-50%+3px)]!',
                {
                    hidden: isMobile,
                },
            )}
            size="icon"
            variant="secondary"
        >
            <ChevronsLeft className="size-4" />
        </Button>
    )
}

export default RightSidebarTrigger
