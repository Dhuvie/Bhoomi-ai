"use client";

import React from "react";
import { AppShell } from "@/components/bhoomi/AppShell";
import { SeedRitual } from "@/components/bhoomi/SeedRitual";
import { useApp } from "@/contexts/AppContext";
import { DashboardScreen } from "@/components/bhoomi/screens/DashboardScreen";
import { FieldsScreen } from "@/components/bhoomi/screens/FieldsScreen";
import { DiagnoseScreen } from "@/components/bhoomi/screens/DiagnoseScreen";
import { InsightsScreen } from "@/components/bhoomi/screens/InsightsScreen";
import { MarketScreen } from "@/components/bhoomi/screens/MarketScreen";

export default function Home() {
  const { screen } = useApp();

  return (
    <SeedRitual>
      <AppShell>
        {screen === "dashboard" && <DashboardScreen />}
        {screen === "fields" && <FieldsScreen />}
        {screen === "diagnose" && <DiagnoseScreen />}
        {screen === "insights" && <InsightsScreen />}
        {screen === "market" && <MarketScreen />}
      </AppShell>
    </SeedRitual>
  );
}
