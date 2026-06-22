import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["dev.anaconda-notothen.ts.net"],
  webpack: (config, { dev }) => {
    if (dev) {
      // eval-source-map wraps modules in eval(), but Next.js's
      // getAssetPrefix() relies on document.currentScript which is null
      // inside eval(). Switching to source-map avoids this crash and
      // ensures React client-side hydration works in dev mode.
      config.devtool = "source-map";
    }
    return config;
  },
};

export default nextConfig;
