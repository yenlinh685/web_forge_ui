'use client'

import { X } from 'lucide-react'

import Search from '~/app/layout/header/components/Search'
import { Button } from '~/components/ui/button'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '~/components/ui/drawer'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip'

interface MobileSearchProps {
    children: React.ReactNode
    showTooltip?: boolean
}

const MobileSearch: React.FC<MobileSearchProps> = ({ children, showTooltip = true }) => {
    return (
        <Drawer direction="top" modal={true}>
            {showTooltip ? (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DrawerTrigger asChild>{children}</DrawerTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Tìm kiếm</p>
                    </TooltipContent>
                </Tooltip>
            ) : (
                <DrawerTrigger asChild>{children}</DrawerTrigger>
            )}
            <DrawerContent>
                <DrawerClose autoFocus asChild>
                    <Button variant="ghost" size="icon" className="absolute top-4 right-4">
                        <X size={28} className="size-5" />
                    </Button>
                </DrawerClose>
                <DrawerHeader>
                    <DrawerTitle className="font-bold">Tìm kiếm khóa học</DrawerTitle>
                    <DrawerDescription></DrawerDescription>
                </DrawerHeader>
                <div className="p-10 pt-0">
                    <Search className="w-full max-w-none" />
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default MobileSearch
