/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: "/MHWeaponTree",
    output: "export",  // <=== enables static exports
    reactStrictMode: true,
    assetPrefix: '/MHWeaponTree',
    trailingSlash: true,
};

export default nextConfig;
