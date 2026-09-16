'use client'

import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'

type NavLinkProps = React.PropsWithChildren<LinkProps<string>> & {
    activeClassName?: string
    exact?: boolean
    className?: string
}

export default function NavLink({
    href,
    exact,
    activeClassName = 'active',
    className,
    children,
    ...props
}: NavLinkProps) {
    const pathname = usePathname()

    const segment = (p: string) => new URL(p, 'http://example.com').pathname.split('/').filter(Boolean)

    const hrefPathname = typeof href === 'string' ? href : (href.pathname ?? '/')

    const currentPath = segment(pathname)
    const targetPath = segment(hrefPathname)

    const isActive =
        targetPath.length === 0
            ? currentPath.length === 0
            : currentPath.length >= targetPath.length &&
              targetPath.every((p, i) => currentPath[i] === p) &&
              (!exact || targetPath.length === currentPath.length)

    return (
        <Link href={href} className={[className, isActive ? activeClassName : ''].filter(Boolean).join(' ')} {...props}>
            {children}
        </Link>
    )
}
