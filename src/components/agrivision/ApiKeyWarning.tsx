// src/components/agrivision/ApiKeyWarning.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import Link from "next/link";

interface ApiKeyWarningProps {
    serviceName: string;
    apiKeyName: string;
    instructionsUrl: string;
}

export function ApiKeyWarning({ serviceName, apiKeyName, instructionsUrl }: ApiKeyWarningProps) {
  return (
    <Card className="w-full">
        <CardHeader>
            <CardTitle>Configuration Needed: {serviceName}</CardTitle>
            <CardDescription>
                The <strong>{apiKeyName}</strong> environment variable is missing.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Action Required!</AlertTitle>
                <AlertDescription>
                    To use this feature, you must get an API key from Google Cloud and add it to your <code>.env.local</code> file.
                </AlertDescription>
            </Alert>

            <div className="text-sm space-y-2 text-muted-foreground p-4 border rounded-lg">
                <p>
                    Follow the instructions in the{' '}
                    <Link href={instructionsUrl} className="underline text-primary" target="_blank" rel="noopener noreferrer">
                        {serviceName} Setup Guide
                    </Link>{' '}
                    to create a project, enable the API, and get your key.
                </p>
                <p>
                    Once you have your key, create a file named <code>.env.local</code> in the root of this project and add the following line:
                </p>
                <pre className="p-2 bg-muted rounded-md text-xs">
                    <code>{apiKeyName}=YOUR_API_KEY_HERE</code>
                </pre>
                 <p className="pt-2">After adding the key, you must restart your local development server for the change to take effect.</p>
            </div>
        </CardContent>
    </Card>
  );
}
