import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,
    typedRoutes: true,
    reactStrictMode: false,
    images: {
        qualities: [100, 70, 70, 70, 75],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'files.huanpenguin.click', // R2 storage
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'raw.githubusercontent.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
    allowedDevOrigins: ['h9n.dev'],
}

export default nextConfig
