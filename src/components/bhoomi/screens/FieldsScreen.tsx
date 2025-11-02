"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useApp } from "@/contexts/AppContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useSync } from "@/contexts/SyncContext";
import { Field, FieldBoundary, cropLabels } from "@/lib/mock-data";
import { FieldStoryTimeline } from "../FieldStoryTimeline";
import { SyncStatusIndicator } from "../SyncStatusIndicator";
import {
  FieldIcon, PlusIcon, TrashIcon, MapPinIcon, ChevronRightIcon, CheckIcon, XIcon,
} from "../icons/icons";
import { EmptyState } from "../EmptyState";
import { SaveFieldDialog } from "../SaveFieldDialog";
import { useFieldsStore } from "@/contexts/FieldsStoreContext";
import { cn } from "@/lib/utils";

// Lazy-load Leaflet only on client (it touches window on import)
let L: typeof import("leaflet") | null = null;
async function loadLeaflet() {
  if (!L) {
    L = (await import("leaflet")) as typeof import("leaflet");
  }
  return L;
}

export function FieldsScreen() {
  const { selectedFieldId, setSelectedFieldId } = useApp();
  const { fields, getField } = useFieldsStore();

  if (selectedFieldId) {
    const f = getField(selectedFieldId);
    if (f) return <FieldDetailView field={f} onBack={() => setSelectedFieldId(null)} />;
  }

  return <FieldsListView onOpenField={(id) => setSelectedFieldId(id)} />;
}

