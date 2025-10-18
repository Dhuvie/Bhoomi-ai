import { Dashboard } from "@/components/agrivision/Dashboard";
import { Suspense } from 'react';

export default function Home() {
  return (
    <Suspense>
      <Dashboard />
    </Suspense>
  );
}
