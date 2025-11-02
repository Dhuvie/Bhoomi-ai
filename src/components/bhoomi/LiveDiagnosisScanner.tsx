"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";
import { runLiveDiagnosisScan, resetScanCounter, BoundingBox } from "@/lib/ai";
import { CameraIcon, XIcon, CheckIcon, ReticleIcon } from "./icons/icons";
import { ErrorState } from "./EmptyState";
import { cn } from "@/lib/utils";

export interface CaptureResult {
  imageBase64: string;
  boxes: BoundingBox[];
}

interface LiveDiagnosisScannerProps {
  onCapture: (result: CaptureResult) => void;
  onCancel: () => void;
}

const LOCK_ON_THRESHOLD = 0.75;

export function LiveDiagnosisScanner({ onCapture, onCancel }: LiveDiagnosisScannerProps) {
  const { locale, t } = useLanguage();
  const { vibrate, playAlertChime, sound } = useSettings();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<boolean>(false);
  const [ready, setReady] = useState(false);
  const [boxes, setBoxes] = useState<BoundingBox[]>([]);
  const [inferenceMs, setInferenceMs] = useState<number>(0);
  const [captureFlash, setCaptureFlash] = useState(false);
  const [lockedOn, setLockedOn] = useState(false);
  const [snapKey, setSnapKey] = useState(0);
  const prevLockedRef = useRef(false);

  // Start camera
  useEffect(() => {
    let cancelled = false;
    resetScanCounter(); // reset confidence builder for each new scan session
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setReady(true);
        }
      } catch (e: any) {
        setCameraError(true);
      }
    }
    startCamera();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Live inference loop
  useEffect(() => {
    if (!ready) return;
    let active = true;
    let timer: number;

    async function tick() {
      if (!active) return;
      const video = videoRef.current;
      if (video && video.videoWidth > 0) {
        try {
          const result = await runLiveDiagnosisScan("", locale);
          if (active) {
            setBoxes(result.boxes);
            setInferenceMs(result.inferenceMs);

            // Lock-on detection — the signature moment
            const topBox = result.boxes[0];
            const isLocked = !!topBox && topBox.confidence >= LOCK_ON_THRESHOLD;
            if (isLocked && !prevLockedRef.current) {
              // Just crossed threshold — TRIGGER SNAP
              setLockedOn(true);
              setSnapKey((k) => k + 1);
              vibrate([15, 40, 30, 60]); // distinctive pattern
              if (sound) playAlertChime();
            } else if (!isLocked && prevLockedRef.current) {
              setLockedOn(false);
            }
            prevLockedRef.current = isLocked;
          }
        } catch {
          // ignore
        }
      }
      timer = window.setTimeout(tick, 180);
    }
    tick();

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [ready, locale, vibrate, playAlertChime, sound]);

  const handleCapture = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    vibrate([10, 30, 10]);
    setCaptureFlash(true);
    setTimeout(() => setCaptureFlash(false), 200);

    const w = video.videoWidth;
    const h = video.videoHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);

    const imageBase64 = canvas.toDataURL("image/jpeg", 0.85);
    onCapture({ imageBase64, boxes });
  }, [boxes, onCapture, vibrate]);

  if (cameraError) {
    return (
      <ErrorState
        type="camera-denied"
        onAction={onCancel}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "relative rounded-lg overflow-hidden border border-border bg-black",
          lockedOn && "lock-on-snap"
        )}
        style={{ aspectRatio: "4 / 3" }}
        role="region"
        aria-label={t("diag.liveScan")}
        key={snapKey}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
          aria-label="Camera feed"
        />
        <canvas ref={canvasRef} className="sr-only" aria-hidden="true" />

        {/* Scanner sweep — only when scanning, not locked */}
        {ready && !lockedOn && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="scanner-sweep absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-[color:var(--crop-300)]/40 to-transparent" />
          </div>
        )}

        {/* Viewfinder corner brackets — turn crop-green when locked */}
        {ready && (
          <div
            className={cn(
              "absolute inset-6 pointer-events-none transition-colors duration-200",
              lockedOn ? "" : ""
            )}
            aria-hidden="true"
          >
            <span
              className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2"
              style={{ borderColor: lockedOn ? "var(--crop-400)" : "rgba(255,255,255,0.8)" }}
            />
            <span
              className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2"
              style={{ borderColor: lockedOn ? "var(--crop-400)" : "rgba(255,255,255,0.8)" }}
            />
            <span
              className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2"
              style={{ borderColor: lockedOn ? "var(--crop-400)" : "rgba(255,255,255,0.8)" }}
            />
            <span
              className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2"
              style={{ borderColor: lockedOn ? "var(--crop-400)" : "rgba(255,255,255,0.8)" }}
            />
          </div>
        )}

        {/* Lock-on reticle overlay — center reticle pulses when locked */}
        {ready && lockedOn && (
          <div
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
            aria-hidden="true"
          >
            <div className="reticle-pulse" style={{ color: "var(--crop-400)" }}>
              <ReticleIcon size={56} />
            </div>
          </div>
        )}

        {/* Bounding-box overlay */}
        {ready && boxes.map((box, i) => {
          const color = box.confidence > 0.8 ? "var(--crop-400)" : box.confidence > 0.6 ? "var(--amber-400)" : "var(--red-500)";
          const isLocked = box.confidence >= LOCK_ON_THRESHOLD;
          return (
            <div
              key={i}
              className="absolute pointer-events-none transition-all duration-150"
              style={{
                left: `${box.x * 100}%`,
                top: `${box.y * 100}%`,
                width: `${box.width * 100}%`,
                height: `${box.height * 100}%`,
                border: `2px solid ${color}`,
                backgroundColor: `color-mix(in srgb, ${color} ${isLocked ? 15 : 8}%, transparent)`,
                boxShadow: isLocked ? `0 0 0 2px color-mix(in srgb, ${color} 30%, transparent), 0 0 24px 4px color-mix(in srgb, ${color} 25%, transparent)` : "none",
              }}
            >
              <span
                className="absolute -top-5 left-0 px-1.5 py-0.5 text-[10px] font-bold tabular-nums whitespace-nowrap rounded-sm"
                style={{ background: color, color: "#241E17" }}
              >
                {box.label} · {Math.round(box.confidence * 100)}%
              </span>
            </div>
          );
        })}

        {/* Capture flash */}
        {captureFlash && (
          <div className="absolute inset-0 bg-white animate-pulse" aria-hidden="true" />
        )}

        {/* Top-left status bar */}
        {ready && (
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <div className="glass-panel rounded-full px-2.5 py-1 flex items-center gap-1.5">
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  lockedOn ? "bg-[var(--crop-400)]" : "bg-[var(--red-500)] animate-pulse"
                )}
              />
              <span className="text-[11px] font-medium tabular-nums text-white">
                {lockedOn ? "LOCKED" : `${inferenceMs.toFixed(0)}ms`}
              </span>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="glass-panel rounded-full w-9 h-9 inline-flex items-center justify-center tap-feedback"
              aria-label={t("common.cancel")}
            >
              <XIcon size={18} />
            </button>
          </div>
        )}

        {/* Bottom hint — changes based on lock state */}
        {ready && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center">
            <p
              className={cn(
                "glass-panel rounded-full px-3 py-1.5 text-xs",
                lockedOn ? "text-[var(--crop-300)] font-medium" : "text-white"
              )}
            >
              {lockedOn
                ? (locale === "en" ? "Locked — tap capture" : locale === "hi" ? "लॉक हो — कैप्चर करें" : locale === "or" ? "ଲକ୍ — କ୍ୟାପ୍ଚର୍" : "లాక్ — క్యాప్చర్")
                : t("diag.pointAtLeaf")}
            </p>
          </div>
        )}

        {/* Loading state */}
        {!ready && !cameraError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-sm flex items-center gap-2">
              <CameraIcon size={20} />
              <span>{t("common.loading")}</span>
            </div>
          </div>
        )}
      </div>

      {/* Capture button — emphasis when locked */}
      {ready && (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleCapture}
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tap-feedback min-h-[52px] shadow-[var(--shadow-md)] transition-all"
            style={{
              background: lockedOn ? "var(--crop-500)" : "var(--soil-700)",
              color: "#FFFFFF",
              transform: lockedOn ? "scale(1.04)" : "scale(1)",
              boxShadow: lockedOn ? "0 0 0 4px color-mix(in srgb, var(--crop-500) 25%, transparent), var(--shadow-md)" : "var(--shadow-md)",
            }}
          >
            <span
              className="w-3 h-3 rounded-full bg-white"
              aria-hidden="true"
            />
            {t("diag.capture")}
          </button>
        </div>
      )}
    </div>
  );
}
