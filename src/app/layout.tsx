import type { Metadata } from 'next'
import { Geist, Geist_Mono, Inter } from 'next/font/google'

import 'moment/locale/vi'
import './globals.css'
import QueryProvider from '~/components/react-query-provider/QueryProvider'
import ReduxProvider from '~/components/redux-provider/ReduxProvider'
import { SidebarProvider } from '~/components/ui/sidebar'
import { Toaster } from '~/components/ui/sonner'
import { TooltipProvider } from '~/components/ui/tooltip'
import { cn } from '~/lib/utils'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'Home | H9N',
    description: 'Home | H9N',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html
            lang="en"
            data-scroll-behavior="smooth"
            className={cn('h-full', 'antialiased', geistSans.variable, geistMono.variable, 'font-sans', inter.variable)}
        >
            <body className="flex min-h-full flex-col">
                <>
                    <ReduxProvider>
                        <QueryProvider>
                            <TooltipProvider>
                                <SidebarProvider defaultOpen={false}>
                                    <div className="w-full">{children}</div>
                                </SidebarProvider>
                            </TooltipProvider>
                        </QueryProvider>
                        <Toaster />
                    </ReduxProvider>
                </>
            </body>
        </html>
    )
}
