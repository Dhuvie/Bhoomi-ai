"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useApp } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";
import { VoiceIcon, XIcon } from "./icons/icons";
import { processVoiceQuery, VoiceResponse } from "@/lib/ai";
import { useMicAmplitude, useSimulatedAmplitude } from "@/hooks/useMicAmplitude";
import { fields, weatherNow, forecast7, alerts, cropLabels } from "@/lib/mock-data";

export function VoiceAssistantTrigger() {
  const { voiceOpen, setVoiceOpen } = useApp();
  const { locale, t } = useLanguage();
  const { vibrate } = useSettings();
  const [isHolding, setIsHolding] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<VoiceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const holdTimerRef = useRef<number | null>(null);
  const pressTimerRef = useRef<number | null>(null);

  // Real mic amplitude — falls back to simulated if permission denied
  const { amplitudes: realAmplitudes, hasPermission } = useMicAmplitude(isListening);
  const simAmplitudes = useSimulatedAmplitude(isListening && hasPermission === false);
  const amplitudes = hasPermission === false ? simAmplitudes : realAmplitudes;

  // Build farm context for the voice LLM — real field/weather/alert data
  const buildFarmContext = useCallback(() => ({
    fields: fields.map((f) => ({
      name: f.name,
      crop: cropLabels[f.crop][locale] ?? f.crop,
      healthScore: f.healthScore,
      daysSincePlanting: f.daysSincePlanting,
    })),
    weather: {
      tempC: weatherNow.tempC,
      condition: weatherNow.condition,
      forecast: forecast7.map((d) => ({ date: d.date, rainfallMm: d.rainfallMm, condition: d.condition })),
    },
    alerts: alerts.map((a) => ({ severity: a.severity, type: a.type, titleEn: a.titleFallback })),
  }), [locale]);

  // Speak a response via Web Speech API
  const speak = useCallback((text: string) => {
    try {
      if ("speechSynthesis" in window) {
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = locale === "hi" ? "hi-IN" : locale === "or" ? "or-IN" : locale === "te" ? "te-IN" : "en-IN";
        utter.rate = 0.95;
        utter.pitch = 1.0;
        window.speechSynthesis.speak(utter);
      }
    } catch {
      // ignore
    }
  }, [locale]);

  const startHold = useCallback(() => {
    pressTimerRef.current = window.setTimeout(() => {
      setIsHolding(true);
      setIsListening(true);
      vibrate([10, 30, 10]);
      // Listen for 2.5s, then process with a default context-aware query
      // (Real ASR would transcribe here; for now we ask a sensible default
      // question based on the most urgent alert.)
      holdTimerRef.current = window.setTimeout(() => {
        setIsListening(false);
        setIsProcessing(true);
        vibrate(15);
        const urgentAlert = alerts.find((a) => a.severity === "high");
        const defaultQuery = urgentAlert
          ? (locale === "en" ? `What should I do about: ${urgentAlert.titleFallback}?` : urgentAlert.detail[locale])
          : (locale === "en" ? "What's the most important thing to check on my farm today?" : "आज मेरे खेत में सबसे ज़रूरी क्या है?");
        processVoiceQuery(defaultQuery, locale, buildFarmContext())
          .then((res) => {
            setResponse(res);
            speak(res.text[locale]);
          })
          .catch(() => setError(t("common.error")))
          .finally(() => setIsProcessing(false));
      }, 2500);
    }, 250); // tap-and-hold threshold
  }, [locale, t, vibrate, buildFarmContext, speak]);

  const endHold = useCallback(() => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setIsHolding(false);
    if (isListening) {
      setIsListening(false);
      // Treated as cancelled before timeout
    }
  }, [isListening]);

  useEffect(() => {
    return () => {
      if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    };
  }, []);

  // FAB button — tap-and-hold to activate. On click opens the sheet too.
  return (
    <>
      <button
        type="button"
        className={cn(
          "md:hidden fixed bottom-20 right-4 z-40 inline-flex items-center justify-center",
          "w-14 h-14 rounded-full shadow-[var(--shadow-lg)] tap-feedback",
          "transition-transform duration-200"
        )}
        style={{
          background: isHolding ? "var(--crop-700)" : "var(--crop-500)",
          color: "#FFFFFF",
          transform: isHolding ? "scale(1.1)" : "scale(1)",
          boxShadow: isListening
            ? "0 0 0 6px rgba(70,140,64,0.20), 0 0 0 14px rgba(70,140,64,0.10)"
            : "var(--shadow-lg)",
        }}
        aria-label={t("nav.voice")}
        title={t("voice.tapHold")}
        onPointerDown={(e) => {
          e.preventDefault();
          startHold();
        }}
        onPointerUp={endHold}
        onPointerLeave={endHold}
        onPointerCancel={endHold}
        onClick={() => {
          // If tap (not hold), open the sheet for typed input
          if (!isHolding && !isListening && !isProcessing) {
            vibrate(8);
            setVoiceOpen(true);
          }
        }}
      >
        {isListening ? (
          // Real mic-amplitude waveform — 7 bars, crop-green palette
          <span className="flex items-end justify-center gap-[2px] h-6 w-7" aria-hidden="true">
            {amplitudes.slice(0, 7).map((amp, i) => (
              <span
                key={i}
                className="w-[2px] bg-white rounded-full"
                style={{
                  height: `${Math.max(8, Math.min(100, amp * 100))}%`,
                  transition: "height 60ms linear",
                  opacity: 0.85 + amp * 0.15,
                }}
              />
            ))}
          </span>
        ) : isProcessing ? (
          <span className="block w-6 h-6 rounded-full border-2 border-white/40 border-t-white animate-spin" />
        ) : (
          <VoiceIcon size={24} />
        )}
        <style>{`
          @keyframes voice-wave {
            0%, 100% { transform: scaleY(0.4); }
            50% { transform: scaleY(1); }
          }
        `}</style>
      </button>

      {voiceOpen && (
        <VoiceSheet
          onClose={() => {
            setVoiceOpen(false);
            setResponse(null);
            setError(null);
          }}
          response={response}
          isProcessing={isProcessing}
          error={error}
          onSubmit={async (text) => {
            setIsProcessing(true);
            setError(null);
            try {
              const res = await processVoiceQuery(text, locale, buildFarmContext());
              setResponse(res);
              speak(res.text[locale]);
            } catch {
              setError(t("common.error"));
            } finally {
              setIsProcessing(false);
            }
          }}
        />
      )}
    </>
  );
}

