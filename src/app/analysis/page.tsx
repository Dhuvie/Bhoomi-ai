// src/app/analysis/page.tsx
import { AnalysisPage } from "@/components/agrivision/AnalysisPage";
import { Suspense } from "react";

export default function Analysis() {
  return (
    <Suspense>
      <AnalysisPage />
    </Suspense>
  );
}
