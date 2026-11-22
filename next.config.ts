import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    reactCompiler: true,
    typedRoutes: true,
    reactStrictMode: false,

    images: {
        qualities: [100, 70, 75],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
            {
                protocol: 'http',
                hostname: '**',
            },
        ],
    },

}

export default nextConfig