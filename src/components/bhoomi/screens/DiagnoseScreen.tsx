"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useSync } from "@/contexts/SyncContext";
import { LiveDiagnosisScanner, CaptureResult } from "../LiveDiagnosisScanner";
import { DiagnosisResultCard } from "../DiagnosisResultCard";
import { DiagnosisResult } from "@/lib/mock-data";
import { diagnoseCapturedLeaf } from "@/lib/ai";
import { CameraIcon, UploadIcon, XIcon, CheckIcon, SproutIcon } from "../icons/icons";
import { SyncStatusIndicator } from "../SyncStatusIndicator";
import { ErrorState } from "../EmptyState";
import { cn } from "@/lib/utils";

type Mode = "idle" | "live" | "upload" | "optimizing" | "analyzing" | "result" | "error";
type ErrorType = "offline" | "camera-denied" | "ai-timeout" | "ai-error" | "generic";

/** Generate a sample leaf image (canvas-drawn) so users can test diagnosis without camera/upload */
function generateSampleLeaf(): string {
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 450;
  const ctx = canvas.getContext("2d")!;
  // Green leaf background
  ctx.fillStyle = "#4a7c3a";
  ctx.beginPath();
  ctx.ellipse(300, 225, 200, 90, -0.2, 0, Math.PI * 2);
  ctx.fill();
  // Darker leaf veins
  ctx.strokeStyle = "#3a6c2a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(120, 240);
  ctx.lineTo(480, 210);
  ctx.stroke();
  for (let i = 0; i < 5; i++) {
    const x = 150 + i * 70;
    ctx.beginPath();
    ctx.moveTo(x, 235);
    ctx.quadraticCurveTo(x + 20, 200, x + 40, 180);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, 235);
    ctx.quadraticCurveTo(x + 20, 270, x + 40, 290);
    ctx.stroke();
  }
  // Disease spots — brown lesions (rice blast-like)
  const spots = [
    [250, 200, 18], [320, 180, 14], [380, 220, 16], [280, 260, 12], [350, 250, 20],
    [200, 230, 10], [420, 200, 11],
  ];
  spots.forEach(([x, y, r]) => {
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, "#5a3a1a");
    grad.addColorStop(0.6, "#8b6b3d");
    grad.addColorStop(1, "rgba(139,107,61,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 1.3, 0.3, 0, Math.PI * 2);
    ctx.fill();
  });
  // Highlight on leaf
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.ellipse(280, 190, 120, 30, -0.2, 0, Math.PI * 2);
  ctx.fill();
  return canvas.toDataURL("image/jpeg", 0.85);
}