function FieldsListView({ onOpenField }: { onOpenField: (id: string) => void }) {
  const { locale, t } = useLanguage();
  const { vibrate } = useSettings();
  const { fields } = useFieldsStore();
  const [drawing, setDrawing] = useState(false);
  const [drawnPoints, setDrawnPoints] = useState<FieldBoundary[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    let cancelled = false;
    loadLeaflet().then((leaflet) => {
      if (cancelled || !mapContainerRef.current || mapRef.current) return;
      const map = leaflet.map(mapContainerRef.current, {
        center: [19.0721, 82.0489],
        zoom: 14,
        zoomControl: true,
        attributionControl: true,
      });
      leaflet.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 19, attribution: "© Esri World Imagery" }
      ).addTo(map);

      // Plot each field
      fields.forEach((f) => {
        const polygon = leaflet.polygon(
          f.boundary.map((b) => [b.lat, b.lng]),
          { color: "#468C40", weight: 2, fillColor: "#468C40", fillOpacity: 0.15 }
        ).addTo(map);
        polygon.bindTooltip(`${f.name} · ${cropLabels[f.crop][locale]}`, {
          permanent: false, direction: "top", className: "field-tooltip",
        });
        polygon.on("click", () => onOpenField(f.id));

        const marker = leaflet.marker([f.center.lat, f.center.lng], {
          icon: leaflet.divIcon({
            className: "field-marker",
            html: `<div style="background:${f.healthScore >= 75 ? "#468C40" : f.healthScore >= 55 ? "#E0982A" : "#C7402D"};color:white;border:2px solid white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:11px;font-family:var(--font-heading-en);box-shadow:0 2px 8px rgba(0,0,0,0.3);">${f.healthScore}</div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          }),
        }).addTo(map);
        marker.on("click", () => onOpenField(f.id));
      });

      mapRef.current = map;
      setMapReady(true);

      // Critical: invalidateSize so Leaflet renders correctly inside flex/hidden containers
      setTimeout(() => map.invalidateSize(), 100);
    });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [locale, onOpenField]);

  // Invalidate size when drawing mode toggles (layout shifts)
  useEffect(() => {
    if (mapReady && mapRef.current) {
      setTimeout(() => mapRef.current.invalidateSize(), 50);
    }
  }, [drawing, mapReady]);

  // Boundary drawing — single click adds a point
  useEffect(() => {
    if (!mapReady || !mapRef.current || !L) return;
    const map = mapRef.current;

    function onClick(e: any) {
      setDrawnPoints((prev) => [...prev, { lat: e.latlng.lat, lng: e.latlng.lng }]);
    }

    if (drawing) {
      map.on("click", onClick);
      map.getContainer().style.cursor = "crosshair";
      // Disable double-click zoom so it doesn't interfere
      map.doubleClickZoom.disable();
    }

    return () => {
      map.off("click", onClick);
      map.getContainer().style.cursor = "";
      map.doubleClickZoom.enable();
    };
  }, [drawing, mapReady]);

  // Render drawn points + polygon preview
  useEffect(() => {
    if (!mapReady || !mapRef.current || !L) return;
    const map = mapRef.current;
    const leaflet = L!;

    // Clear old draw layers
    map.eachLayer((layer: any) => {
      if (layer._bhoomi_draw) {
        map.removeLayer(layer);
      }
    });

    if (drawnPoints.length === 0) return;

    const latlngs = drawnPoints.map((p) => [p.lat, p.lng]) as [number, number][];
    if (drawnPoints.length >= 2) {
      const poly = (drawnPoints.length >= 3
        ? leaflet.polygon(latlngs, { color: "#E0982A", weight: 2.5, fillColor: "#E0982A", fillOpacity: 0.2, dashArray: "5,4" })
        : leaflet.polyline(latlngs, { color: "#E0982A", weight: 2.5, dashArray: "5,4" })) as any;
      poly._bhoomi_draw = true;
      poly.addTo(map);
    }

    // Vertex markers
    drawnPoints.forEach((p, i) => {
      const isFirst = i === 0;
      const m = leaflet.marker([p.lat, p.lng], {
        icon: leaflet.divIcon({
          className: "",
          html: `<div style="width:18px;height:18px;background:${isFirst ? "#468C40" : "#E0982A"};border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:white;font-family:var(--font-heading-en);">${i + 1}</div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        }),
        draggable: true,
      }) as any;
      m._bhoomi_draw = true;
      m.on("dragend", (e: any) => {
        const newPos = e.target.getLatLng();
        setDrawnPoints((prev) => {
          const next = [...prev];
          next[i] = { lat: newPos.lat, lng: newPos.lng };
          return next;
        });
      });
      m.addTo(map);
    });
  }, [drawnPoints, mapReady]);

  const handleClear = () => { vibrate(8); setDrawnPoints([]); };
  const handleUndo = () => { vibrate(8); setDrawnPoints((prev) => prev.slice(0, -1)); };
  const handleSaveBoundary = () => {
    if (drawnPoints.length < 3) return;
    vibrate([10, 30, 10]);
    setShowSaveDialog(true);
  };
  const handleSaveComplete = () => {
    setShowSaveDialog(false);
    setDrawnPoints([]);
    setDrawing(false);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 3000);
  };
  const handleCancelDrawing = () => {
    setDrawnPoints([]);
    setDrawing(false);
  };

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="seed-label text-muted-foreground">{t("fields.title")}</p>
          <h1 className="font-heading-en text-2xl md:text-3xl font-bold mt-1 tracking-tight" style={{ fontFamily: locale === "en" ? "var(--font-heading-en)" : "var(--font-heading-in)" }}>
            {locale === "en" ? "Your land" : locale === "hi" ? "आपकी ज़मीन" : locale === "or" ? "ଆପଣଙ୍କ ଜମି" : "మీ భూమి"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{fields.length} {locale === "en" ? "fields tracked" : locale === "hi" ? "खेत ट्रैक" : locale === "or" ? "କ୍ଷେତ୍ର ଟ୍ରାକ୍" : "పొలాలు"}</p>
        </div>
        {!drawing && (
          <button
            type="button"
            onClick={() => { vibrate(8); setDrawing(true); }}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium tap-feedback min-h-[40px]"
            style={{ background: "var(--crop-500)", color: "#FFFFFF" }}
          >
            <PlusIcon size={16} /> {t("fields.addField")}
          </button>
        )}
      </header>

      {/* Map — responsive height that fits viewport, no clipping */}
      <div className="relative rounded-lg overflow-hidden border border-border shadow-[var(--shadow-sm)]">
        <div
          ref={mapContainerRef}
          className="w-full h-[50vh] min-h-[280px] max-h-[520px]"
          role="application"
          aria-label="Field map"
        />
        {!mapReady && (
          <div className="absolute inset-0 bg-muted">
            <div className="absolute inset-0 topo-bg opacity-40" />
            <div className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full shimmer" style={{ animationDelay: "0.1s" }} />
            <div className="absolute top-1/3 right-1/3 w-8 h-8 rounded-full shimmer" style={{ animationDelay: "0.3s" }} />
            <div className="absolute bottom-1/4 left-1/3 w-8 h-8 rounded-full shimmer" style={{ animationDelay: "0.5s" }} />
          </div>
        )}

        {/* Drawing hint — top center, compact, doesn't cover zoom controls */}
        {drawing && !showSaveDialog && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 glass-panel rounded-full px-3 py-1.5 z-[1000] flex items-center gap-2 max-w-[90%]">
            <span className="w-2 h-2 rounded-full bg-[var(--amber-500)] animate-pulse" />
            <span className="text-xs font-medium text-white whitespace-nowrap">
              {t("fields.boundaryHint")}
            </span>
            <span className="text-xs tabular-nums text-white/80 border-l border-white/20 pl-2">
              {drawnPoints.length}
            </span>
          </div>
        )}

        {/* Map legend — bottom left, only when not drawing */}
        {mapReady && !drawing && (
          <div className="absolute bottom-2 left-2 glass-panel rounded-md p-2.5 z-[1000] hidden md:block">
            <p className="seed-label text-muted-foreground mb-1.5">{locale === "en" ? "Legend" : locale === "hi" ? "लीजेंड" : locale === "or" ? "ଲିଜେଣ୍ଡ୍" : "లెజెండ్"}</p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--crop-500)" }} />
                <span className="text-white">{locale === "en" ? "Healthy (75+)" : locale === "hi" ? "स्वस्थ (75+)" : locale === "or" ? "ସ୍ୱସ୍ଥ (୭୫+)" : "ఆరోగ్యం (75+)"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--amber-500)" }} />
                <span className="text-white">{locale === "en" ? "Watch (55-74)" : locale === "hi" ? "ध्यान (55-74)" : locale === "or" ? "ଧ୍ୟାନ (୫୫-୭୪)" : "గమనిక (55-74)"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--red-500)" }} />
                <span className="text-white">{locale === "en" ? "At risk (<55)" : locale === "hi" ? "जोखिम (<55)" : locale === "or" ? "ସଙ୍କଟ (<୫୫)" : "ప్రమాదం (<55)"}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Drawing toolbar — sticky bottom bar when drawing, always visible */}
      {drawing && !showSaveDialog && (
        <div className="sticky bottom-20 md:bottom-4 z-20">
          <div className="rounded-lg border border-border bg-card p-3 shadow-[var(--shadow-lg)] flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleUndo}
              disabled={drawnPoints.length === 0}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium tap-feedback disabled:opacity-40 min-h-[40px]"
            >
              <ChevronRightIcon size={16} className="rotate-180" />
              {locale === "en" ? "Undo" : locale === "hi" ? "पूर्ववत्" : locale === "or" ? "ପୂର୍ବବତ୍" : "చెరుకు"}
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={drawnPoints.length === 0}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium tap-feedback disabled:opacity-40 min-h-[40px]"
            >
              <TrashIcon size={16} /> {t("fields.clearBoundary")}
            </button>
            <div className="flex-1" />
            <button
              type="button"
              onClick={handleCancelDrawing}
              className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-border bg-background tap-feedback"
              aria-label={t("common.cancel")}
            >
              <XIcon size={16} />
            </button>
            <button
              type="button"
              onClick={handleSaveBoundary}
              disabled={drawnPoints.length < 3}
              className="inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium tap-feedback disabled:opacity-40 min-h-[40px]"
              style={{ background: "var(--crop-500)", color: "#FFFFFF" }}
            >
              <CheckIcon size={16} /> {t("fields.saveBoundary")}
            </button>
          </div>
        </div>
      )}

      {/* Field list */}
      <section aria-label="Field list">
        <h2 className="font-heading-en text-base md:text-lg font-bold mb-3">
          {locale === "en" ? "All fields" : locale === "hi" ? "सभी खेत" : locale === "or" ? "ସମସ୍ତ କ୍ଷେତ୍ର" : "అన్ని పొలాలు"}
        </h2>
        {fields.length === 0 ? (
          <EmptyState
            type="no-fields"
            title={locale === "en" ? "No fields yet" : locale === "hi" ? "अभी कोई खेत नहीं" : locale === "or" ? "ଏବେ କୌଣସି କ୍ଷେତ୍ର ନାହିଁ" : "ఇంకా పొలాలు లేవు"}
            description={locale === "en"
              ? "Tap 'Add field' and draw the boundary on the map. Bhoomi tracks health, moisture, and growth from there."
              : locale === "hi"
              ? "'नया खेत' टैप करें और नक्शे पर सीमा बनाएं। भूमि वहाँ से स्वास्थ्य, नमी और वृद्धि ट्रैक करती है।"
              : locale === "or"
              ? "'ନୂଆ କ୍ଷେତ୍ର' ଟ୍ୟାପ୍ କରନ୍ତୁ ଓ ନକ୍‌ସାରେ ସୀମା ଆଙ୍କନ୍ତୁ।"
              : "'కొత్త పొలం' నొక్కండి మరియు మ్యాప్‌పై సరిహద్దు గీయండి."}
            actionLabel={t("fields.addField")}
            onAction={() => setDrawing(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fields.map((f) => (
              <FieldListItem key={f.id} field={f} onOpen={() => onOpenField(f.id)} />
            ))}
          </div>
        )}
      </section>

      {/* Save field dialog */}
      {showSaveDialog && (
        <SaveFieldDialog
          boundary={drawnPoints}
          onSave={handleSaveComplete}
          onCancel={() => setShowSaveDialog(false)}
        />
      )}

      {/* Success toast */}
      {justSaved && (
        <div
          className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-[150] glass-panel rounded-full px-4 py-2.5 flex items-center gap-2 morph-in"
          style={{ background: "var(--crop-500)" }}
          role="status"
        >
          <CheckIcon size={16} className="text-white" />
          <span className="text-sm font-medium text-white">
            {locale === "en" ? "Field saved" : locale === "hi" ? "खेत सहेजा" : locale === "or" ? "କ୍ଷେତ୍ର ସାଇତାଗଲା" : "పొలం సేవ్ అయింది"}
          </span>
        </div>
      )}
    </div>
  );
}

