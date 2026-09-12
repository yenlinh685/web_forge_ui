'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, SearchIcon, Timer } from 'lucide-react'

import Notification from './components/Notification'
import MobileSearch from '~/components/mobile-search/MobileSearch'
import { Button } from '~/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip'
import UserAvatar from '~/components/user-avatar/UserAvatar'
import { SIDEBAR_ITEMS } from '~/constants/sidebar'
import handleApiError from '~/helper/handleApiError'
import { cn } from '~/lib/utils'
import { selectCurrentUser, selectIsAuthenticating } from '~/redux/selector'
import { useAppSelector } from '~/redux/types'
import * as authServices from '~/services/authServices'

interface InteractionProps {
    accessToken?: string
    className?: string
}

const Interaction = ({ className = '', accessToken }: InteractionProps) => {
    const router = useRouter()

    const currentUser = useAppSelector(selectCurrentUser)
    const isAuthenticating = useAppSelector(selectIsAuthenticating)

    const handleLogOut = async () => {
        try {
            await authServices.logOut()

            window.location.reload()
        } catch (error) {
            handleApiError(error)
        }
    }

    return (
        <div className={cn('flex items-center justify-end', className)}>
            {/* 
                If no access token or not authenticated, show login and register buttons 
                Else show user avatar, notifications, etc
            */}
            {!accessToken || (!currentUser && !isAuthenticating) ? (
                <div className="flex items-center gap-2">
                    <Button
                        variant={'ghost'}
                        className="w-27.5"
                        onClick={() => router.push(`/auth/login?redirect_to=${window.location.pathname}`)}
                    >
                        Đăng nhập
                    </Button>
                    <Button
                        variant={'default'}
                        className="w-27.5"
                        onClick={() => router.push(`/auth/register?redirect_to=${window.location.pathname}`)}
                    >
                        Đăng ký
                    </Button>
                </div>
            ) : (
                <div className="flex items-center gap-1">
                    <MobileSearch>
                        <Button variant={'ghost'} size={'icon'} className="flex-center sm:hidden">
                            <SearchIcon size={28} className="size-5" />
                        </Button>
                    </MobileSearch>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Timer size={28} className="size-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Pomodoro</p>
                        </TooltipContent>
                    </Tooltip>

                    <Notification />

                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <div className="ml-4">
                                <UserAvatar src={currentUser?.avatar_url} fullName={currentUser?.full_name} />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-45">
                            <DropdownMenuGroup>
                                {SIDEBAR_ITEMS.map((item, index) => {
                                    return (
                                        <DropdownMenuItem key={index} asChild>
                                            <Link href={item.href}>
                                                <item.icon />
                                                {item.label}
                                            </Link>
                                        </DropdownMenuItem>
                                    )
                                })}
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" onClick={handleLogOut}>
                                <LogOut />
                                Đăng xuất
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </div>
    )
}

export default Interaction
