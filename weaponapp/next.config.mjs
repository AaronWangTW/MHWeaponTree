/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: "/weaponapp",
    output: "export",  // <=== enables static exports
    reactStrictMode: true,
    assetPrefix: '/weaponapp',
    trailingSlash: true,
};

export default nextConfig;
