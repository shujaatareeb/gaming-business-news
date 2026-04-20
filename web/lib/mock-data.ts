export interface Topic {
  id: string;
  title: string;
  source: string;
  link: string;
  published: string;
  status: "discovered" | "researched" | "tweeted" | "skipped";
  summary: string;
  category: string;
  image: string;
}

export interface Tweet {
  id: string;
  topicId: string;
  text: string;
  postedAt: string;
  tweetUrl: string;
  impressions: number;
  likes: number;
  retweets: number;
  replies: number;
}

export interface PipelineRun {
  id: string;
  startedAt: string;
  completedAt: string;
  topicsFound: number;
  tweetsPosted: number;
  status: "success" | "partial" | "failed";
}

export const topics: Topic[] = [
  {
    id: "1",
    title: "Iron Galaxy Studios Announces Further Layoffs Amid Market Conditions",
    source: "GamesIndustry.biz",
    link: "https://www.gamesindustry.biz/iron-galaxy-studios-announces-further-layoffs-unknown-number-of-staff-affected",
    published: "2026-04-20T03:42:32Z",
    status: "tweeted",
    category: "Strategy",
    image: "https://assetsio.gnwcdn.com/tony-hawk-pro-skater.webp?width=690&quality=85&format=jpg&auto=webp",
    summary:
      "Tony Hawk's Pro Skater 3+4 developer Iron Galaxy Studios has cut an unknown number of roles in response to \"current market conditions.\" The studio is adopting a new posture to accept these conditions as permanent, signaling a broader industry shift in workforce planning.",
  },
  {
    id: "2",
    title: "Weak Job Security Risks an Industry Brain Drain",
    source: "GamesIndustry.biz",
    link: "https://www.gamesindustry.biz/weak-job-security-risks-an-industry-brain-drain-opinion",
    published: "2026-04-17T11:03:44Z",
    status: "tweeted",
    category: "Strategy",
    image: "https://assetsio.gnwcdn.com/mantas-hesthaven-_g1WdcKcV3w-unsplash.jpg?width=690&quality=85&format=jpg&auto=webp",
    summary:
      "Focus on external economic factors — from recession fears to component scarcity — can overshadow the looming challenge of talent retention. Persistent layoffs and weak job security threaten to push experienced developers out of the industry entirely.",
  },
  {
    id: "3",
    title: "Ubisoft Union Workers Agree Settlement as Game Pass Pricing Questioned",
    source: "Game Developer",
    link: "https://www.gamedeveloper.com/business/ubisoft-union-workers-agree-settlement-some-legal-advice-for-game-devs-and-is-xbox-game-pass-too-expensive-",
    published: "2026-04-17T06:54:31Z",
    status: "researched",
    category: "Strategy",
    image: "https://eu-images.contentstack.com/v3/assets/blt740a130ae3c5d529/bltefb2cbc7c7b761c9/69e20c7f9bf7d4e87b742305/Patch_Notes_Header.png?width=1280&auto=webp&quality=80&disable=upscale",
    summary:
      "Ubisoft union workers reach a settlement amid broader industry labor tensions. Meanwhile, questions mount over Xbox Game Pass pricing as Among Us tops 1 billion downloads on Google Play and Epic doubles down on its Disney partnership.",
  },
  {
    id: "4",
    title: "Roblox Releases Agentic AI Tools, Promises \"Build a Game With a Single Prompt\"",
    source: "GamesIndustry.biz",
    link: "https://www.gamesindustry.biz/roblox-releases-agentic-ai-tools-for-creators-promising-ability-to-build-a-game-with-a-single-prompt",
    published: "2026-04-17T04:01:48Z",
    status: "tweeted",
    category: "Funding",
    image: "https://assetsio.gnwcdn.com/roblox-stock-image.jpg?width=690&quality=85&format=jpg&auto=webp",
    summary:
      "Roblox has released an agentic AI feature for Roblox Studio that turns text prompts into game design documents which the tool can implement and test. The move positions Roblox at the forefront of AI-powered game creation platforms.",
  },
  {
    id: "5",
    title: "Aptoide Files Antitrust Lawsuit Against Google, Alleges \"Anticompetitive Chokehold\"",
    source: "GamesIndustry.biz",
    link: "https://www.gamesindustry.biz/alternative-app-store-aptoide-files-antitrust-lawsuit-against-google-alleges-anticompetitive-chokehold",
    published: "2026-04-17T03:56:00Z",
    status: "tweeted",
    category: "Strategy",
    image: "https://assetsio.gnwcdn.com/Google-Play-Store-logo.jpg?width=690&quality=85&format=jpg&auto=webp",
    summary:
      "Alternative app store Aptoide has filed an antitrust lawsuit against Google, alleging the tech giant maintains an anticompetitive chokehold over third-party app stores. The case could have major implications for mobile game distribution.",
  },
  {
    id: "6",
    title: "Roblox to Pay Over $12M to Nevada in Child Safety Settlement",
    source: "GamesIndustry.biz",
    link: "https://www.gamesindustry.biz/roblox-to-pay-over-12m-to-state-of-nevada-in-child-safety-settlement",
    published: "2026-04-16T09:18:16Z",
    status: "tweeted",
    category: "Strategy",
    image: "https://assetsio.gnwcdn.com/roblox-logo.jpg?width=690&quality=85&format=jpg&auto=webp",
    summary:
      "Roblox has agreed to pay more than $12 million to the state of Nevada as part of a settlement that includes additional protections for child safety. The settlement adds to growing regulatory pressure on platforms with young audiences.",
  },
  {
    id: "7",
    title: "Switch 2 Games Spotted at Steep Discount in Costco Fire Sale",
    source: "Kotaku",
    link: "https://kotaku.com/costco-sale-switch-2-games-cheap-pokemon-2000688792",
    published: "2026-04-18T10:44:46Z",
    status: "discovered",
    category: "Hardware",
    image: "https://kotaku.com/app/uploads/2026/04/switch-2-games-1280x761.jpg",
    summary:
      "Players are reporting a surprise fire sale on Switch 2 games at Costco, with titles like Pok\u00e9mon Legends Z-A being sold for just $30. The steep discounts raise questions about retail pricing strategy and inventory management ahead of the console's launch window.",
  },
  {
    id: "8",
    title: "BAFTA Games Awards: Why Commercial Influence Is a Red Line",
    source: "GamesIndustry.biz",
    link: "https://www.gamesindustry.biz/you-cant-buy-a-bafta-why-commercial-influence-is-a-red-line-for-the-bafta-games-awards",
    published: "2026-04-17T08:07:32Z",
    status: "skipped",
    category: "Strategy",
    image: "https://assetsio.gnwcdn.com/Jane-Millichip%2C-CEO-of-BAFTA---Photo-Credit%2C-Lily-Sadin-(1).jpg?width=690&quality=85&format=jpg&auto=webp",
    summary:
      "BAFTA CEO Jane Millichip discusses the organization's stance against commercial influence in its Games Awards, emphasizing editorial independence as publishers increasingly seek awards recognition as a marketing tool.",
  },
  {
    id: "9",
    title: "FalleN's CS2 Retirement Marks End of an Era for Esports",
    source: "Esports Insider",
    link: "https://esportsinsider.com/2026/04/fallen-cs2-retirement-good",
    published: "2026-04-17T18:13:01Z",
    status: "tweeted",
    category: "Esports",
    image: "https://picsum.photos/seed/fallen-cs2/800/450",
    summary:
      "Veteran Counter-Strike pro FalleN announces retirement after a 20-year career. FURIA's IGL will compete through the rest of 2026 before stepping away. The announcement came on-stage at IEM Rio, marking the departure of one of CS's most influential figures and raising questions about succession in esports leadership.",
  },
  {
    id: "10",
    title: "Esports Was Never Apolitical — And the Industry Can't Pretend Anymore",
    source: "Esports Insider",
    link: "https://esportsinsider.com/2026/04/esports-is-political-and-it-matters",
    published: "2026-04-17T17:06:20Z",
    status: "tweeted",
    category: "Esports",
    image: "https://picsum.photos/seed/esports-politics/800/450",
    summary:
      "International politics shapes esports the same way it affects every industry — from sanctions blocking players, to visa restrictions limiting tournaments, to government regulation of gambling-adjacent mechanics. The pretense of neutrality is no longer sustainable as the sector matures.",
  },
];

