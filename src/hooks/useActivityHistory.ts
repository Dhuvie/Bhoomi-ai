// src/hooks/useActivityHistory.ts
'use client';
import { useState, useEffect, useCallback } from 'react';

export type Activity = {
  id: string;
  type: 'Quick Analysis' | 'Detailed Analysis' | 'Pest/Disease Diagnosis';
  description: string;
  timestamp: string;
};

const MAX_HISTORY_ITEMS = 5;
const STORAGE_KEY = 'agrivision-activity-history';

export function useActivityHistory() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedActivities = localStorage.getItem(STORAGE_KEY);
      if (savedActivities) {
        setActivities(JSON.parse(savedActivities));
      }
    } catch (e) {
      console.error("Could not load activity history from localStorage", e);
    } finally {
        setIsLoaded(true);
    }
  }, []);
  
  // This effect ensures we are using an up-to-date state when the component re-renders
  useEffect(() => {
    if (isLoaded) {
        try {
            const savedActivities = localStorage.getItem(STORAGE_KEY);
            if (savedActivities) {
                setActivities(JSON.parse(savedActivities));
            }
        } catch (e) {
            console.error("Could not load activity history from localStorage", e);
        }
    }
  }, [isLoaded]);


  const addActivity = useCallback((newActivityData: Omit<Activity, 'id' | 'timestamp'>) => {
    try {
        const newActivity: Activity = {
            ...newActivityData,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
        };

      setActivities(prevActivities => {
        const updatedActivities = [newActivity, ...prevActivities].slice(0, MAX_HISTORY_ITEMS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedActivities));
        return updatedActivities;
      });

    } catch (e) {
      console.error("Could not save activity to localStorage", e);
    }
  }, []);

  return { activities, addActivity, isLoaded };
}

    