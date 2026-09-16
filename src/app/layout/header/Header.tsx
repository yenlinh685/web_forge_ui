import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'

import MobileSidebar from '../sidebar/MobileSidebar'
import Interaction from './components/interaction/Interaction'
import Search from './components/Search'

const Header = async () => {
    const cookiesStore = await cookies()

    return (
        <header className="fixed top-0 right-0 left-0 z-50 grid h-(--header-height) grid-cols-[1fr_2fr_1fr] items-center gap-1 border-b bg-white px-3.5">
            <div className="flex flex-1 items-center gap-6">
                <div className="flex items-center gap-3">
                    <MobileSidebar />

                    <Link href="/">
                        <Image
                            src="/static/logo.png"
                            alt="logo"
                            className="min-w-9 shrink-0 cursor-pointer"
                            width={36}
                            height={36}
                            sizes="200px"
                            quality={100}
                            priority
                        />
                    </Link>
                    <h2 className="hidden text-sm font-bold uppercase md:block">Learn - Build - Together</h2>
                </div>
            </div>

            <div className="flex-center">
                <Search className="hidden sm:block" />
            </div>

            <div className="flex justify-end">
                <Interaction accessToken={cookiesStore.get('access_token')?.value} />
            </div>
        </header>
    )
}

export default Header
