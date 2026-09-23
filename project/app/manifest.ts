import type { MetadataRoute } from "next";
import { getSiteMetadataData } from "@/lib/get-site-metadata";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const site = await getSiteMetadataData();

  return {
    name: site.nameEn,
    short_name: site.nameEn,
    description: site.taglineEn,
    start_url: "/",
    display: "standalone",
    background_color: "#14161a",
    theme_color: "#14161a",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