export const tweets: Tweet[] = [
  {
    id: "t1",
    topicId: "1",
    text: "Iron Galaxy calling layoffs a \"permanent\" market condition is the most honest thing a studio has said all year. The question isn't when hiring bounces back \u2014 it's whether it does at all.",
    postedAt: "2026-04-20T04:00:00Z",
    tweetUrl: "https://x.com/i/status/123456",
    impressions: 8400,
    likes: 287,
    retweets: 73,
    replies: 41,
  },
  {
    id: "t2",
    topicId: "2",
    text: "The brain drain warning is real. When an industry normalizes constant layoffs, the best talent doesn't wait around \u2014 they leave for tech companies that won't fire them every 18 months.",
    postedAt: "2026-04-17T12:00:00Z",
    tweetUrl: "https://x.com/i/status/123457",
    impressions: 11200,
    likes: 412,
    retweets: 98,
    replies: 56,
  },
  {
    id: "t3",
    topicId: "4",
    text: "Roblox just shipped \"build a game with one prompt.\" Whether this empowers creators or commoditizes them is the billion-dollar question. Either way, the dev tools market just changed.",
    postedAt: "2026-04-17T05:00:00Z",
    tweetUrl: "https://x.com/i/status/123458",
    impressions: 9800,
    likes: 341,
    retweets: 87,
    replies: 45,
  },
  {
    id: "t4",
    topicId: "5",
    text: "Aptoide suing Google over app store monopoly. If this gains traction, mobile game distribution could look very different in 2-3 years. Epic blazed the trail, now others are following.",
    postedAt: "2026-04-17T04:30:00Z",
    tweetUrl: "https://x.com/i/status/123459",
    impressions: 5600,
    likes: 156,
    retweets: 42,
    replies: 19,
  },
  {
    id: "t5",
    topicId: "6",
    text: "$12M child safety fine for Roblox. Cost of doing business when your platform has 70M+ daily users under 16. Expect more states to follow Nevada's lead here.",
    postedAt: "2026-04-16T10:00:00Z",
    tweetUrl: "https://x.com/i/status/123460",
    impressions: 7300,
    likes: 198,
    retweets: 54,
    replies: 31,
  },
];

