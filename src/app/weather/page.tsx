import { WeatherPage } from '@/components/agrivision/WeatherPage';
import { Suspense } from 'react';

export default function Weather() {
  return (
    <Suspense>
      <WeatherPage />
    </Suspense>
  );
}
