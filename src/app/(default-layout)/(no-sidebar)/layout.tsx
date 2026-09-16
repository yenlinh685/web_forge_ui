import Footer from '~/app/layout/footer/Footer'

const NoSidebarLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex min-h-full w-full flex-col">
            <main className="flex-1 px-2">{children}</main>
            <Footer />
        </div>
    )
}

export default NoSidebarLayout
