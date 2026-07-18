import withBundleAnalyzer from '@next/bundle-analyzer'
import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: []
  }
})

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})

/** @type {import('next').NextConfig} */
const nextConfig = withAnalyzer(
  withMDX({
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
    // Avoid OOM during build: type-check and lint separately (pnpm run typecheck, pnpm run lint)
    typescript: { ignoreBuildErrors: true },
    eslint: { ignoreDuringBuilds: true },
    optimizeFonts: false,
    env: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 's3.ap-south-1.amazonaws.com'
        },
        {
          protocol: 'https',
          hostname: 'sharkdom-test.s3.ap-south-1.amazonaws.com'
        },
        {
          protocol: 'https',
          hostname: 'cdn.sanity.io'
        },
        {
          protocol: 'https',
          hostname: 'images.unsplash.com'
        },
        {
          protocol: 'https',
          hostname: 'via.placeholder.com'
        }
      ],
      // Optimize images for better performance
      formats: ['image/webp', 'image/avif'],
      minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
      dangerouslyAllowSVG: true,
      contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
    },
    // Performance optimizations
    compress: true,
    poweredByHeader: false,
    // generateEtags: false, // commenting this out as this might be hurting caching
    // Enable experimental features for better performance
    experimental: {
      optimizePackageImports: [
        '@radix-ui/react-icons',
        'lucide-react',
        '@radix-ui/react-dialog',
        '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-select',
        'recharts',
        'chart.js',
        '@mui/material',
        'lodash',
        'date-fns',
        'framer-motion',
        '@tabler/icons-react'
      ]
    },
    // Disable source maps in production to save memory
    productionBrowserSourceMaps: false,
    // Webpack optimizations for memory efficiency
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      // Disable canvas and encoding for better performance
      config.resolve.alias.canvas = false
      config.resolve.alias.encoding = false

      // Ensure proper module resolution for ESM packages
      config.resolve.extensionAlias = {
        '.js': ['.js', '.ts', '.tsx'],
        '.jsx': ['.jsx', '.tsx']
      }

      // Memory optimizations - let Next.js handle chunk splitting
      if (!dev) {
        config.optimization = {
          ...config.optimization,
          moduleIds: 'deterministic'
        }
      }

      return config
    },
    async rewrites() {
      const apiUrl =
        process.env.SHARKDOM_API_URL ||
        process.env.NEXT_PUBLIC_SHARKDOM_API_URL ||
        'http://localhost:8080'
      return {
        beforeFiles: [
          {
            source: '/api/partner-leads',
            destination: `${apiUrl}/api/partner-leads`
          },
          {
            source: '/service/:path*',
            destination: `${apiUrl}/service/:path*`
          }
        ],
        fallback: [
          {
            source: '/api/:path*',
            destination: `${apiUrl}/:path*`
          }
        ]
      }
    },
    async redirects() {
      return [
        {
          source: '/apply-as-a-company',
          destination: '/apply-to-partner-program?tier=champion',
          permanent: true
        },
        {
          source: '/apply-as-a-consultant',
          destination: '/apply-to-partner-program?tier=referral',
          permanent: true
        },
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: 'sharkdom.com'
            }
          ],
          destination: 'https://www.sharkdom.com/:path*',
          permanent: true
        },
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: 'join.sharkdom.com'
            }
          ],
          destination: 'https://sharkdom.com/register/:path*',
          permanent: true
        }
      ]
    },
    async headers() {
      return [
        {
          source: '/api/referral',
          headers: [
            {
              key: 'Access-Control-Allow-Origin',
              value: '*'
            },
            {
              key: 'Access-Control-Allow-Methods',
              value: 'GET, POST, PUT, DELETE, OPTIONS'
            },
            {
              key: 'Access-Control-Allow-Headers',
              value: 'Content-Type, Authorization'
            }
          ]
        }
      ]
    }
  })
)

export default nextConfig