export function DiagnoseScreen() {
  const { locale, t } = useLanguage();
  const { vibrate } = useSettings();
  const { register, update } = useSync();
  const [mode, setMode] = useState<Mode>("idle");
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [errorType, setErrorType] = useState<ErrorType>("generic");
  const [optimizingProgress, setOptimizingProgress] = useState(0);
  const [syncId] = useState(() => `diag-${Date.now()}`);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = useCallback(async (captured: CaptureResult) => {
    setMode("analyzing");
    register(syncId, locale === "en" ? "Diagnosis upload" : locale === "hi" ? "जांच अपलोड" : locale === "or" ? "ନିଦାନ ଅପଲୋଡ୍" : "నిర్ధారణ అప్‌లోడ్");
    update(syncId, "syncing");
    vibrate([10, 30, 10]);

    try {
      const response = await diagnoseCapturedLeaf({
        imageBase64: captured.imageBase64,
        locale,
      });
      update(syncId, "confirmed");
      setResult(response.result);
      setMode("result");
      vibrate([15, 50, 15]);
    } catch (e) {
      update(syncId, "queued");
      // Distinguish timeout vs error
      const isTimeout = e instanceof Error && /timeout/i.test(e.message);
      setErrorType(isTimeout ? "ai-timeout" : "ai-error");
      setMode("error");
    }
  }, [locale, register, syncId, update, vibrate]);

  // Compress/resize image client-side before upload — visible "optimizing photo" micro-step
  const optimizeImage = useCallback(async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          // Downscale to max 1024px on the longest side
          const MAX_SIZE = 1024;
          let { width, height } = img;
          if (width > MAX_SIZE || height > MAX_SIZE) {
            if (width > height) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            } else {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) { reject(new Error("no ctx")); return; }
          ctx.drawImage(img, 0, 0, width, height);
          // JPEG quality 0.82 — good balance for leaf detail
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };
        img.onerror = () => reject(new Error("img load"));
        img.src = reader.result as string;
      };
      reader.onerror = () => reject(new Error("file read"));
      reader.readAsDataURL(file);
    });
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    // Phase 1: optimizing photo (visible micro-step)
    setMode("optimizing");
    setOptimizingProgress(0);
    vibrate(8);

    // Animate progress bar
    const progressStart = Date.now();
    const progressDuration = 900;
    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - progressStart;
      const pct = Math.min(elapsed / progressDuration, 0.95);
      setOptimizingProgress(pct);
    }, 60);

    try {
      const base64 = await optimizeImage(file);
      setOptimizingProgress(1);
      clearInterval(progressTimer);
      // Brief pause so user sees 100%
      await new Promise((r) => setTimeout(r, 200));

      // Phase 2: analyzing
      setMode("analyzing");
      register(syncId, locale === "en" ? "Photo upload" : locale === "hi" ? "फोटो अपलोड" : locale === "or" ? "ଫଟୋ ଅପଲୋଡ୍" : "ఫోటో అప్‌లోడ్");
      update(syncId, "syncing");
      try {
        const response = await diagnoseCapturedLeaf({ imageBase64: base64, locale });
        update(syncId, "confirmed");
        setResult(response.result);
        setMode("result");
        vibrate([15, 50, 15]);
      } catch (e) {
        update(syncId, "queued");
        const isTimeout = e instanceof Error && /timeout/i.test(e.message);
        setErrorType(isTimeout ? "ai-timeout" : "ai-error");
        setMode("error");
      }
    } catch (e) {
      clearInterval(progressTimer);
      setErrorType(!navigator.onLine ? "offline" : "generic");
      setMode("error");
    }
  }, [optimizeImage, locale, register, syncId, update, vibrate]);

  const handleReset = () => {
    setMode("idle");
    setResult(null);
    setErrorType("generic");
  };

  // Sample leaf — guarantees the AI diagnosis can always be tested
  const handleSampleLeaf = useCallback(async () => {
    vibrate(8);
    const sampleBase64 = generateSampleLeaf();
    setMode("analyzing");
    register(syncId, locale === "en" ? "Sample diagnosis" : locale === "hi" ? "नमूना जांच" : locale === "or" ? "ନମୁନା ନିଦାନ" : "నమూనా నిర్ధారణ");
    update(syncId, "syncing");
    try {
      const response = await diagnoseCapturedLeaf({ imageBase64: sampleBase64, cropHint: "rice", locale });
      update(syncId, "confirmed");
      setResult(response.result);
      setMode("result");
      vibrate([15, 50, 15]);
    } catch (e) {
      update(syncId, "queued");
      const isTimeout = e instanceof Error && /timeout/i.test(e.message);
      setErrorType(isTimeout ? "ai-timeout" : "ai-error");
      setMode("error");
    }
  }, [locale, register, syncId, update, vibrate]);

  return (
    <div className="space-y-4">
      <header>
        <p className="seed-label text-muted-foreground">{t("diag.title")}</p>
        <h1 className="font-heading-en text-2xl md:text-3xl font-bold mt-1 tracking-tight" style={{ fontFamily: locale === "en" ? "var(--font-heading-en)" : "var(--font-heading-in)" }}>
          {locale === "en" ? "Scan a leaf" : locale === "hi" ? "पत्ता स्कैन करें" : locale === "or" ? "ପତ୍ର ସ୍କାନ୍" : "ఆకు స్కాన్"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{t("diag.pointAtLeaf")}</p>
      </header>

      {/* Mode selector */}
      {mode === "idle" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 max-w-3xl">
          {/* Live scan */}
          <button
            type="button"
            onClick={() => setMode("live")}
            className="text-left rounded-lg border border-border bg-card p-5 shadow-[var(--shadow-sm)] tap-feedback card-hover-lift min-h-[140px] flex flex-col justify-between"
          >
            <div
              className="flex items-center justify-center w-12 h-12 rounded-md mb-3"
              style={{ background: "color-mix(in srgb, var(--crop-500) 12%, var(--card))", color: "var(--crop-600)" }}
              aria-hidden="true"
            >
              <CameraIcon size={24} />
            </div>
            <div>
              <p className="font-semibold">{t("diag.liveScan")}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {locale === "en" ? "Point camera at leaf" : locale === "hi" ? "कैमरा पत्ते पर लगाएं" : locale === "or" ? "କ୍ୟାମେରା ପତ୍ର ଉପରେ" : "కెమెరా ఆకుపై"}
              </p>
            </div>
          </button>

          {/* Upload */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-left rounded-lg border border-border bg-card p-5 shadow-[var(--shadow-sm)] tap-feedback card-hover-lift min-h-[140px] flex flex-col justify-between"
          >
            <div
              className="flex items-center justify-center w-12 h-12 rounded-md mb-3"
              style={{ background: "color-mix(in srgb, var(--sky-500) 12%, var(--card))", color: "var(--sky-600)" }}
              aria-hidden="true"
            >
              <UploadIcon size={24} />
            </div>
            <div>
              <p className="font-semibold">{t("diag.upload")}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {locale === "en" ? "From gallery or files" : locale === "hi" ? "गैलरी से" : locale === "or" ? "ଗ୍ୟାଲେରୀରୁ" : "గ్యాలరీ నుండి"}
              </p>
            </div>
          </button>

          {/* Try sample — always works, no camera/upload needed */}
          <button
            type="button"
            onClick={handleSampleLeaf}
            className="text-left rounded-lg border-2 border-dashed border-[var(--crop-500)]/40 bg-[color:var(--crop-50)] dark:bg-[color:var(--crop-800)]/20 p-5 shadow-[var(--shadow-sm)] tap-feedback card-hover-lift min-h-[140px] flex flex-col justify-between"
          >
            <div
              className="flex items-center justify-center w-12 h-12 rounded-md mb-3"
              style={{ background: "color-mix(in srgb, var(--amber-500) 15%, var(--card))", color: "var(--amber-600)" }}
              aria-hidden="true"
            >
              <SproutIcon size={24} />
            </div>
            <div>
              <p className="font-semibold">
                {locale === "en" ? "Try sample leaf" : locale === "hi" ? "नमूना पत्ता" : locale === "or" ? "ନମୁନା ପତ୍ର" : "నమూనా ఆకు"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {locale === "en" ? "Test AI diagnosis instantly" : locale === "hi" ? "एआई जांच तुरंत" : locale === "or" ? "ଏଆଇ ନିଦାନ" : "ఏఐ నిర్ధారణ"}
              </p>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            aria-label="Upload photo"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFileUpload(f);
              e.target.value = "";
            }}
          />
        </div>
      )}

      {/* Live scanner */}
      {mode === "live" && (
        <div className="space-y-3">
          <LiveDiagnosisScanner
            onCapture={handleCapture}
            onCancel={() => setMode("idle")}
          />
        </div>
      )}

      {/* Optimizing photo — visible micro-step so slow-network users see what's happening */}
      {mode === "optimizing" && (
        <OptimizingPhotoState progress={optimizingProgress} />
      )}

      {/* Analyzing state — confidence ring reveal */}
      {mode === "analyzing" && (
        <AnalyzingState />
      )}

      {/* Result */}
      {mode === "result" && (
        <div className="space-y-4 morph-in">
          <SyncStatusIndicator state="confirmed" />
          {result ? (
            <DiagnosisResultCard result={result} onReset={handleReset} />
          ) : (
            <NoDetectionCard onReset={handleReset} />
          )}
        </div>
      )}

      {/* Error — specific copy per failure type */}
      {mode === "error" && (
        <div className="morph-in">
          <ErrorState
            type={errorType}
            onRetry={handleReset}
            onAction={errorType === "camera-denied" ? () => fileInputRef.current?.click() : handleReset}
          />
        </div>
      )}
    </div>
  );
}