interface VoiceSheetProps {
  onClose: () => void;
  response: VoiceResponse | null;
  isProcessing: boolean;
  error: string | null;
  onSubmit: (text: string) => void;
}

function VoiceSheet({ onClose, response, isProcessing, error, onSubmit }: VoiceSheetProps) {
  const { locale, t } = useLanguage();
  const [input, setInput] = useState("");
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);

  const sampleQuestions = [
    { en: "Will it rain this week?", hi: "इस सप्ताह बारिश होगी?", or: "ଏହି ସପ୍ତାହରେ ବର୍ଷା ହେବ?", te: "ఈ వారం వర్షం పడుతుందా?" },
    { en: "What's my pest risk?", hi: "मेरा कीट जोखिम क्या है?", or: "ମୋର ପୋକ ସଙ୍କଟ କଣ?", te: "నా పురుగు ప్రమాదం ఏమిటి?" },
    { en: "What's my yield forecast?", hi: "मेरा उपज पूर्वानुमान?", or: "ମୋର ଉତ୍ପାଦନ ପୂର୍ବାନୁମାନ?", te: "నా దిగుబడి సూచన?" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={t("nav.voice")}
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={sheetRef}
        className="relative w-full md:max-w-xl rounded-t-2xl md:rounded-2xl bg-card border border-border shadow-[var(--shadow-lg)] max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card">
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-full"
              style={{ background: "var(--crop-500)", color: "#FFFFFF" }}
              aria-hidden="true"
            >
              <VoiceIcon size={16} />
            </div>
            <h2 className="font-heading-en text-base font-bold">{t("nav.voice")}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 inline-flex items-center justify-center rounded-md hover:bg-muted tap-feedback"
            aria-label={t("common.close")}
          >
            <XIcon size={18} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <p className="text-sm text-muted-foreground">{t("voice.tapHold")}</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim()) onSubmit(input);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={sampleQuestions[0][locale]}
              className="flex-1 rounded-md border border-input bg-background px-3 py-2.5 text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Question"
            />
            <button
              type="submit"
              disabled={isProcessing || !input.trim()}
              className="rounded-md px-4 py-2.5 text-sm font-medium tap-feedback disabled:opacity-50 min-h-[44px]"
              style={{ background: "var(--crop-500)", color: "#FFFFFF" }}
            >
              {isProcessing ? t("voice.processing") : t("common.confirm")}
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {sampleQuestions.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setInput(q[locale]);
                  onSubmit(q[locale]);
                }}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-xs tap-feedback hover:bg-muted min-h-[36px]"
              >
                {q[locale]}
              </button>
            ))}
          </div>

          {error && (
            <div className="rounded-md border p-3 text-sm" style={{ borderColor: "var(--red-500)", color: "var(--red-600)" }}>
              {error}
            </div>
          )}

          {/* Processing — large waveform in crop-green palette */}
          {isProcessing && (
            <div className="rounded-lg border border-border bg-muted/30 p-6 flex flex-col items-center">
              <div className="flex items-end justify-center gap-1 h-12 w-full max-w-xs">
                {Array.from({ length: 24 }).map((_, i) => {
                  // Simulated amplitude while processing
                  const t = Date.now() / 200;
                  const amp = 0.3 + 0.4 * Math.sin(t + i * 0.5) + 0.2 * Math.sin(t * 2.3 + i * 0.3);
                  return (
                    <span
                      key={i}
                      className="w-1 rounded-full"
                      style={{
                        height: `${Math.max(8, Math.min(100, Math.abs(amp) * 100))}%`,
                        background: "var(--crop-500)",
                        opacity: 0.6 + Math.abs(amp) * 0.4,
                        transition: "height 80ms linear",
                      }}
                    />
                  );
                })}
              </div>
              <p className="text-sm font-medium mt-3" style={{ color: "var(--crop-600)" }}>{t("voice.processing")}</p>
            </div>
          )}

          {response && (
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <div className="seed-label text-muted-foreground mb-2">Response</div>
              <p className="text-base leading-relaxed">{response.text[locale]}</p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    try {
                      if ("speechSynthesis" in window) {
                        const utter = new SpeechSynthesisUtterance(response.text[locale]);
                        utter.lang = locale === "hi" ? "hi-IN" : locale === "or" ? "or-IN" : locale === "te" ? "te-IN" : "en-IN";
                        utter.rate = 0.95;
                        window.speechSynthesis.cancel();
                        window.speechSynthesis.speak(utter);
                      }
                    } catch {
                      // ignore
                    }
                  }}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium tap-feedback min-h-[36px]"
                >
                  <VoiceIcon size={14} />
                  Speak again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
