'use client'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { cn } from '~/lib/utils'

interface UserAvatarProps {
    src?: string
    fullName?: string
    className?: string
}

const UserAvatar = ({ src, fullName, className = '' }: UserAvatarProps) => {
    const getUserNameFallback = (fullName?: string) => {
        if (!fullName) return 'N/A'

        const words = fullName.trim().split(/\s+/)
        return words.length > 1 ? words[0][0].toUpperCase() + words[1][0].toUpperCase() : words[0][0].toUpperCase()
    }

    return (
        <Avatar className={cn('cursor-pointer', className)}>
            <AvatarImage src={src} />
            <AvatarFallback>{getUserNameFallback(fullName)}</AvatarFallback>
        </Avatar>
    )
}

export default UserAvatar
