"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Real-time microphone amplitude hook for waveform visualization.
 * Returns an array of normalized amplitudes (0-1) updated at ~60fps.
 */
export function useMicAmplitude(active: boolean) {
  const [amplitudes, setAmplitudes] = useState<number[]>(new Array(28).fill(0));
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    if (!active) {
      // Tear down
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      analyserRef.current = null;
      setAmplitudes(new Array(28).fill(0)); // eslint-disable-line react-hooks/set-state-in-effect
      return;
    }

    let cancelled = false;
    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        setHasPermission(true);

        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        analyser.smoothingTimeConstant = 0.7;
        source.connect(analyser);
        analyserRef.current = analyser;
        const data = new Uint8Array(analyser.frequencyBinCount);
        dataArrayRef.current = data;

        const tick = () => {
          if (cancelled || !analyserRef.current || !dataArrayRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArrayRef.current as any);
          // Sample 28 bands across the spectrum, normalize 0-1
          const bands = 28;
          const step = Math.floor(dataArrayRef.current.length / bands);
          const amps: number[] = [];
          for (let i = 0; i < bands; i++) {
            const slice = dataArrayRef.current.slice(i * step, (i + 1) * step);
            const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
            // Apply a slight curve so quiet sounds still register
            const normalized = Math.pow(avg / 255, 0.7);
            amps.push(normalized);
          }
          setAmplitudes(amps);
          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      } catch (e: any) {
        if (e?.name === "NotAllowedError") {
          setHasPermission(false);
        } else {
          setHasPermission(false);
        }
      }
    }
    start();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, [active]);

  return { amplitudes, hasPermission };
}

/** Simulated amplitude fallback when mic access is denied or not available */
export function useSimulatedAmplitude(active: boolean) {
  const [amplitudes, setAmplitudes] = useState<number[]>(new Array(28).fill(0));
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (!active) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setAmplitudes(new Array(28).fill(0)); // eslint-disable-line react-hooks/set-state-in-effect
      return;
    }
    startRef.current = performance.now();
    const tick = (now: number) => {
      const t = (now - startRef.current) / 1000;
      // Pseudo-random but smooth — combine sine waves
      const amps = Array.from({ length: 28 }, (_, i) => {
        const base = 0.35 + 0.25 * Math.sin(t * 2.4 + i * 0.4) + 0.15 * Math.sin(t * 5.1 + i * 0.7);
        const noise = Math.random() * 0.18;
        return Math.max(0.05, Math.min(1, base + noise));
      });
      setAmplitudes(amps);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active]);

  return amplitudes;
}
