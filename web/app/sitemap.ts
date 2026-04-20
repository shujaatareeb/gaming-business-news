import type { MetadataRoute } from "next";
import { topics, stocks } from "@/lib/mock-data";

const BASE_URL = "https://gamepulse.news";

export default function sitemap(): MetadataRoute.Sitemap {
  const storyPages = topics.map((topic) => ({
    url: `${BASE_URL}/story/${topic.id}`,
    lastModified: new Date(topic.published),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const stockPages = stocks.map((stock) => ({
    url: `${BASE_URL}/stocks/${stock.ticker.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...storyPages,
    ...stockPages,
  ];
}
