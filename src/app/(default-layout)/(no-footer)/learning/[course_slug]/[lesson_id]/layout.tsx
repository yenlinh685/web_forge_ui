import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Bài giảng | H9N',
    description: 'Bài giảng | H9N',
}

const Layout = ({ children }: { children: React.ReactNode }) => {
    return <div style={{ '--footer-height': '60px' } as React.CSSProperties}>{children}</div>
}

export default Layout
