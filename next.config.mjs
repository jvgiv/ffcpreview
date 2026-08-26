/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep Sharp external to the server bundle and make its native runtime files
  // explicit in the account route's deployment trace.
  serverExternalPackages: ["sharp"],
  outputFileTracingIncludes: {
    "/api/account": [
      "node_modules/sharp/**/*",
      "node_modules/@img/sharp-*/**/*",
    ],
  },
};

export default nextConfig;
