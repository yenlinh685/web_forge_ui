import Footer from '~/app/layout/footer/Footer'
import Sidebar from '~/app/layout/sidebar/AppSidebar'

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Sidebar />
            <div className="flex min-h-full w-full flex-col">
                <main className="w-full flex-1">{children}</main>
                <Footer />
            </div>
        </>
    )
}

export default RootLayout
