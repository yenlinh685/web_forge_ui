'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Home, Terminal } from 'lucide-react'

import { Button } from '~/components/ui/button'

const ButtonAnimate = motion.create(Button)

// Hạt code bay lơ lửng trong background
const floatingItems = [
    { text: '</>', size: 'text-3xl', color: 'text-chart-5', top: '12%', left: '15%', delay: 0 },
    { text: '{}', size: 'text-4xl', color: 'text-chart-4', top: '22%', left: '78%', delay: 1.5 },
    { text: '[]', size: 'text-2xl', color: 'text-muted-foreground/40', top: '78%', left: '10%', delay: 0.5 },
    { text: 'const', size: 'text-sm font-bold', color: 'text-chart-3', top: '55%', left: '88%', delay: 2 },
    { text: '=>', size: 'text-2xl', color: 'text-chart-4', top: '82%', left: '62%', delay: 1 },
    { text: '===', size: 'text-lg', color: 'text-muted-foreground/30', top: '48%', left: '6%', delay: 2.5 },
    { text: '&&', size: 'text-2xl', color: 'text-chart-5', top: '14%', left: '68%', delay: 1.2 },
    { text: '||', size: 'text-lg', color: 'text-muted-foreground/40', top: '88%', left: '32%', delay: 0.8 },
    { text: 'import', size: 'text-xs font-semibold', color: 'text-chart-3', top: '35%', left: '82%', delay: 1.8 },
    { text: 'return', size: 'text-xs font-semibold', color: 'text-chart-5', top: '68%', left: '18%', delay: 0.4 },
]

export default function NotFound() {
    const router = useRouter()

    return (
        <div className="bg-background relative flex min-h-dvh flex-col items-center justify-between overflow-hidden px-6 py-12 select-none">
            {/* Background blobs */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <motion.div
                    animate={{
                        x: [0, 40, -20, 0],
                        y: [0, -50, 30, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="bg-chart-5/10 absolute top-1/4 left-1/4 h-75 w-75 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        x: [0, -30, 50, 0],
                        y: [0, 40, -40, 0],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="bg-chart-3/10 absolute right-1/4 bottom-1/4 h-87.5 w-87.5 rounded-full blur-[120px]"
                />
            </div>

            {/* Floating code symbols */}
            {floatingItems.map((item, index) => (
                <motion.div
                    key={index}
                    className={`pointer-events-none absolute hidden font-mono sm:block ${item.color} ${item.size}`}
                    style={{ top: item.top, left: item.left }}
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 15, -15, 0],
                        opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                        duration: 6 + index * 0.8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: item.delay,
                    }}
                >
                    {item.text}
                </motion.div>
            ))}

            {/* Top Navigation */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex w-full max-w-7xl items-center justify-between"
            >
                <Link href="/" className="flex items-center gap-3">
                    <Image src="/static/logo.png" alt="logo" width={36} height={36} className="shrink-0" priority />
                    <span className="text-sm font-bold tracking-wider uppercase">LEARN - BUILD - TOGETHER</span>
                </Link>
                <Link href="/">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        <Home className="mr-1 size-4" /> Trang chủ
                    </Button>
                </Link>
            </motion.header>

            {/* Main Content */}
            <main className="flex flex-1 flex-col items-center justify-center py-12 text-center">
                {/* 404 Large Gradient Text */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        type: 'spring',
                        stiffness: 80,
                        damping: 15,
                        delay: 0.1,
                    }}
                    className="relative"
                >
                    <h1 className="from-chart-3 via-chart-4 to-chart-5 bg-linear-to-b bg-clip-text text-8xl font-black tracking-tighter text-transparent sm:text-9xl">
                        404
                    </h1>
                    <div className="from-chart-3 via-chart-4 to-chart-5 absolute inset-0 bg-linear-to-b bg-clip-text text-8xl font-black tracking-tighter text-transparent opacity-30 blur-md select-none sm:text-9xl">
                        404
                    </div>
                </motion.div>

                {/* Animated Editor / Code Window */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="border-border bg-card/60 text-card-foreground mt-8 w-full max-w-xl overflow-hidden rounded-xl border text-left font-mono text-xs shadow-2xl backdrop-blur-md sm:text-sm"
                >
                    {/* Header of code editor */}
                    <div className="border-border/85 bg-muted/70 flex items-center justify-between border-b px-4 py-3">
                        <div className="flex items-center gap-2">
                            <span className="bg-destructive size-3 rounded-full" />
                            <span className="size-3 rounded-full bg-yellow-400" />
                            <span className="size-3 rounded-full bg-green-500" />
                        </div>
                        <span className="text-muted-foreground flex items-center gap-1.5 font-sans text-xs">
                            <Terminal className="size-3.5" /> main.js
                        </span>
                        <div className="w-10" />
                    </div>

                    {/* Editor Content */}
                    <div className="text-muted-foreground space-y-2 p-5 leading-relaxed select-text">
                        <div>
                            <span className="text-pink-500">import</span> {'{'} request {'}'}{' '}
                            <span className="text-pink-500">from</span>{' '}
                            <span className="text-chart-4">&apos;h9n-router&apos;</span>;
                        </div>
                        <div>
                            <span className="text-pink-500">const</span>{' '}
                            <span className="text-blue-400">targetPage</span> ={' '}
                            <span className="text-blue-500">request</span>.<span className="text-amber-500">path</span>;
                        </div>
                        <br />
                        <div>
                            <span className="text-pink-500">if</span> (
                            <span className="mr-4 text-blue-400">targetPage</span> ==={' '}
                            <span className="text-chart-4">undefined</span> ||{' '}
                            <span className="text-blue-400">targetPage</span>.
                            <span className="mr-4 text-amber-500">status</span> ==={' '}
                            <span className="text-green-500">404</span>) {'{'}
                        </div>
                        <div className="ml-1.5 py-1 pl-5">
                            <div>
                                <span className="text-pink-500">console</span>.
                                <span className="text-amber-500">error</span>(
                                <span className="text-chart-4">&quot;H9N_Error: Page not found!&quot;</span>);
                            </div>
                            <div className="text-destructive font-semibold">
                                <span className="text-pink-500">throw new</span>{' '}
                                <span className="text-amber-500">Error</span>(
                                <span className="text-destructive">
                                    &quot;Trang này không tồn tại hoặc đã bị di chuyển.&quot;
                                </span>
                                );
                            </div>
                        </div>
                        <div>{'}'}</div>
                    </div>
                </motion.div>

                {/* Heading & Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-8 max-w-md"
                >
                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Lỗi tải trang hoặc sai địa chỉ</h2>
                    <p className="text-muted-foreground mt-3 text-sm sm:text-base">
                        Đường dẫn này không tồn tại trong hệ sinh thái học tập H9N. Hãy kiểm tra lại URL hoặc chọn một
                        trong các hành động bên dưới.
                    </p>
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
                >
                    <ButtonAnimate
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push('/')}
                        className="bg-chart-5 hover:bg-chart-4 flex min-w-42.5 items-center justify-center gap-2 py-5 font-semibold text-white transition-colors"
                    >
                        Về trang chủ <ArrowRight className="size-4" />
                    </ButtonAnimate>

                    <ButtonAnimate
                        variant="outline"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.back()}
                        className="border-border hover:bg-muted flex min-w-42.5 items-center justify-center gap-2 py-5 font-semibold"
                    >
                        <ArrowLeft className="size-4" /> Quay lại
                    </ButtonAnimate>
                </motion.div>
            </main>
        </div>
    )
}
