// src/components/agrivision/PestDiseasePage.tsx
'use client';
import { useState, useRef, useTransition, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Upload, Camera, BotMessageSquare, Leaf, XCircle, ShieldCheck, ShieldAlert, Sparkles, BookOpen, Sun, ListChecks, ShieldQuestion, Stethoscope, Bug } from 'lucide-react';
import { PageHeader } from './PageHeader';
import Image from 'next/image';
import { diagnosePlant } from '@/app/actions';
import type { DiagnosePlantOutput } from '@/ai/flows/diagnose-plant-flow';
import { useToast } from '@/hooks/use-toast';
import { useActivityHistory } from '@/hooks/useActivityHistory';

export function PestDiseasePage() {
  const { translations: t, language } = useLanguage();
  const [image, setImage] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<DiagnosePlantOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const { addActivity } = useActivityHistory();
  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB size limit
        toast({
          variant: 'destructive',
          title: 'Image too large',
          description: 'Please upload an image smaller than 4MB.',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setDiagnosis(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnose = () => {
    if (!image) return;
    startTransition(async () => {
      setError(null);
      setDiagnosis(null);
      const result = await diagnosePlant({ photoDataUri: image, language: language.name });
      if (result.success && result.data) {
        setDiagnosis(result.data);
        if(result.data.identification.isPlant && result.data.identification.commonName) {
            addActivity({ type: 'Pest/Disease Diagnosis', description: result.data.identification.commonName });
        }
      } else {
        setError(t.pestDisease.diagnosisError);
      }
    });
  };

  const clearState = () => {
    setImage(null);
    setDiagnosis(null);
    setError(null);
    setShowWebcam(false);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <PageHeader
        icon={Bug}
        title={t.pestDisease.title}
        description={t.pestDisease.description}
        gradient="from-red-400/20 via-orange-500/10 to-transparent"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <Card className="relative overflow-hidden glass-panel shadow-soft hover-lift">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-red-400/20 to-orange-600/20">
                  <Upload className="w-5 h-5 text-red-500" />
                </div>
                {t.pestDisease.uploadCardTitle}
              </CardTitle>
              <CardDescription>{t.pestDisease.uploadCardDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {showWebcam ? (
                <WebcamCapture onPhotoTaken={setImage} onExit={() => setShowWebcam(false)} />
              ) : (
                <div className="p-4 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center text-center min-h-[250px] space-y-4">
                  {image ? (
                    <div className="relative w-full max-w-xs">
                      <Image src={image} alt="Uploaded plant" width={400} height={300} className="rounded-md object-cover aspect-video" />
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                       <div className="flex flex-col sm:flex-row gap-2">
                         <Button onClick={() => fileInputRef.current?.click()}>
                           <Upload className="mr-2" />
                           {t.pestDisease.uploadButton}
                         </Button>
                         <Button variant="outline" onClick={() => setShowWebcam(true)}>
                           <Camera className="mr-2" />
                           {t.pestDisease.useWebcamButton}
                         </Button>
                       </div>
                       <p className="text-xs text-muted-foreground">Max file size: 4MB</p>
                    </>
                  )}
                </div>
              )}
              
              <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              {image && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={handleDiagnose} disabled={isPending} className="w-full">
                    {isPending ? <Loader2 className="mr-2 animate-spin" /> : <Sparkles className="mr-2" />}
                    {isPending ? t.pestDisease.analyzing : t.pestDisease.diagnoseButton}
                  </Button>
                   <Button variant="outline" onClick={clearState} className="w-full">
                    <XCircle className="mr-2" />
                    Clear
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        
        
        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle>{t.pestDisease.diagnosisResult}</CardTitle>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-lg font-medium">{t.pestDisease.analyzing}</p>
                <p className="text-muted-foreground text-sm">This can take up to 30 seconds...</p>
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : diagnosis ? (
              <DiagnosisDisplay diagnosis={diagnosis} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 border-dashed rounded-lg min-h-[250px] lg:min-h-full">
                <BotMessageSquare className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">{t.pestDisease.awaitingDiagnosis}</h3>
                <p className="text-muted-foreground">{t.pestDisease.awaitingDiagnosisDescription}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DetailSection({ title, icon: Icon, children }: { title: string, icon: React.ElementType, children: React.ReactNode }) {
    if (!children || (Array.isArray(children) && children.length === 0) || (typeof children === 'string' && !children.trim())) return null;
    const { language } = useLanguage();

    return (
        <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2 text-primary">
                <Icon className="w-5 h-5"/>
                <span>{title}</span>
            </h4>
            <div className={`text-sm text-muted-foreground pl-7 space-y-1 ${language.code === 'or' ? 'font-Odia' : ''}`}>
                {children}
            </div>
        </div>
    );
}

function DiagnosisDisplay({ diagnosis }: { diagnosis: DiagnosePlantOutput }) {
  const { translations: t, language } = useLanguage();

  if (!diagnosis.identification.isPlant) {
      return (
          <Alert>
              <AlertTitle>{t.pestDisease.notAPlant}</AlertTitle>
              <AlertDescription>{t.pestDisease.notAPlantDescription}</AlertDescription>
          </Alert>
      );
  }

  const isHealthy = diagnosis.diagnosis.isHealthy;

  return (
      <div className={`space-y-6 ${language.code === 'or' ? 'font-Odia' : ''}`}>
          <div className="flex items-start sm:items-center gap-4 p-4 rounded-lg bg-secondary flex-col sm:flex-row">
              <Leaf className="w-10 h-10 text-primary flex-shrink-0"/>
              <div>
                  <p className="font-bold text-xl">{diagnosis.identification.commonName}</p>
                  <p className="text-sm italic text-muted-foreground">{diagnosis.identification.latinName}</p>
              </div>
          </div>
          
           <div className={`flex items-center gap-2 p-3 rounded-md text-sm font-semibold ${isHealthy ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' : 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'}`}>
              {isHealthy ? <ShieldCheck className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
              <span>{isHealthy ? t.pestDisease.healthy : `${t.pestDisease.unhealthy}: ${diagnosis.diagnosis.disease}`}</span>
          </div>

          <div className="space-y-4">
              <DetailSection title={t.pestDisease.symptoms} icon={ListChecks}>
                  {diagnosis.diagnosis.symptoms?.map((s, i) => <p key={i}>- {s}</p>)}
              </DetailSection>

              <DetailSection title={t.pestDisease.cure} icon={Stethoscope}>
                  {diagnosis.diagnosis.cure?.map((c, i) => <p key={i}>- {c}</p>)}
              </DetailSection>
              
              <DetailSection title={t.pestDisease.precautions} icon={ShieldQuestion}>
                  {diagnosis.diagnosis.precautions?.map((p, i) => <p key={i}>- {p}</p>)}
              </DetailSection>

              <DetailSection title={t.pestDisease.plantHistory} icon={BookOpen}>
                  <p>{diagnosis.plantInfo?.history}</p>
              </DetailSection>

              <DetailSection title={t.pestDisease.idealConditions} icon={Sun}>
                  <p>{diagnosis.plantInfo?.idealConditions}</p>
              </DetailSection>
          </div>
      </div>
  );
}


function WebcamCapture({ onPhotoTaken, onExit }: { onPhotoTaken: (dataUri: string) => void; onExit: () => void; }) {
  const { translations: t } = useLanguage();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({ variant: 'destructive', title: 'Webcam not supported' });
        setHasCameraPermission(false);
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: t.pestDisease.cameraPermissionRequired,
          description: t.pestDisease.cameraPermissionDescription,
        });
      }
    };
    getCameraPermission();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [t, toast]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUri);
      }
    }
  };

  const handleUsePhoto = () => {
    if (capturedImage) {
      onPhotoTaken(capturedImage);
      onExit();
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
        {hasCameraPermission === null && <Loader2 className="w-8 h-8 animate-spin"/>}
        {hasCameraPermission === false && (
          <div className="text-center p-4">
             <Alert variant="destructive">
              <AlertTitle>{t.pestDisease.cameraPermissionRequired}</AlertTitle>
              <AlertDescription>{t.pestDisease.cameraPermissionDescription}</AlertDescription>
            </Alert>
          </div>
        )}
        {hasCameraPermission && (
           <>
            {capturedImage ? (
                <Image src={capturedImage} alt="Captured image" fill objectFit="contain" />
            ) : (
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
            )}
            <canvas ref={canvasRef} className="hidden" />
           </>
        )}
      </div>
      <div className="flex gap-2 justify-between">
        <Button variant="outline" onClick={onExit}><XCircle className="mr-2" />{t.settings.myFields.cancel}</Button>
        {capturedImage ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCapturedImage(null)}>{t.pestDisease.retakeButton}</Button>
            <Button onClick={handleUsePhoto}>{t.pestDisease.usePhotoButton}</Button>
          </div>
        ) : (
          <Button onClick={handleCapture} disabled={!hasCameraPermission}>
            <Camera className="mr-2" />
            {t.pestDisease.captureButton}
          </Button>
        )}
      </div>
    </div>
  );
}
