
import { PhotoGallery } from "@/components/photo-gallery";

const embedGalleryImages = [
  { id: 1, originalUrl: "https://cdn.pixabay.com/photo/2019/10/22/20/19/most-na-adi-4569762_1280.jpg", alt: "Ada Bridge, Belgrade", dataAiHint: "bridge city" },
  { id: 2, originalUrl: "https://cdn.pixabay.com/photo/2020/04/04/16/31/novi-sad-5002955_1280.jpg", alt: "Novi Sad city center", dataAiHint: "city square" },
  { id: 3, originalUrl: "https://cdn.pixabay.com/photo/2017/07/15/15/07/belgrade-2506700_1280.jpg", alt: "Belgrade cityscape", dataAiHint: "cityscape river" },
  { id: 4, originalUrl: "https://cdn.pixabay.com/photo/2021/08/27/18/50/water-6579313_1280.jpg", alt: "Calm water surface", dataAiHint: "water reflection" },
  { id: 5, originalUrl: "https://cdn.pixabay.com/photo/2023/10/21/11/46/sunset-8331285_1280.jpg", alt: "Sunset over water", dataAiHint: "sunset sea" },
];

export default function GalleryEmbedPage() {
  return (
    // Ensure the embed page takes full width and height of the iframe
    // Apply background color to match the theme for consistency
    <div className="w-full h-screen bg-background flex items-center justify-center p-0 m-0 overflow-hidden">
      {/* Set enableAiProcessing to false if AI processing is too slow/problematic for embed, or true to match main */}
      <PhotoGallery initialImages={embedGalleryImages} enableAiProcessing={true} />
    </div>
  );
}
