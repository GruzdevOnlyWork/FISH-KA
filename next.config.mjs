const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  output: 'standalone', 
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
}

export default nextConfig