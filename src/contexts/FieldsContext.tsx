'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Field {
  id: string;
  name: string;
  location: string;
  crop: string;
  size: number;
  coordinates: [number, number][];
  color: string;
  createdAt: string;
}

interface FieldsContextType {
  fields: Field[];
  addField: (field: Field) => void;
  updateField: (id: string, updates: Partial<Field>) => void;
  deleteField: (id: string) => void;
  getFieldById: (id: string) => Field | undefined;
}

const FieldsContext = createContext<FieldsContextType | undefined>(undefined);

export function FieldsProvider({ children }: { children: ReactNode }) {
  const [fields, setFields] = useState<Field[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load fields from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFields = localStorage.getItem('fields');
      if (savedFields) {
        try {
          setFields(JSON.parse(savedFields));
        } catch (error) {
          console.error('Error loading fields:', error);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Save fields to localStorage whenever they change
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('fields', JSON.stringify(fields));
    }
  }, [fields, isLoaded]);

  const addField = (field: Field) => {
    setFields(prev => [...prev, field]);
  };

  const updateField = (id: string, updates: Partial<Field>) => {
    setFields(prev => prev.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const deleteField = (id: string) => {
    setFields(prev => prev.filter(field => field.id !== id));
  };

  const getFieldById = (id: string) => {
    return fields.find(field => field.id === id);
  };

  return (
    <FieldsContext.Provider value={{ fields, addField, updateField, deleteField, getFieldById }}>
      {children}
    </FieldsContext.Provider>
  );
}

export function useFields() {
  const context = useContext(FieldsContext);
  if (context === undefined) {
    throw new Error('useFields must be used within a FieldsProvider');
  }
  return context;
}
