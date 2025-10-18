import { SoilAnalysisPage } from '@/components/agrivision/SoilAnalysisPage';
import { Suspense } from 'react';

export default function SoilAnalysis() {
  return (
    <Suspense>
      <SoilAnalysisPage />
    </Suspense>
  );
}