export const pipelineRuns: PipelineRun[] = [
  {
    id: "r1",
    startedAt: "2026-04-20T09:00:00Z",
    completedAt: "2026-04-20T09:02:34Z",
    topicsFound: 3,
    tweetsPosted: 2,
    status: "success",
  },
  {
    id: "r2",
    startedAt: "2026-04-19T19:00:00Z",
    completedAt: "2026-04-19T19:01:58Z",
    topicsFound: 2,
    tweetsPosted: 2,
    status: "success",
  },
  {
    id: "r3",
    startedAt: "2026-04-19T14:00:00Z",
    completedAt: "2026-04-19T14:03:12Z",
    topicsFound: 4,
    tweetsPosted: 1,
    status: "partial",
  },
  {
    id: "r4",
    startedAt: "2026-04-19T09:00:00Z",
    completedAt: "2026-04-19T09:00:45Z",
    topicsFound: 0,
    tweetsPosted: 0,
    status: "success",
  },
  {
    id: "r5",
    startedAt: "2026-04-18T19:00:00Z",
    completedAt: "2026-04-18T19:02:10Z",
    topicsFound: 3,
    tweetsPosted: 3,
    status: "success",
  },
];

export const stats = {
  totalTweets: 47,
  totalImpressions: 284000,
  totalTopics: 156,
  avgEngagement: 4.2,
  tweetsToday: 2,
  topicsToday: 3,
};

export interface Stock {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export const stocks: Stock[] = [
  { ticker: "NTDOY", name: "Nintendo", price: 78.42, change: 2.15, changePercent: 2.82 },
  { ticker: "SONY", name: "Sony Group", price: 91.37, change: 1.48, changePercent: 1.65 },
  { ticker: "MSFT", name: "Microsoft", price: 428.52, change: -3.21, changePercent: -0.74 },
  { ticker: "EA", name: "Electronic Arts", price: 142.18, change: -1.87, changePercent: -1.30 },
  { ticker: "TTWO", name: "Take-Two", price: 198.64, change: 4.32, changePercent: 2.22 },
  { ticker: "ATVI", name: "Activision", price: 94.10, change: 0.55, changePercent: 0.59 },
  { ticker: "RBLX", name: "Roblox", price: 52.89, change: 3.17, changePercent: 6.37 },
  { ticker: "U", name: "Unity", price: 24.63, change: -0.92, changePercent: -3.60 },
  { ticker: "SE", name: "Sea Ltd", price: 87.41, change: 1.23, changePercent: 1.43 },
  { ticker: "NTES", name: "NetEase", price: 103.55, change: -0.68, changePercent: -0.65 },
  { ticker: "UBSFY", name: "Ubisoft", price: 18.92, change: -2.41, changePercent: -11.30 },
  { ticker: "CCOEY", name: "Capcom", price: 38.76, change: 0.89, changePercent: 2.35 },
];
