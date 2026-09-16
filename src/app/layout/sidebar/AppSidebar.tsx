'use client'

import React from 'react'
import { Plus } from 'lucide-react'

import NavLink from '~/components/nav-link/NavLink'
import { Button } from '~/components/ui/button'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarTrigger,
    useSidebar,
} from '~/components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip'
import { SIDEBAR_ITEMS } from '~/constants/sidebar'

const AppSidebar = () => {
    const { state } = useSidebar()
    const isCollapsed = state === 'collapsed'

    return (
        <Sidebar
            collapsible="icon"
            className="sticky top-(--header-height) box-border h-[calc(100dvh-var(--header-height))] w-70 shrink-0 bg-white px-2 pb-6"
        >
            <SidebarHeader>
                <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                        <SidebarTrigger />
                    </TooltipTrigger>
                    <TooltipContent>{isCollapsed ? 'Mở rộng (Ctrl + B)' : 'Thu gọn (Ctrl + B)'}</TooltipContent>
                </Tooltip>
            </SidebarHeader>
            <SidebarContent>
                <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                        <Button className="w-full py-5">
                            <Plus />
                            <span className="group-data-[state=collapsed]:hidden">Tạo dự án </span>
                        </Button>
                    </TooltipTrigger>
                    {isCollapsed && <TooltipContent side="right">Tạo dự án</TooltipContent>}
                </Tooltip>

                <div className="mt-6 flex flex-col gap-1">
                    {SIDEBAR_ITEMS.map((item, index) => {
                        const navItem = (
                            <NavLink
                                href={item.href}
                                className="group relative text-[#45464D]"
                                activeClassName="text-chart-4! [&_button]:hover:text-chart-4 is-active"
                            >
                                <div className="bg-chart-4 invisible absolute top-3 bottom-3 left-0.5 w-0.75 rounded group-[.is-active]:visible"></div>

                                <Button
                                    variant={'ghost'}
                                    className="w-full justify-start gap-2 py-6 text-sm font-semibold group-data-[state=collapsed]:py-5 hover:bg-zinc-200/60"
                                >
                                    <item.icon className="size-5 font-bold" />
                                    <p className="transition-all group-data-[state=collapsed]:invisible group-data-[state=collapsed]:w-0 group-data-[state=collapsed]:opacity-0 group-data-[state=collapsed]:duration-100 group-data-[state=expanded]:duration-0">
                                        {item.label}
                                    </p>
                                </Button>
                            </NavLink>
                        )

                        return (
                            <Tooltip key={index} delayDuration={300}>
                                <TooltipTrigger asChild>{navItem}</TooltipTrigger>
                                {isCollapsed && (
                                    <TooltipContent side="right" align="center">
                                        {item.label}
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        )
                    })}
                </div>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}

export default AppSidebar
