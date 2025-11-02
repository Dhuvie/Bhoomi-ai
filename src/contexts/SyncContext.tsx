"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type SyncState = "queued" | "syncing" | "confirmed" | "offline";

interface SyncItem {
  id: string;
  label: string;
  state: SyncState;
  createdAt: number;
  updatedAt: number;
}

interface SyncContextValue {
  items: SyncItem[];
  online: boolean;
  register: (id: string, label: string) => void;
  update: (id: string, state: SyncState) => void;
  remove: (id: string) => void;
  pendingCount: number;
  lastConfirmed: number | null;
}

const SyncContext = createContext<SyncContextValue | null>(null);

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<SyncItem[]>([]);
  const [online] = useState(true);
  const [lastConfirmed, setLastConfirmed] = useState<number | null>(null);

  const register = useCallback((id: string, label: string) => {
    setItems((prev) => {
      const now = Date.now();
      const exists = prev.find((p) => p.id === id);
      if (exists) return prev;
      return [
        ...prev,
        { id, label, state: "queued" as SyncState, createdAt: now, updatedAt: now },
      ];
    });
  }, []);

  const update = useCallback((id: string, state: SyncState) => {
    setItems((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, state, updatedAt: Date.now() } : p
      )
    );
    if (state === "confirmed") {
      setLastConfirmed(Date.now());
    }
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const pendingCount = items.filter((i) => i.state !== "confirmed").length;

  return (
    <SyncContext.Provider
      value={{
        items,
        online,
        register,
        update,
        remove,
        pendingCount,
        lastConfirmed,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const ctx = useContext(SyncContext);
  if (!ctx) throw new Error("useSync must be used within SyncProvider");
  return ctx;
}
