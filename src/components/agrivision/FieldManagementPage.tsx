'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { MapPin, Trash2, Edit2, Save, X, Plus, Map as MapIcon, BarChart3 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Badge } from '../ui/badge';
import dynamic from 'next/dynamic';
import { PageHeader } from './PageHeader';
import { useFields, type Field } from '@/contexts/FieldsContext';
import { useLanguage } from '@/contexts/LanguageContext';

// Dynamically import map component to avoid SSR issues
const FieldMap = dynamic(() => import('./FieldMap'), { ssr: false });

export function FieldManagementPage() {
  const { fields, addField, updateField, deleteField } = useFields();
  const { translations: t } = useLanguage();
  const [isDrawing, setIsDrawing] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [newFieldData, setNewFieldData] = useState({
    name: '',
    location: '',
    crop: '',
  });
  const [drawnCoordinates, setDrawnCoordinates] = useState<[number, number][]>([]);
  const [calculatedArea, setCalculatedArea] = useState<number>(0);

  // Fields are now managed by global context - no local state needed

  const generateColor = () => {
    const colors = [
      '#10b981', '#3b82f6', '#f59e0b', '#ef4444', 
      '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleStartDrawing = () => {
    setIsDrawing(true);
    setDrawnCoordinates([]);
    setCalculatedArea(0);
    setNewFieldData({ name: '', location: '', crop: '' });
  };

  const handleCancelDrawing = () => {
    setIsDrawing(false);
    setDrawnCoordinates([]);
    setCalculatedArea(0);
    setNewFieldData({ name: '', location: '', crop: '' });
  };

  const handleSaveField = () => {
    if (!newFieldData.name || drawnCoordinates.length < 3) {
      alert('Please provide a field name and draw at least 3 points on the map');
      return;
    }

    const newField: Field = {
      id: Date.now().toString(),
      name: newFieldData.name,
      location: newFieldData.location || 'Not specified',
      crop: newFieldData.crop || 'Not specified',
      size: calculatedArea,
      coordinates: drawnCoordinates,
      color: generateColor(),
      createdAt: new Date().toISOString(),
    };

    addField(newField);
    handleCancelDrawing();
  };

  const handleDeleteField = (id: string) => {
    deleteField(id);
    if (selectedField?.id === id) {
      setSelectedField(null);
    }
  };

  const handleEditField = (field: Field) => {
    setEditingField(field.id);
    setNewFieldData({
      name: field.name,
      location: field.location,
      crop: field.crop,
    });
  };

  const handleUpdateField = (id: string) => {
    if (!newFieldData.name) {
      alert('Please provide a field name');
      return;
    }

    updateField(id, {
      name: newFieldData.name,
      location: newFieldData.location,
      crop: newFieldData.crop
    });
    setEditingField(null);
    setNewFieldData({ name: '', location: '', crop: '' });
  };

  const handleCoordinatesChange = (coords: [number, number][], area: number) => {
    setDrawnCoordinates(coords);
    setCalculatedArea(area);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <PageHeader
        icon={MapIcon}
        title={t.fieldManagement.title}
        description={t.fieldManagement.description}
        gradient="from-blue-400/20 via-cyan-500/10 to-transparent"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Fields List Sidebar */}
        <div className="space-y-4 order-1">
          <Card className="glass-panel shadow-lg border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                  <MapIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{t.fieldManagement.yourFields}</CardTitle>
                  <CardDescription className="text-xs">
                    {fields.length} field{fields.length !== 1 ? 's' : ''}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto">
              {fields.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="p-3 rounded-full bg-muted/50 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <MapPin className="w-8 h-8 opacity-50" />
                  </div>
                  <p className="text-sm font-medium">{t.fieldManagement.noFields}</p>
                  <p className="text-xs mt-1">{t.fieldManagement.drawField}</p>
                </div>
              ) : (
                fields.map((field) => (
                  <Card 
                    key={field.id} 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
                      selectedField?.id === field.id ? 'ring-2 ring-primary border-primary bg-primary/5' : 'hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedField(field)}
                  >
                    <CardContent className="p-3">
                      {editingField === field.id ? (
                        <div className="space-y-2">
                          <Input
                            value={newFieldData.name}
                            onChange={(e) => setNewFieldData({ ...newFieldData, name: e.target.value })}
                            placeholder={t.fieldManagement.fieldName}
                            className="h-8 text-sm"
                          />
                          <Input
                            value={newFieldData.location}
                            onChange={(e) => setNewFieldData({ ...newFieldData, location: e.target.value })}
                            placeholder={t.fieldManagement.location}
                            className="h-8 text-sm"
                          />
                          <Input
                            value={newFieldData.crop}
                            onChange={(e) => setNewFieldData({ ...newFieldData, crop: e.target.value })}
                            placeholder={t.fieldManagement.crop}
                            className="h-8 text-sm"
                          />
                          <div className="flex gap-1.5">
                            <Button 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateField(field.id);
                              }}
                              className="h-7 text-xs"
                            >
                              Save
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingField(null);
                              }}
                              className="h-7 text-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full flex-shrink-0" 
                                style={{ backgroundColor: field.color }}
                              />
                              <h3 className="font-semibold text-sm">{field.name}</h3>
                            </div>
                            <div className="flex gap-0.5">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditField(field);
                                }}
                                className="h-7 w-7 p-0"
                                title="Edit field"
                              >
                                <Edit2 className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteField(field.id);
                                }}
                                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                title="Delete field"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  localStorage.setItem('selectedFieldForAnalysis', JSON.stringify(field));
                                  window.location.href = '/analysis';
                                }}
                                className="h-7 w-7 p-0 text-primary hover:text-primary"
                                title="Send to Analysis"
                              >
                                <BarChart3 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-1 text-xs text-muted-foreground">
                            {field.location && <p>📍 {field.location}</p>}
                            {field.crop && <p>🌾 {field.crop}</p>}
                            <p className="font-medium text-primary">📏 {field.size.toFixed(2)} ha</p>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
            {fields.length > 0 && (
              <CardFooter className="pt-3 border-t">
                <div className="w-full text-center">
                  <p className="text-sm font-medium">Total Area</p>
                  <p className="text-lg font-bold text-primary">
                    {fields.reduce((sum, f) => sum + f.size, 0).toFixed(2)} ha
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(fields.reduce((sum, f) => sum + f.size, 0) * 2.471).toFixed(2)} acres
                  </p>
                </div>
              </CardFooter>
            )}
          </Card>
        </div>

        {/* Map Section */}
        <div className="order-2 space-y-4">
          <Card className="relative overflow-hidden shadow-lg border">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/5 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-green-400/5 to-transparent rounded-full blur-3xl pointer-events-none" />
            <CardHeader className="relative pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-gradient-to-br from-blue-400/20 to-cyan-600/20">
                    <MapPin className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Interactive Field Map</CardTitle>
                    <CardDescription className="text-xs">
                      {isDrawing ? 'Use tools to draw your field' : 'View and manage your fields'}
                    </CardDescription>
                  </div>
                </div>
                {!isDrawing ? (
                  <Button onClick={handleStartDrawing} className="gap-2 shadow-md" size="default">
                    <Plus className="w-4 h-4" />
                    Draw Field
                  </Button>
                ) : (
                  <Button onClick={handleCancelDrawing} variant="outline" size="default" className="gap-2">
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="relative p-0">
              <div className="h-[calc(100vh-280px)] min-h-[600px] w-full relative">
                <FieldMap
                  fields={fields}
                  isDrawing={isDrawing}
                  onCoordinatesChange={handleCoordinatesChange}
                  selectedField={selectedField}
                  onFieldSelect={setSelectedField}
                />
              </div>
              {isDrawing && calculatedArea > 0 && (
                <div className="absolute bottom-6 left-6 bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-md border-2 border-primary/30 rounded-xl p-4 shadow-2xl animate-slide-up">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-primary">{calculatedArea.toFixed(2)} ha</p>
                      <p className="text-xs text-muted-foreground">{(calculatedArea * 2.471).toFixed(2)} acres</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Drawing Form */}
          {isDrawing && drawnCoordinates.length >= 3 && (
            <Card className="shadow-lg border animate-slide-up">
              <CardHeader className="border-b bg-gradient-to-r from-card to-card/50">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-green-400/20 to-emerald-600/20">
                    <Save className="w-5 h-5 text-green-500" />
                  </div>
                  Field Details
                </CardTitle>
                <CardDescription>Enter information about this field</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="field-name">Field Name *</Label>
                    <Input
                      id="field-name"
                      placeholder="e.g., North Field"
                      value={newFieldData.name}
                      onChange={(e) => setNewFieldData({ ...newFieldData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="field-location">Location</Label>
                    <Input
                      id="field-location"
                      placeholder="e.g., Near river"
                      value={newFieldData.location}
                      onChange={(e) => setNewFieldData({ ...newFieldData, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="field-crop">Crop Type</Label>
                    <Input
                      id="field-crop"
                      placeholder="e.g., Rice, Wheat"
                      value={newFieldData.crop}
                      onChange={(e) => setNewFieldData({ ...newFieldData, crop: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Calculated Area</Label>
                    <div className="flex items-center gap-2 h-10 px-3 border rounded-md bg-muted">
                      <span className="font-medium">{calculatedArea.toFixed(2)} ha</span>
                      <span className="text-muted-foreground">({(calculatedArea * 2.471).toFixed(2)} acres)</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button onClick={handleCancelDrawing} variant="outline">
                    Cancel
                  </Button>
                  <Button onClick={handleSaveField} className="gap-2">
                    <Save className="w-4 h-4" />
                    Save Field
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
