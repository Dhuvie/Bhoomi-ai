"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

type WeatherCondition = "clear" | "cloudy" | "overcast" | "rain" | "storm" | "fog" | "haze";

interface CurrentWeather {
  tempC: number;
  feelsLikeC: number;
  condition: WeatherCondition;
  humidity: number;
  windKmh: number;
  windDir: string;
  uvIndex: number;
  rainfallMm: number;
}

interface ForecastDay {
  date: string;
  highC: number;
  lowC: number;
  condition: WeatherCondition;
  rainfallMm: number;
  windKmh: number;
}

interface WeatherData {
  current: CurrentWeather;
  forecast: ForecastDay[];
}

type PermissionState = "prompt" | "granted" | "denied" | "loading";

interface LocationContextValue {
  coords: { lat: number; lng: number } | null;
  locationName: string | null;
  permissionState: PermissionState;
  weather: WeatherData | null;
  weatherLoading: boolean;
  requestLocation: () => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);

const LOCATION_STORAGE_KEY = "bhoomi.location";

/**
 * Map Open-Meteo weather codes to our condition types.
 * https://open-meteo.com/en/docs (weather_code variable)
 */
function mapWeatherCode(code: number): WeatherCondition {
  if (code === 0) return "clear";
  if (code <= 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 67) return "rain";
  if (code >= 71 && code <= 77) return "cloudy"; // snow — treat as cloudy
  if (code >= 80 && code <= 82) return "rain";
  if (code >= 85 && code <= 86) return "cloudy"; // snow showers
  if (code >= 95 && code <= 99) return "storm";
  return "cloudy";
}

function windDirection(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

function getInitialLocationState(): { lat: number; lng: number; name?: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.lat && parsed.lng) return parsed;
    }
  } catch {
    // ignore
  }
  return null;
}

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(() => {
    const init = getInitialLocationState();
    return init ? { lat: init.lat, lng: init.lng } : null;
  });
  const [locationName, setLocationName] = useState<string | null>(() => {
    const init = getInitialLocationState();
    return init?.name || null;
  });
  const [permissionState, setPermissionState] = useState<PermissionState>(() => {
    const init = getInitialLocationState();
    return init ? "granted" : "prompt";
  });
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const requestLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setPermissionState("denied");
      return;
    }
    setPermissionState("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        setPermissionState("granted");
        // Persist
        try {
          localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify({ lat: latitude, lng: longitude, name: null }));
        } catch {
          // ignore
        }
        // Reverse geocode for a friendly name (best-effort)
        fetch(`/api/geocode?lat=${latitude}&lng=${longitude}`)
          .then((r) => r.json())
          .then((data) => {
            if (data.name) {
              setLocationName(data.name);
              try {
                const stored = localStorage.getItem(LOCATION_STORAGE_KEY);
                const parsed = stored ? JSON.parse(stored) : {};
                localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify({ ...parsed, name: data.name }));
              } catch {
                // ignore
              }
            }
          })
          .catch(() => {
            // ignore — name is optional
          });
      },
      (error) => {
        console.warn("[geolocation] error:", error.message);
        setPermissionState("denied");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
    );
  }, []);

  // Check permissions on mount if position not yet stored
  useEffect(() => {
    if (coords) return;
    if ("permissions" in navigator) {
      navigator.permissions.query({ name: "geolocation" as PermissionName }).then((result) => {
        if (result.state === "granted") {
          requestLocation();
        }
      }).catch(() => {
        // permissions API not fully supported — stay in prompt state
      });
    }
  }, [coords, requestLocation]);

  // Fetch weather whenever coords change
  useEffect(() => {
    if (!coords) return;
    let cancelled = false;

    async function fetchWeather() {
      setWeatherLoading(true);
      try {
        const res = await fetch(
          `/api/weather?lat=${coords!.lat}&lng=${coords!.lng}`
        );
        if (!res.ok) throw new Error(`weather HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setWeather(data);
        }
      } catch (err) {
        console.warn("[weather] fetch failed:", err);
      } finally {
        if (!cancelled) setWeatherLoading(false);
      }
    }
    fetchWeather();
    return () => { cancelled = true; };
  }, [coords]);

  return (
    <LocationContext.Provider
      value={{
        coords,
        locationName,
        permissionState,
        weather,
        weatherLoading,
        requestLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used within LocationProvider");
  return ctx;
}

