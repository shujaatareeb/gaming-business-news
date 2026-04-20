import type { Stock } from "./mock-data";

export const tickerKeywords: Record<string, string[]> = {
  NTDOY: ["nintendo", "switch 2"],
  SONY: ["sony", "playstation", "kadokawa", "fromsoftware"],
  MSFT: ["microsoft", "xbox", "game pass", "activision"],
  EA: ["ea ", "electronic arts", "battlefield", "ea shuts"],
  TTWO: ["take-two", "rockstar", "gta"],
  ATVI: ["activision", "blizzard", "call of duty"],
  RBLX: ["roblox"],
  U: ["unity engine", "unity software"],
  SE: ["sea ltd", "garena", "free fire"],
  NTES: ["netease"],
  UBSFY: ["ubisoft"],
  CCOEY: ["capcom"],
};

// Deterministic company profiles keyed by ticker
export const companyProfiles: Record<string, {
  description: string;
  sector: string;
  employees: string;
  founded: string;
  hq: string;
  ceo: string;
  website: string;
  keyFranchises: string[];
}> = {
  NTDOY: {
    description: "Nintendo Co., Ltd. develops, manufactures, and sells entertainment products. The company offers video game consoles, handheld devices, software, and accessories. Nintendo is known for iconic franchises and a hardware-driven business model that prioritizes first-party content.",
    sector: "Interactive Entertainment",
    employees: "7,700+",
    founded: "1889",
    hq: "Kyoto, Japan",
    ceo: "Shuntaro Furukawa",
    website: "nintendo.com",
    keyFranchises: ["Mario", "Zelda", "Pokemon", "Animal Crossing", "Splatoon"],
  },
  SONY: {
    description: "Sony Group Corporation operates through its Game & Network Services segment, which includes PlayStation consoles, game software, and network services. Sony Interactive Entertainment is the world's largest console gaming company by revenue.",
    sector: "Conglomerate / Gaming",
    employees: "113,000+",
    founded: "1946",
    hq: "Tokyo, Japan",
    ceo: "Kenichiro Yoshida",
    website: "sony.com",
    keyFranchises: ["PlayStation", "God of War", "Spider-Man", "The Last of Us", "Gran Turismo"],
  },
  MSFT: {
    description: "Microsoft Corporation's gaming division operates Xbox consoles, Game Pass subscription service, and a portfolio of first-party studios including Bethesda and Activision Blizzard. Xbox Game Pass is central to Microsoft's gaming strategy.",
    sector: "Technology / Gaming",
    employees: "228,000+",
    founded: "1975",
    hq: "Redmond, WA",
    ceo: "Satya Nadella",
    website: "xbox.com",
    keyFranchises: ["Halo", "Forza", "Call of Duty", "Elder Scrolls", "Minecraft"],
  },
  EA: {
    description: "Electronic Arts Inc. develops, publishes, and distributes games across console, PC, and mobile. EA is known for annual sports franchises and live service games. The company has shifted toward a recurring revenue model driven by microtransactions and subscriptions.",
    sector: "Interactive Entertainment",
    employees: "13,400+",
    founded: "1982",
    hq: "Redwood City, CA",
    ceo: "Andrew Wilson",
    website: "ea.com",
    keyFranchises: ["EA Sports FC", "Madden NFL", "Apex Legends", "The Sims", "Battlefield"],
  },
  TTWO: {
    description: "Take-Two Interactive Software, Inc. develops, publishes, and markets interactive entertainment. Through its Rockstar Games and 2K labels, the company produces some of the highest-grossing entertainment products ever made. GTA V has generated over $8 billion in lifetime revenue.",
    sector: "Interactive Entertainment",
    employees: "11,600+",
    founded: "1993",
    hq: "New York, NY",
    ceo: "Strauss Zelnick",
    website: "take2games.com",
    keyFranchises: ["Grand Theft Auto", "Red Dead Redemption", "NBA 2K", "Civilization", "BioShock"],
  },
  ATVI: {
    description: "Activision Blizzard, Inc. develops, publishes, and distributes interactive entertainment worldwide. Now a subsidiary of Microsoft following the $68.7B acquisition. The company operates Activision Publishing, Blizzard Entertainment, and King Digital.",
    sector: "Interactive Entertainment",
    employees: "17,000+",
    founded: "1979",
    hq: "Santa Monica, CA",
    ceo: "Bobby Kotick (former)",
    website: "activisionblizzard.com",
    keyFranchises: ["Call of Duty", "World of Warcraft", "Overwatch", "Diablo", "Candy Crush"],
  },
  RBLX: {
    description: "Roblox Corporation operates a global platform that brings people together through shared experiences. The platform hosts millions of user-generated 3D experiences and has become the dominant gaming platform for audiences under 16. Roblox's developer economy paid out over $800M to creators in 2024.",
    sector: "Platform / UGC",
    employees: "2,100+",
    founded: "2004",
    hq: "San Mateo, CA",
    ceo: "David Baszucki",
    website: "roblox.com",
    keyFranchises: ["Roblox Platform", "Roblox Studio", "Roblox Cloud"],
  },
  U: {
    description: "Unity Technologies operates a platform for creating and operating real-time 3D content. Unity's game engine powers over 50% of all mobile games and is used across industries including automotive, film, and architecture. The company has faced controversy over pricing changes.",
    sector: "Game Engine / Tools",
    employees: "7,400+",
    founded: "2004",
    hq: "San Francisco, CA",
    ceo: "Matthew Bromberg",
    website: "unity.com",
    keyFranchises: ["Unity Engine", "Unity Ads", "Unity Gaming Services"],
  },
  SE: {
    description: "Sea Limited operates Garena, a leading global online games platform. Its Free Fire mobile game is one of the most downloaded games globally. Sea also operates Shopee (e-commerce) and SeaMoney (fintech) across Southeast Asia and Latin America.",
    sector: "Internet / Gaming",
    employees: "58,000+",
    founded: "2009",
    hq: "Singapore",
    ceo: "Forrest Li",
    website: "sea.com",
    keyFranchises: ["Free Fire", "Garena", "Shopee"],
  },
  NTES: {
    description: "NetEase, Inc. operates online games and related services in China and internationally. NetEase is China's second-largest gaming company and operates popular MMOs and mobile titles. The company also runs a music streaming service and education platform.",
    sector: "Internet / Gaming",
    employees: "33,000+",
    founded: "1997",
    hq: "Hangzhou, China",
    ceo: "William Ding",
    website: "netease.com",
    keyFranchises: ["Fantasy Westward Journey", "Naraka: Bladepoint", "Eggy Party", "Marvel Rivals"],
  },
  UBSFY: {
    description: "Ubisoft Entertainment SA develops, publishes, and distributes video games worldwide. Known for large open-world franchises, Ubisoft has faced recent financial challenges and strategic questions about its future direction. The Guillemot family maintains control through a complex ownership structure.",
    sector: "Interactive Entertainment",
    employees: "18,700+",
    founded: "1986",
    hq: "Montreuil, France",
    ceo: "Yves Guillemot",
    website: "ubisoft.com",
    keyFranchises: ["Assassin's Creed", "Far Cry", "Rainbow Six", "Just Dance", "Prince of Persia"],
  },
  CCOEY: {
    description: "Capcom Co., Ltd. develops, publishes, and distributes video games globally. Capcom has executed one of the most successful turnarounds in gaming, leveraging its deep IP library and the RE Engine to deliver consistent hits. The company's operating margins are among the highest in the industry.",
    sector: "Interactive Entertainment",
    employees: "3,600+",
    founded: "1979",
    hq: "Osaka, Japan",
    ceo: "Haruhiro Tsujimoto",
    website: "capcom.com",
    keyFranchises: ["Resident Evil", "Monster Hunter", "Street Fighter", "Devil May Cry", "Mega Man"],
  },
};

