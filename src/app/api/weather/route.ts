import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/weather?lat=19.07&lng=82.05
 *
 * Fetches real weather data from wttr.in (free, no API key needed).
 * Returns current weather + 7-day forecast in our app's shape.
 */

type WeatherCondition = "clear" | "cloudy" | "overcast" | "rain" | "storm" | "fog" | "haze";

/**
 * Map wttr.in weather codes to our condition types.
 * wttr.in uses WorldWeatherOnline codes.
 * https://www.worldweatheronline.com/weather-content-api.aspx
 */
function mapWttrCode(code: number, desc: string): WeatherCondition {
  const d = desc.toLowerCase();
  if (d.includes("thunder") || d.includes("storm")) return "storm";
  if (d.includes("rain") || d.includes("drizzle") || d.includes("shower")) return "rain";
  if (d.includes("fog") || d.includes("mist") || d.includes("haze")) return "fog";
  if (d.includes("clear") || d.includes("sunny")) return "clear";
  // WWO codes: 113 = clear, 116 = partly cloudy, 119/122 = cloudy/overcast
  if (code === 113) return "clear";
  if (code === 116) return "cloudy";
  if (code === 119 || code === 122) return "overcast";
  if (code === 143 || code === 248 || code === 260) return "fog";
  if (code >= 176 && code <= 377) return "rain";
  if (code >= 200 && code <= 200) return "storm";
  return "cloudy";
}

function windDirection(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (!lat || !lng) {
      return NextResponse.json({ error: "lat and lng are required" }, { status: 400 });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
    }

    // wttr.in — free, no API key needed. Format=j1 returns structured JSON.
    const url = `https://wttr.in/${latitude},${longitude}?format=j1`;

    const res = await fetch(url, {
      next: { revalidate: 600 }, // cache 10 minutes
      headers: { "Accept": "application/json" },
    });

    if (!res.ok) {
      throw new Error(`wttr.in HTTP ${res.status}`);
    }

    const data = await res.json();

    // Current weather
    const cur = data.current_condition?.[0];
    if (!cur) throw new Error("No current_condition in response");

    const current = {
      tempC: parseInt(cur.temp_C, 10),
      feelsLikeC: parseInt(cur.FeelsLikeC, 10),
      condition: mapWttrCode(parseInt(cur.weatherCode, 10), cur.weatherDesc?.[0]?.value ?? ""),
      humidity: parseInt(cur.humidity, 10),
      windKmh: parseInt(cur.windspeedKmph, 10),
      windDir: cur.winddir16Point || windDirection(parseInt(cur.winddirDegree, 10)),
      uvIndex: parseInt(cur.uvIndex, 10),
      rainfallMm: parseFloat(cur.precipMM) || 0,
    };

    // 7-day forecast — wttr.in returns weather array
    const forecast = (data.weather || []).map((day: any) => {
      const date = day.date; // "YYYY-MM-DD"
      const maxC = parseInt(day.maxtempC, 10);
      const minC = parseInt(day.mintempC, 10);
      // Use midday hour for representative condition
      const middayHour = day.hourly?.find((h: any) => h.time === "1200") || day.hourly?.[4] || day.hourly?.[0];
      const code = parseInt(middayHour?.weatherCode || "116", 10);
      const desc = middayHour?.weatherDesc?.[0]?.value ?? "";
      const condition = mapWttrCode(code, desc);
      const rainfallMm = day.hourly?.reduce((sum: number, h: any) => sum + parseFloat(h.precipMM || "0"), 0) || 0;
      const windKmh = parseInt(day.hourly?.[4]?.windspeedKmph || "0", 10);

      return {
        date,
        highC: maxC,
        lowC: minC,
        condition,
        rainfallMm: Math.round(rainfallMm * 10) / 10,
        windKmh,
      };
    }).slice(0, 7);

    return NextResponse.json({
      current,
      forecast,
      source: "wttr.in",
      fetchedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[/api/weather] error:", error?.message ?? error);
    return NextResponse.json(
      { error: error?.message ?? "Weather fetch failed" },
      { status: 500 }
    );
  }
}
