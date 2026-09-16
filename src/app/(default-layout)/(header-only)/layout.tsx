const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <main className="w-full px-2">{children}</main>
        </>
    )
}

export default DefaultLayout
