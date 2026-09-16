'use client'

import { Menu, Plus, Search, X } from 'lucide-react'

import LogoutButton from '~/app/layout/sidebar/components/logout-button/LogOutButton'
import MobileSearch from '~/components/mobile-search/MobileSearch'
import NavLink from '~/components/nav-link/NavLink'
import { Button } from '~/components/ui/button'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '~/components/ui/drawer'
import { SIDEBAR_ITEMS } from '~/constants/sidebar'
import { selectCurrentUser } from '~/redux/selector'
import { useAppSelector } from '~/redux/types'

const MobileSidebar = () => {
    const currentUser = useAppSelector(selectCurrentUser)

    return (
        <Drawer direction="left">
            <DrawerTrigger asChild>
                <Button variant={'ghost'} size={'icon'} className="md:hidden">
                    <Menu />
                </Button>
            </DrawerTrigger>

            <DrawerContent className="w-full! max-w-75! overflow-y-scroll px-4">
                <DrawerClose autoFocus asChild>
                    <Button variant={'ghost'} size={'icon'} className="absolute top-4 right-4">
                        <X size={28} className="size-5" />
                    </Button>
                </DrawerClose>
                <DrawerHeader className="px-0">
                    <DrawerTitle className="font-bold">H9N</DrawerTitle>
                    <DrawerDescription>Learn - Build - Together</DrawerDescription>
                </DrawerHeader>

                <div className="mt-6 flex flex-col pt-0 pb-4">
                    {currentUser ? (
                        <Button className="py-5">
                            <Plus />
                            Tạo dự án
                        </Button>
                    ) : (
                        <MobileSearch>
                            <DrawerClose asChild>
                                <Button className="w-full py-5" variant={'secondary'}>
                                    <Search />
                                    Tìm kiếm
                                </Button>
                            </DrawerClose>
                        </MobileSearch>
                    )}

                    <div className="mt-8">
                        {SIDEBAR_ITEMS.map((item, index) => {
                            if (item.requireAuth && !currentUser) {
                                return null
                            }

                            return (
                                <DrawerClose autoFocus asChild key={index}>
                                    <NavLink
                                        href={item.href}
                                        className="hover:bg-muted/80 flex w-full items-center justify-start gap-2 rounded-md px-2 py-4 text-sm font-semibold"
                                        activeClassName="text-chart-5 bg-muted"
                                    >
                                        <item.icon className="size-5 font-bold" />
                                        {item.label}
                                    </NavLink>
                                </DrawerClose>
                            )
                        })}
                    </div>
                </div>

                <DrawerFooter>{currentUser && <LogoutButton />}</DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default MobileSidebar
