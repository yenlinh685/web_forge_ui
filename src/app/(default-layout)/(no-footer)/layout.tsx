import Sidebar from '~/app/layout/sidebar/AppSidebar'

const NoFooterLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Sidebar />
            <main className="w-full">{children}</main>
        </>
    )
}

export default NoFooterLayout
