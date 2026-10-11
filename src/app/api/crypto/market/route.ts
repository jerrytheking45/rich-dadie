
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/coins/markets";

const PAGE_SIZE = 20;
const MAX_PAGE = 100;
const CACHE_SECONDS = 60;

interface CoinGeckoMarketCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number | null;
  market_cap: number | null;
  market_cap_rank: number | null;
  total_volume: number | null;
  price_change_percentage_24h: number | null;
  last_updated: string | null;
}

export async function GET(request: NextRequest) {
  const rawPage = request.nextUrl.searchParams.get("page") ?? "1";
  const pageNumber = Number(rawPage);

  if (
    !Number.isSafeInteger(pageNumber) ||
    pageNumber < 1 ||
    pageNumber > MAX_PAGE
  ) {
    return NextResponse.json(
      { error: "Invalid market page." },
      { status: 400 }
    );
  }

  const url = new URL(COINGECKO_URL);

  url.searchParams.set("vs_currency", "usd");
  url.searchParams.set("order", "market_cap_desc");
  url.searchParams.set("per_page", String(PAGE_SIZE));
  url.searchParams.set("page", String(pageNumber));
  url.searchParams.set("sparkline", "false");
  url.searchParams.set("price_change_percentage", "24h");

  const apiKey = process.env.COINGECKO_DEMO_API_KEY?.trim();

  const headers: HeadersInit = {
    Accept: "application/json",
  };

  if (apiKey) {
    headers["x-cg-demo-api-key"] = apiKey;
  }

  try {
    const response = await fetch(url.toString(), {
      headers,
      next: {
        revalidate: CACHE_SECONDS,
      },
    });

    if (!response.ok) {
      if (response.status === 429) {
        return NextResponse.json(
          {
            error:
              "Market data is temporarily rate-limited. Please try again shortly.",
          },
          { status: 503 }
        );
      }

      console.error(
        "CoinGecko market API error:",
        response.status
      );

      return NextResponse.json(
        {
          error:
            "Live market prices are temporarily unavailable.",
        },
        { status: 502 }
      );
    }

    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid market response");
    }

    const coins: CoinGeckoMarketCoin[] = data
      .filter(
        (item): item is CoinGeckoMarketCoin =>
          item !== null &&
          typeof item === "object" &&
          typeof item.id === "string" &&
          typeof item.name === "string" &&
          typeof item.symbol === "string"
      )
      .map((item) => ({
        id: item.id,
        symbol: item.symbol,
        name: item.name,
        image: item.image,
        current_price: item.current_price,
        market_cap: item.market_cap,
        market_cap_rank: item.market_cap_rank,
        total_volume: item.total_volume,
        price_change_percentage_24h:
          item.price_change_percentage_24h,
        last_updated: item.last_updated,
      }));

    return NextResponse.json(
      {
        coins,
        page: pageNumber,
        pageSize: PAGE_SIZE,
        hasMore: coins.length === PAGE_SIZE,
        fetchedAt: new Date().toISOString(),
        source: "CoinGecko",
        currency: "USD",
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=60, stale-while-revalidate=30",
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch live crypto market:", error);

    return NextResponse.json(
      {
        error:
          "Unable to retrieve live cryptocurrency prices right now.",
      },
      { status: 502 }
    );
  }
}