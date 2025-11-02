import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/geocode?lat=19.07&lng=82.05
 *
 * Reverse geocodes coordinates to a friendly place name.
 * Uses BigDataCloud's free reverse geocoding API (no key needed).
 */

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

    // BigDataCloud free reverse geocoding — no API key needed
    // Returns city, locality, principalSubdivision, countryName
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

    const res = await fetch(url, {
      next: { revalidate: 86400 }, // cache for 24h — location name rarely changes
    });

    if (!res.ok) {
      throw new Error(`Geocode HTTP ${res.status}`);
    }

    const data = await res.json();

    // Build a friendly name: prefer city, then locality, then principalSubdivision
    const name = data.city || data.locality || data.principalSubdivision || data.countryName || null;

    return NextResponse.json({
      name,
      city: data.city || null,
      locality: data.locality || null,
      district: data.principalSubdivision || null,
      country: data.countryName || null,
      source: "bigdatacloud",
    });
  } catch (error: any) {
    console.error("[/api/geocode] error:", error?.message ?? error);
    // Return null name on failure — app still works without a location name
    return NextResponse.json({ name: null, error: error?.message ?? "Geocode failed" });
  }
}
