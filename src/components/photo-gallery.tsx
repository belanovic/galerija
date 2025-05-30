
"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import type { CSSProperties } from "react";
import { ChevronLeft, ChevronRight, ImageOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { smartCropAndScale } from "@/ai/flows/smart-crop-and-scale"; 

interface GalleryImage {
  id: number;
  originalUrl: string;
  processedUrl?: string;
  alt: string;
  dataAiHint: string; 
  isLoadingAi: boolean;
  aiError?: string;
}

interface PhotoGalleryProps {
  initialImages: Omit<GalleryImage, "processedUrl" | "isLoadingAi" | "aiError">[];
  enableAiProcessing?: boolean; 
}

async function imageUrlToDataUri(url: string): Promise<string> {
  try {
    // This proxy is for demo purposes to bypass CORS issues when fetching from cdn.pixabay.com client-side.
    // In a production scenario, images should ideally be served with appropriate CORS headers,
    // or this fetching and conversion process should happen server-side.
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image via proxy: ${response.statusText} for URL: ${url}`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error(`Error fetching or converting image ${url}:`, error);
    // Fallback: if proxy fails or any other error, try direct fetch. This might fail due to CORS.
    try {
        const directResponse = await fetch(url);
        if (!directResponse.ok) {
            throw new Error(`Direct fetch failed: ${directResponse.statusText}`);
        }
        const blob = await directResponse.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (directFetchError) {
        console.error(`Direct fetch also failed for ${url}:`, directFetchError);
        throw directFetchError; // Re-throw the error if direct fetch also fails
    }
  }
}


export function PhotoGallery({ initialImages, enableAiProcessing = true }: PhotoGalleryProps) {
  const [images, setImages] = useState<GalleryImage[]>(
    initialImages.map(img => ({ ...img, isLoadingAi: false }))
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const filmStripRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const processImageWithAI = useCallback(async (index: number) => {
    if (!enableAiProcessing) {
      setImages(prev => prev.map((img, i) => i === index ? { ...img, processedUrl: img.originalUrl, isLoadingAi: false } : img));
      return;
    }
    
    const currentImage = images[index];
    if (!currentImage) return;


    setImages(prev => prev.map((img, i) => i === index ? { ...img, isLoadingAi: true, aiError: undefined } : img));
    try {
      const dataUri = await imageUrlToDataUri(currentImage.originalUrl);
      const result = await smartCropAndScale({ imageDataUri: dataUri });
      setImages(prev => prev.map((img, i) => i === index ? { ...img, processedUrl: result.croppedImageDataUri, isLoadingAi: false } : img));
    } catch (error) {
      console.error("AI processing error for image", currentImage.originalUrl, error);
      setImages(prev => prev.map((img, i) => i === index ? { ...img, aiError: "Failed to process", isLoadingAi: false, processedUrl: img.originalUrl } : img)); 
    }
  }, [images, enableAiProcessing]); // Added images to dependency array

  useEffect(() => {
    images.forEach((image, index) => {
      if (!image.processedUrl && !image.isLoadingAi && !image.aiError && enableAiProcessing) {
        processImageWithAI(index);
      } else if (!enableAiProcessing && !image.processedUrl) {
         setImages(prev => prev.map((img, i) => i === index ? { ...img, processedUrl: img.originalUrl } : img));
      }
    });
  }, [images, processImageWithAI, enableAiProcessing]);


  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    setTranslateX(0);
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    setTranslateX(0);
  }, [images.length]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setTranslateX(0);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (images.length <= 1) return;
    setIsDragging(true);
    setDragStartX(e.clientX);
    if (filmStripRef.current) {
      filmStripRef.current.style.transition = 'none'; 
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !galleryRef.current) return;
    const currentX = e.clientX;
    const dx = currentX - dragStartX;
    setTranslateX(dx);
  };

  const handleMouseUp = () => {
    if (!isDragging || !galleryRef.current) return;
    setIsDragging(false);
    if (filmStripRef.current) {
      filmStripRef.current.style.transition = 'transform 0.5s ease-in-out';
    }

    const dragThreshold = galleryRef.current.offsetWidth / 4;
    if (translateX > dragThreshold) {
      handlePrev();
    } else if (translateX < -dragThreshold) {
      handleNext();
    } else {
      setTranslateX(0);
    }
  };
  
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (images.length <= 1) return;
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
    if (filmStripRef.current) {
      filmStripRef.current.style.transition = 'none';
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !galleryRef.current) return;
    const currentX = e.touches[0].clientX;
    const dx = currentX - dragStartX;
    setTranslateX(dx);
  };

  const handleTouchEnd = () => {
    handleMouseUp(); 
  };


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  const filmStripStyle: CSSProperties = {
    transform: `translateX(calc(-${currentIndex * 100}% + ${translateX}px))`,
    transition: isDragging ? 'none' : 'transform 0.5s ease-in-out',
  };

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center w-full aspect-video bg-muted rounded-lg shadow-lg">
        <p className="text-muted-foreground">No images to display.</p>
      </div>
    );
  }
  
  return (
    <div 
      ref={galleryRef}
      className="relative w-full max-w-3xl mx-auto overflow-hidden rounded-lg shadow-2xl bg-background"
      onMouseLeave={isDragging ? handleMouseUp : undefined} 
    >
      <div
        ref={filmStripRef}
        className="flex"
        style={filmStripStyle}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((image, index) => (
          <div key={image.id} className="relative w-full aspect-video flex-shrink-0">
            {(image.isLoadingAi || (!image.processedUrl && enableAiProcessing)) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="mt-2 text-sm text-foreground">Processing image...</p>
              </div>
            )}
            {image.aiError && !image.isLoadingAi && (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/10 p-4">
                <ImageOff className="w-12 h-12 text-destructive" />
                <p className="mt-2 text-sm text-destructive text-center">AI processing failed. Displaying original.</p>
              </div>
            )}
            <Image
              src={image.processedUrl || image.originalUrl}
              alt={image.alt}
              layout="fill"
              objectFit="cover"
              priority={index === currentIndex}
              className={cn(
                "transition-opacity duration-500 ease-in-out",
                (image.isLoadingAi || (!image.processedUrl && enableAiProcessing && !image.aiError)) ? "opacity-30" : "opacity-100",
                "select-none", 
                "cursor-grab",
                 isDragging && "cursor-grabbing"
              )}
              draggable="false" 
              data-ai-hint={image.dataAiHint}
              unoptimized={true} 
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-background/50 hover:bg-background/80 text-foreground hover:text-primary rounded-full shadow-md"
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-background/50 hover:bg-background/80 text-foreground hover:text-primary rounded-full shadow-md"
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => { e.stopPropagation(); handleDotClick(index);}}
                aria-label={`Go to image ${index + 1}`}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300 ease-in-out shadow",
                  index === currentIndex ? "bg-primary scale-125" : "bg-muted hover:bg-secondary"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
