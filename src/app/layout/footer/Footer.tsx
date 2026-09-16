import { LinkProps } from 'next/link'

import NavLink from '~/components/nav-link/NavLink'

const MENU_POLICY: { href: LinkProps<string>['href']; label: string }[] = [
    {
        href: '/policy',
        label: 'Lộ trình',
    },
    {
        href: '/terms',
        label: 'Hệ sinh thái',
    },
    {
        href: '/policy',
        label: 'Riêng tư',
    },
    {
        href: '/terms',
        label: 'Điều khoản',
    },
    {
        href: '/terms',
        label: 'Hỗ trợ',
    },
]

const Footer = () => {
    return (
        <div className="flex flex-col items-center justify-between gap-4 bg-[#ECEEF0] px-10 py-10 text-center md:flex-row md:text-start">
            <div>
                <h3 className="text-2xl leading-8 font-bold">H9N Learning</h3>
                <p className="mt-1 text-sm">
                    © {new Date().getFullYear()} H9N Learning. Được xây dựng cho giáo dục hiệu suất cao.
                </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 md:mt-0">
                {MENU_POLICY.map((item, index) => (
                    <NavLink
                        key={index}
                        href={item.href}
                        className="text-sm font-medium text-[#45464D] hover:text-black hover:underline"
                        activeClassName="underline text-black"
                    >
                        {item.label}
                    </NavLink>
                ))}
            </div>
        </div>
    )
}

export default Footer
