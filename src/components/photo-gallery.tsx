
"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import type { CSSProperties } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// Removed: import { smartCropAndScale } from "@/ai/flows/smart-crop-and-scale"; 
// Removed: Loader2, ImageOff imports

interface GalleryImage {
  id: number;
  originalUrl: string;
  // processedUrl?: string; // Removed
  alt: string;
  dataAiHint: string; 
  // isLoadingAi: boolean; // Removed
  // aiError?: string; // Removed
}

interface PhotoGalleryProps {
  initialImages: GalleryImage[];
  // enableAiProcessing?: boolean; // Removed
}

// Removed imageUrlToDataUri function

export function PhotoGallery({ initialImages }: PhotoGalleryProps) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const filmStripRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Removed processImageWithAI function and related useEffect

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
            {/* Removed AI loading and error states */}
            <Image
              src={image.originalUrl} // Use originalUrl directly
              alt={image.alt}
              layout="fill"
              objectFit="cover"
              priority={index === currentIndex}
              className={cn(
                "transition-opacity duration-500 ease-in-out opacity-100", // Simplified classes
                "select-none", 
                "cursor-grab",
                 isDragging && "cursor-grabbing"
              )}
              draggable="false" 
              data-ai-hint={image.dataAiHint}
              // unoptimized={true} // Removed, allow Next.js optimization for external URLs
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