function AnalyzingState() {
  const { locale, t } = useLanguage();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 1800;
    let raf: number;
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const circumference = 2 * Math.PI * 48;
  const offset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-32 h-32">
        <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90">
          {/* Background ring */}
          <circle
            cx="64" cy="64" r="48"
            fill="none"
            stroke="color-mix(in srgb, var(--soil-300) 40%, transparent)"
            strokeWidth="4"
          />
          {/* Confidence fill — clockwise */}
          <circle
            cx="64" cy="64" r="48"
            fill="none"
            stroke="var(--crop-500)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 60ms linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="instrument-num text-2xl tabular-nums" style={{ color: "var(--crop-600)" }}>
            {Math.round(progress * 100)}%
          </span>
        </div>
        {/* Scanner sweep line over the ring */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div className="scanner-sweep absolute inset-x-0 h-8 bg-gradient-to-b from-transparent via-[color:var(--crop-400)]/30 to-transparent" />
        </div>
      </div>
      <p className="mt-4 text-sm font-medium">{t("diag.analyzing")}</p>
      <p className="text-xs text-muted-foreground mt-1">bhoomi-vision-v0.4.1</p>
    </div>
  );
}

function OptimizingPhotoState({ progress }: { progress: number }) {
  const { locale } = useLanguage();
  const pct = Math.round(progress * 100);
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div
        className="relative w-32 h-32 flex items-center justify-center"
        aria-label="Optimizing photo"
        role="status"
      >
        <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90">
          <circle
            cx="64" cy="64" r="48"
            fill="none"
            stroke="color-mix(in srgb, var(--soil-300) 40%, transparent)"
            strokeWidth="4"
          />
          <circle
            cx="64" cy="64" r="48"
            fill="none"
            stroke="var(--sky-500)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 48}
            strokeDashoffset={2 * Math.PI * 48 * (1 - progress)}
            style={{ transition: "stroke-dashoffset 60ms linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="instrument-num text-2xl tabular-nums" style={{ color: "var(--sky-600)" }}>
            {pct}%
          </span>
        </div>
      </div>
      <p className="mt-4 text-sm font-medium">
        {locale === "en" ? "Optimizing photo" : locale === "hi" ? "फोटो ऑप्टिमाइज़" : locale === "or" ? "ଫଟୋ ଅପ୍ଟିମାଇଜ୍" : "ఫోటో ఆప్టిమైజ్"}
      </p>
      <p className="text-xs text-muted-foreground mt-1 max-w-xs text-center leading-relaxed">
        {locale === "en"
          ? "Shrinking the file so it uploads faster on your connection."
          : locale === "hi"
          ? "आपके कनेक्शन पर तेज़ अपलोड के लिए फ़ाइल छोटी कर रहे।"
          : locale === "or"
          ? "ଆପଣଙ୍କ ସଂଯୋଗରେ ଶୀଘ୍ର ଅପଲୋଡ୍ ପାଇଁ ଫାଇଲ୍ ସାନ କରୁଛୁ।"
          : "మీ కనెక్షన్‌లో వేగంగా అప్‌లోడ్ కోసం ఫైల్‌ను చిన్నది చేస్తున్నాము."}
      </p>
    </div>
  );
}

function NoDetectionCard({ onReset }: { onReset: () => void }) {
  const { t } = useLanguage();
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-[var(--shadow-sm)]">
      <div className="flex items-start gap-3">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0"
          style={{ background: "color-mix(in srgb, var(--crop-500) 12%, transparent)", color: "var(--crop-600)" }}
          aria-hidden="true"
        >
          <CheckIcon size={20} />
        </div>
        <div className="flex-1">
          <p className="font-semibold">{t("diag.noDetection")}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {t("common.aiEstimate")}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="mt-4 w-full rounded-md border border-border bg-background py-2.5 text-sm font-medium tap-feedback min-h-[44px]"
      >
        {t("diag.startScan")}
      </button>
    </div>
  );
}