function FieldListItem({ field, onOpen }: { field: Field; onOpen: () => void }) {
  const { locale, t } = useLanguage();
  const { vibrate } = useSettings();
  const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null);
  const healthColor = field.healthScore >= 75 ? "var(--crop-500)" : field.healthScore >= 55 ? "var(--amber-500)" : "var(--red-500)";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipple({ x, y, key: Date.now() });
    vibrate(12);
    setTimeout(() => onOpen(), 180);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-left rounded-lg border border-border bg-card p-4 shadow-[var(--shadow-sm)] tap-feedback card-hover-lift flex items-center gap-3 min-h-[88px] relative overflow-hidden"
    >
      {ripple && (
        <span
          key={ripple.key}
          className="absolute pointer-events-none rounded-full ripple-expand"
          style={{ left: ripple.x - 12, top: ripple.y - 12, width: 24, height: 24, background: `color-mix(in srgb, ${healthColor} 30%, transparent)` }}
          aria-hidden="true"
        />
      )}
      <div className="flex items-center justify-center w-12 h-12 rounded-md flex-shrink-0" style={{ background: `color-mix(in srgb, ${healthColor} 12%, var(--card))`, color: healthColor }} aria-hidden="true">
        <FieldIcon size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{field.name}</p>
        <p className="text-xs text-muted-foreground">
          {cropLabels[field.crop][locale]} · {field.areaAcres} {locale === "en" ? "ac" : locale === "hi" ? "एकड़" : locale === "or" ? "ଏକର" : "ఎకరా"}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex gap-0.5 h-1.5 flex-1 max-w-[80px]" role="meter" aria-valuenow={field.healthScore} aria-valuemin={0} aria-valuemax={100}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex-1 rounded-sm" style={{ background: i < Math.round(field.healthScore / 10) ? healthColor : "color-mix(in srgb, var(--soil-300) 40%, transparent)" }} />
            ))}
          </div>
          <span className="text-xs tabular-nums" style={{ color: healthColor }}>{field.healthScore}</span>
        </div>
      </div>
      <ChevronRightIcon size={18} className="text-muted-foreground flex-shrink-0" />
    </button>
  );
}

