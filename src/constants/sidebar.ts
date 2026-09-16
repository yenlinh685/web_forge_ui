import React from 'react'
import { LinkProps } from 'next/link'
import {
    Clapperboard,
    FolderKanban,
    FolderOpenDot,
    LucideProps,
    Map,
    MessagesSquare,
    Settings,
    User,
} from 'lucide-react'

export interface SidebarItem {
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>
    label: string
    href: LinkProps<string>['href']
    requireAuth: boolean
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
    {
        icon: FolderOpenDot,
        label: 'Dự án của tôi',
        href: '/',
        requireAuth: true,
    },
    {
        icon: Clapperboard,
        label: 'Khóa học',
        href: '/courses',
        requireAuth: false,
    },
    {
        icon: Map,
        label: 'Roadmap',
        href: '/',
        requireAuth: false,
    },
    {
        icon: FolderKanban,
        label: 'Phân tích',
        href: '/',
        requireAuth: true,
    },
    {
        icon: MessagesSquare,
        label: 'Cộng đồng',
        href: '/',
        requireAuth: false,
    },
    {
        icon: User,
        label: 'Hồ sơ cá nhân',
        href: '/',
        requireAuth: true,
    },
    {
        icon: Settings,
        label: 'Cài đặt tài khoản',
        href: '/',
        requireAuth: true,
    },
]