function tickerSeed(ticker: string): number {
  return ticker.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

export function getStockStats(stock: Stock) {
  const seed = tickerSeed(stock.ticker);
  const s = (n: number) => ((seed * 31 + n * 17) % 100) / 100;

  const open = stock.price - stock.change;
  const prevClose = open - (s(13) * 2 - 1) * stock.price * 0.005;
  const dayRange = stock.price * 0.015;
  const peRatio = s(6) * 25 + 12;

  return {
    prevClose: prevClose.toFixed(2),
    open: open.toFixed(2),
    high: (stock.price + dayRange * s(1)).toFixed(2),
    low: (open - dayRange * s(2)).toFixed(2),
    close: stock.price.toFixed(2),
    volume: `${(s(3) * 18 + 2).toFixed(1)}M`,
    avgVolume: `${(s(4) * 12 + 4).toFixed(1)}M`,
    marketCap: `$${(s(5) * 180 + 20).toFixed(1)}B`,
    peRatio: peRatio.toFixed(1),
    eps: (stock.price / peRatio).toFixed(2),
    dividend: `${(s(7) * 2.5).toFixed(2)}%`,
    beta: (s(8) * 1.2 + 0.5).toFixed(2),
    week52High: (stock.price * (1 + s(9) * 0.25 + 0.05)).toFixed(2),
    week52Low: (stock.price * (1 - s(10) * 0.25 - 0.05)).toFixed(2),
    avgAnalystRating: ["Strong Buy", "Buy", "Hold", "Buy", "Strong Buy"][Math.floor(s(11) * 5)],
    targetPrice: (stock.price * (1 + s(12) * 0.2)).toFixed(2),
  };
}

export interface OHLCDataPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export function getOHLCData(stock: Stock, days: number = 90): OHLCDataPoint[] {
  const seed = tickerSeed(stock.ticker);
  const data: OHLCDataPoint[] = [];
  const today = new Date();
  let close = stock.price * (1 - (days * 0.001) + (seed % 10) * 0.005);

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const dow = date.getDay();
    if (dow === 0 || dow === 6) continue;

    const dayIndex = days - i;
    const p1 = Math.sin(seed * 0.13 + dayIndex * 0.31) * 0.5 + 0.5;
    const p2 = Math.sin(seed * 0.07 + dayIndex * 0.53) * 0.5 + 0.5;
    const p3 = Math.sin(seed * 0.19 + dayIndex * 0.17) * 0.5 + 0.5;

    const trend = (stock.price - close) / (i + 10);
    const volatility = stock.price * 0.012;
    const open = close;
    close = open + trend + (p1 - 0.48) * volatility;
    close = Math.max(close, stock.price * 0.5);

    const spread = Math.abs(close - open);
    const high = Math.max(open, close) + spread * p2 * 1.5 + stock.price * 0.002;
    const low = Math.min(open, close) - spread * p3 * 1.5 - stock.price * 0.002;
    const volume = Math.round((p1 * 15 + 3) * 1_000_000);

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    data.push({
      time: `${yyyy}-${mm}-${dd}`,
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume,
    });
  }

  if (data.length > 0) {
    data[data.length - 1].close = stock.price;
  }

  return data;
}