function FieldDetailView({ field, onBack }: { field: Field; onBack: () => void }) {
  const { locale, t } = useLanguage();
  const healthColor = field.healthScore >= 75 ? "var(--crop-500)" : field.healthScore >= 55 ? "var(--amber-500)" : "var(--red-500)";

  return (
    <div className="space-y-4 morph-in">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground tap-feedback">
        <ChevronRightIcon size={14} className="rotate-180" />
        {locale === "en" ? "Back to fields" : locale === "hi" ? "खेत पर वापस" : locale === "or" ? "କ୍ଷେତ୍ରକୁ ଫେରନ୍ତୁ" : "పొలాలకు తిరిగి"}
      </button>

      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MapPinIcon size={14} className="text-muted-foreground" />
            <span className="seed-label text-muted-foreground tabular-nums">
              {field.center.lat.toFixed(4)}°N, {field.center.lng.toFixed(4)}°E
            </span>
          </div>
          <h1 className="font-heading-en text-2xl md:text-3xl font-bold tracking-tight" style={{ fontFamily: locale === "en" ? "var(--font-heading-en)" : "var(--font-heading-in)" }}>
            {field.name}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {cropLabels[field.crop][locale]} · {field.areaAcres} {locale === "en" ? "acres" : locale === "hi" ? "एकड़" : locale === "or" ? "ଏକର" : "ఎకరాలు"}
          </p>
        </div>
        <SyncStatusIndicator state="confirmed" label={`${t("fields.lastUpdated")} ${new Date(field.lastUpdated).toLocaleDateString(locale === "en" ? "en-US" : locale, { day: "numeric", month: "short" })}`} />
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <DetailStat label={t("fields.healthPulse")} value={field.healthScore} unit="/100" color={healthColor} />
        <DetailStat label="NDVI" value={field.ndvi.toFixed(2)} color={healthColor} />
        <DetailStat label={t("insights.soil.moisture")} value={field.moisture} unit="%" color="var(--sky-600)" />
        <DetailStat label={locale === "en" ? "Days" : locale === "hi" ? "दिन" : locale === "or" ? "ଦିନ" : "రోజులు"} value={field.daysSincePlanting} color="var(--soil-600)" />
      </div>

      <FieldMiniMap field={field} />

      <section aria-labelledby="story-heading">
        <h2 id="story-heading" className="font-heading-en text-base md:text-lg font-bold mb-3">
          {t("fields.story")}
        </h2>
        <FieldStoryTimeline field={field} />
      </section>
    </div>
  );
}

