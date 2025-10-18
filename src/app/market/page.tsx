// src/app/market/page.tsx
import { MarketPricesPage } from "@/components/agrivision/MarketPricesPage";
import { Suspense } from "react";

export default function Market() {
  return (
    <Suspense>
      <MarketPricesPage />
    </Suspense>
  );
}
