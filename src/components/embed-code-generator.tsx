
"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ClipboardCopy } from "lucide-react";

interface EmbedCodeGeneratorProps {
  galleryEmbedPath?: string; 
  defaultWidth?: string;
  defaultHeight?: string;
}

export function EmbedCodeGenerator({ 
  galleryEmbedPath = "/embed/gallery",
  defaultWidth = "100%",
  defaultHeight = "450px" // Adjusted for a 16:9 ratio if max-width is around 800px
}: EmbedCodeGeneratorProps) {
  const [embedCode, setEmbedCode] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);
  
  useEffect(() => {
    if (baseUrl) {
      const fullEmbedUrl = `${baseUrl}${galleryEmbedPath}`;
      setEmbedCode(
        // Added title attribute for accessibility
        // Using aspect-ratio CSS property for modern browsers
        // Added allow policy for potential future features like fullscreen
        `<iframe title="PhotoFlow Gallery" src="${fullEmbedUrl}" width="${defaultWidth}" height="${defaultHeight}" style="max-width: 800px; aspect-ratio: 16 / 9; display: block; margin: auto; border: none; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" allow="fullscreen"></iframe>`
      );
    }
  }, [baseUrl, galleryEmbedPath, defaultWidth, defaultHeight]);

  const copyToClipboard = () => {
    if (!embedCode) return;
    navigator.clipboard.writeText(embedCode).then(() => {
      toast({
        title: "Copied to clipboard!",
        description: "Embed code has been copied.",
      });
    }).catch(err => {
      console.error("Failed to copy text: ", err);
      toast({
        title: "Failed to copy",
        description: "Could not copy embed code to clipboard.",
        variant: "destructive",
      });
    });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-muted/30">
        <CardTitle className="font-headline text-2xl text-primary">Embed Your Gallery</CardTitle>
        <CardDescription className="text-muted-foreground">
          Copy the HTML code below to embed this photo gallery on your website.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <Textarea
          value={embedCode}
          readOnly
          className="h-40 font-code text-sm bg-muted/50 p-3 rounded-md focus:ring-primary focus:border-primary"
          aria-label="Embed code"
          placeholder="Generating embed code..."
        />
        <Button onClick={copyToClipboard} disabled={!embedCode} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-medium">
          <ClipboardCopy className="mr-2 h-4 w-4" />
          Copy Embed Code
        </Button>
      </CardContent>
    </Card>
  );
}
