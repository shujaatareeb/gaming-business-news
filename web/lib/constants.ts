export const SITE_NAME = "GamePulse";
export const SITE_URL = "https://gamepulse.news";
export const SITE_DESCRIPTION = "Gaming industry business intelligence. AI-curated coverage of acquisitions, earnings, funding, and market shifts.";

export const categoryColors: Record<string, string> = {
  "M&A": "text-tag-ma",
  Earnings: "text-tag-earnings",
  Funding: "text-tag-funding",
  Hardware: "text-tag-hardware",
  Strategy: "text-tag-strategy",
  Subscriptions: "text-tag-subscriptions",
  Esports: "text-tag-earnings",
};

export const runStatusStyles: Record<string, { dot: string; text: string }> = {
  success: { dot: "bg-status-success", text: "text-status-success" },
  partial: { dot: "bg-status-partial", text: "text-status-partial" },
  failed: { dot: "bg-status-failed", text: "text-status-failed" },
};

export const SHORT_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};
