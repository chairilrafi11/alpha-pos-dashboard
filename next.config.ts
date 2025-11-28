import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: 'http', // Gunakan 'http' karena Anda di localhost
        hostname: 'localhost', // Hostname harus sama persis
        port: '8081', // Port harus sama persis dengan yang digunakan backend
        pathname: '/pos/v1/img/tmp/image/**', // Sesuaikan path jika perlu, ** berarti semua subfolder
      },
      {
        protocol: 'http', // Gunakan 'http' karena Anda di localhost
        hostname: '89.116.34.144', // Hostname harus sama persis
        port: '8081', // Port harus sama persis dengan yang digunakan backend
        pathname: '/pos/v1/img/tmp/image/**', // Sesuaikan path jika perlu, ** berarti semua subfolder
      },
      // Anda juga bisa menambahkan domain produksi di sini (misal: 'cdn.cmsanda.com')
    ],
    // Pilihan lama (kurang disarankan, tapi bisa jadi fallback):
    // domains: ['localhost'], 
  },
};

export default nextConfig;
