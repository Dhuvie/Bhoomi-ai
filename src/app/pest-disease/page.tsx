// src/app/pest-disease/page.tsx
import { PestDiseasePage } from "@/components/agrivision/PestDiseasePage";
import { Suspense } from "react";

export default function PestDisease() {
  return (
    <Suspense>
      <PestDiseasePage />
    </Suspense>
  );
}
