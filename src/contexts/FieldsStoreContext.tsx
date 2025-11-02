"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { fields as seedFields, Field, FieldBoundary, Crop } from "@/lib/mock-data";

const STORAGE_KEY = "bhoomi.fields";

interface NewFieldInput {
  name: string;
  crop: Crop;
  boundary: FieldBoundary[];
  center: { lat: number; lng: number };
  areaAcres: number;
}

interface FieldsStoreContextValue {
  fields: Field[];
  addField: (input: NewFieldInput) => Field;
  getField: (id: string) => Field | undefined;
}

const FieldsStoreContext = createContext<FieldsStoreContextValue | null>(null);

export function FieldsStoreProvider({ children }: { children: React.ReactNode }) {
  const [fields, setFields] = useState<Field[]>(seedFields);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFields(parsed); // eslint-disable-line react-hooks/set-state-in-effect
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist whenever fields change (after initial load)
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true); // eslint-disable-line react-hooks/set-state-in-effect
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fields));
    } catch {
      // ignore
    }
  }, [fields, loaded]);

  const addField = useCallback((input: NewFieldInput): Field => {
    const newField: Field = {
      id: `field-${Date.now()}`,
      name: input.name,
      crop: input.crop,
      areaAcres: input.areaAcres,
      boundary: input.boundary,
      center: input.center,
      healthScore: 70, // initial — will be refined by satellite data
      healthTrend: "flat",
      ndvi: 0.5,
      moisture: 50,
      daysSincePlanting: 0,
      growthStage: "planting",
      lastUpdated: new Date().toISOString(),
      story: [
        {
          id: `s-${Date.now()}`,
          type: "planting",
          date: new Date().toISOString().slice(0, 10),
          title: { en: "Field added", hi: "खेत जोड़ा", or: "କ୍ଷେତ୍ର ଯୋଡା", te: "పొలం జోడించబడింది" },
          detail: {
            en: `${input.areaAcres} acres · ${input.boundary.length} boundary points`,
            hi: `${input.areaAcres} एकड़ · ${input.boundary.length} सीमा बिंदु`,
            or: `${input.areaAcres} ଏକର · ${input.boundary.length} ସୀମା ବିନ୍ଦୁ`,
            te: `${input.areaAcres} ఎకరాలు · ${input.boundary.length} సరిహద్దు బిందువులు`,
          },
        },
      ],
    };
    setFields((prev) => [...prev, newField]);
    return newField;
  }, []);

  const getField = useCallback((id: string) => fields.find((f) => f.id === id), [fields]);

  return (
    <FieldsStoreContext.Provider value={{ fields, addField, getField }}>
      {children}
    </FieldsStoreContext.Provider>
  );
}

export function useFieldsStore() {
  const ctx = useContext(FieldsStoreContext);
  if (!ctx) throw new Error("useFieldsStore must be used within FieldsStoreProvider");
  return ctx;
}

/**
 * Calculate the area of a polygon (boundary) in acres using the shoelace formula
 * adapted for geographic coordinates.
 */
export function calculateAreaAcres(boundary: FieldBoundary[]): number {
  if (boundary.length < 3) return 0;
  const R = 6371000; // Earth's radius in meters
  let total = 0;
  for (let i = 0; i < boundary.length; i++) {
    const p1 = boundary[i];
    const p2 = boundary[(i + 1) % boundary.length];
    const lat1 = (p1.lat * Math.PI) / 180;
    const lat2 = (p2.lat * Math.PI) / 180;
    const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
    total += dLng * (2 + Math.sin(lat1) + Math.sin(lat2));
  }
  total = Math.abs((total * R * R) / 2);
  const sqMeters = total;
  const acres = sqMeters * 0.000247105; // 1 sq meter = 0.000247105 acres
  return Math.round(acres * 10) / 10; // round to 1 decimal
}

/** Calculate the centroid of a polygon — used as the field center */
export function calculateCentroid(boundary: FieldBoundary[]): { lat: number; lng: number } {
  if (boundary.length === 0) return { lat: 0, lng: 0 };
  let lat = 0, lng = 0;
  for (const p of boundary) {
    lat += p.lat;
    lng += p.lng;
  }
  return { lat: lat / boundary.length, lng: lng / boundary.length };
}
