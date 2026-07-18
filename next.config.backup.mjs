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
        }
      ]
    },
    async rewrites() {
      return {
        beforeFiles: [
          {
            source: '/service/:path*',
            destination: `${process.env.SHARKDOM_API_URL}/service/:path*`
          }
        ],
        fallback: [
          {
            source: '/api/:path*',
            destination: `${process.env.SHARKDOM_API_URL}/:path*`
          }
        ]
      }
    },
    async redirects() {
      return [
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
              value: '*' // Set your origin
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
    },
    experimental: {
      // esmExternals: 'loose'
    },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      config.resolve.alias.canvas = false
      config.resolve.alias.encoding = false
      return config
    }
  })
)

export default nextConfig