function DetailStat({ label, value, unit, color }: { label: string; value: string | number; unit?: string; color: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-[var(--shadow-sm)] min-h-[88px] flex flex-col justify-between">
      <span className="seed-label text-muted-foreground">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="instrument-num text-2xl tabular-nums" style={{ color }}>{value}</span>
        {unit && <span className="text-xs text-muted-foreground tabular-nums">{unit}</span>}
      </div>
    </div>
  );
}

function FieldMiniMap({ field }: { field: Field }) {
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let map: any = null;
    let cancelled = false;
    loadLeaflet().then((leaflet) => {
      if (cancelled || !ref.current) return;
      map = leaflet.map(ref.current, {
        center: [field.center.lat, field.center.lng],
        zoom: 16,
        zoomControl: true,
        attributionControl: true,
        scrollWheelZoom: false,
      });
      leaflet.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 19, attribution: "© Esri World Imagery" }
      ).addTo(map);

      leaflet.polygon(
        field.boundary.map((b) => [b.lat, b.lng]),
        { color: "#468C40", weight: 2, fillColor: "#468C40", fillOpacity: 0.25 }
      ).addTo(map);

      setLoaded(true);
      setTimeout(() => map.invalidateSize(), 100);
    });
    return () => {
      cancelled = true;
      if (map) map.remove();
    };
  }, [field.id]);

  return (
    <div className="relative rounded-lg overflow-hidden border border-border shadow-[var(--shadow-sm)]">
      <div ref={ref} className="w-full h-[260px] md:h-[340px]" role="img" aria-label={`Satellite view of ${field.name}`} />
      {!loaded && (
        <div className="absolute inset-0 bg-[var(--soil-700)]">
          <div className="absolute inset-0 topo-bg opacity-20" />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-24 rounded shimmer"
            style={{
              clipPath: "polygon(20% 0%, 100% 25%, 80% 100%, 0% 75%)",
              background: "color-mix(in srgb, var(--crop-500) 25%, var(--soil-700))",
              animation: "shimmer-x 1.4s ease-in-out infinite",
            }}
          />
        </div>
      )}
    </div>
  );
}
