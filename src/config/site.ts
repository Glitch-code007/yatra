import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";

export const siteConfig = {
  name: APP_NAME,
  description: APP_DESCRIPTION,
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og.jpg",
  links: {
    twitter: "https://twitter.com/yatra",
    github: "https://github.com/yatra",
  },
};

export type SiteConfig = typeof siteConfig;
