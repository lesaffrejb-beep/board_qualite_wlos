/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['ydfgueqasslzhdbvermu.supabase.co'],
    },
    swcMinify: true,
    compress: true,
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' blob:; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: ${process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ydfgueqasslzhdbvermu.supabase.co'}; connect-src 'self' ${process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ydfgueqasslzhdbvermu.supabase.co'}; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; block-all-mixed-content; upgrade-insecure-requests;`.replace(/\s{2,}/g, ' ').trim(),
                    },
                ],
            },
        ]
    },
}

module.exports = nextConfig
