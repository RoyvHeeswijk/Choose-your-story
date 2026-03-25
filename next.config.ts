import type { NextConfig } from "next";

/**
 * Default build output: `.next` in this project.
 * A custom distDir outside the repo breaks `next dev` (server bundles can’t resolve
 * `react/jsx-runtime` and `next/dist/compiled/...` → MODULE_NOT_FOUND).
 *
 * OneDrive EPERM on `.next/trace`: use one `npm run dev` only, delete `.next` and retry,
 * or exclude the `.next` folder from OneDrive sync.
 */
const nextConfig: NextConfig = {
  images: { unoptimized: true },
};

export default nextConfig;
