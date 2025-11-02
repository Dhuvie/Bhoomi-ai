"use client";

import React from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { SyncProvider } from "@/contexts/SyncContext";
import { AppContextProvider } from "@/contexts/AppContext";
import { FieldsStoreProvider } from "@/contexts/FieldsStoreContext";
import { LocationProvider } from "@/contexts/LocationContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <SettingsProvider>
        <SyncProvider>
          <LocationProvider>
            <FieldsStoreProvider>
              <AppContextProvider>{children}</AppContextProvider>
            </FieldsStoreProvider>
          </LocationProvider>
        </SyncProvider>
      </SettingsProvider>
    </LanguageProvider>
  );
}
