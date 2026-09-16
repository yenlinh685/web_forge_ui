import Header from '../layout/header/Header'

const DefaultLayout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-[calc(100dvh-64px)] w-full bg-[#F7F9FB]">
            <Header />

            <div className="flex min-h-[calc(100dvh-64px)] pt-(--header-height)">{children}</div>
        </div>
    )
}

export default DefaultLayout
