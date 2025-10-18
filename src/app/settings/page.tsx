// src/app/settings/page.tsx
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Suspense, useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useLanguage, languages } from '@/contexts/LanguageContext';
import { MyFields } from '@/components/agrivision/MyFields';

function SettingsComponent() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, translations: t } = useLanguage();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    const newLang = languages.find(l => l.code === langCode);
    if (newLang) {
      setLanguage(newLang);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t.settings.title}</h1>
        <p className="text-muted-foreground">{t.settings.description}</p>
      </div>

      <MyFields />

      <Card>
        <CardHeader>
          <CardTitle>{t.settings.profile.title}</CardTitle>
          <CardDescription>{t.settings.profile.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t.settings.profile.firstName}</Label>
              <Input id="firstName" defaultValue="John" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t.settings.profile.lastName}</Label>
              <Input id="lastName" defaultValue="Doe" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t.settings.profile.email}</Label>
            <Input id="email" type="email" defaultValue="john.doe@example.com" />
          </div>
          <Button>{t.settings.profile.updateButton}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.settings.preferences.title}</CardTitle>
          <CardDescription>{t.settings.preferences.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {isClient && (
              <>
                <div className="flex items-center justify-between">
                    <div>
                        <Label htmlFor="dark-mode">{t.settings.preferences.darkMode}</Label>
                        <p className="text-sm text-muted-foreground">{t.settings.preferences.darkModeDesc}</p>
                    </div>
                    <Switch 
                        id="dark-mode" 
                        checked={theme === 'dark'}
                        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                    />
                </div>
                <Separator />
              </>
            )}
            <div className="flex items-center justify-between">
                <div>
                    <Label htmlFor="language">{t.settings.preferences.language}</Label>
                    <p className="text-sm text-muted-foreground">{t.settings.preferences.languageDesc}</p>
                </div>
                <Select value={language.code} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={t.settings.preferences.selectLanguage} />
                    </SelectTrigger>
                    <SelectContent>
                        {languages.map(lang => (
                          <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
             <Separator />
             <div className="flex items-center justify-between">
                <div>
                    <Label htmlFor="notifications">{t.settings.preferences.emailNotifications}</Label>
                    <p className="text-sm text-muted-foreground">{t.settings.preferences.emailNotificationsDesc}</p>
                </div>
                <Switch id="notifications" checked/>
            </div>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>{t.settings.apiKeys.title}</CardTitle>
          <CardDescription>{t.settings.apiKeys.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-md bg-secondary">
                <div className="space-y-2 flex-1">
                    <Label htmlFor="gemini-api-key">Gemini API Key</Label>
                    <Input id="gemini-api-key" readOnly value="sk-...dgoTLOPY" />
                    <p className="text-xs text-muted-foreground">This key is used for all AI functionalities.</p>
                </div>
                <Button variant="outline">{t.settings.apiKeys.revokeButton}</Button>
            </div>
            <Button>{t.settings.apiKeys.generateButton}</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SettingsPage() {
    return (
        <Suspense>
            <SettingsComponent />
        </Suspense>
    )
}
