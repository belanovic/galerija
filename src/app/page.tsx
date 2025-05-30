
import { PhotoGallery } from "@/components/photo-gallery";

const initialGalleryImages = [
  { id: 1, originalUrl: "https://cdn.pixabay.com/photo/2019/10/22/20/19/most-na-adi-4569762_1280.jpg", alt: "Ada Bridge, Belgrade", dataAiHint: "bridge city" },
  { id: 2, originalUrl: "https://cdn.pixabay.com/photo/2020/04/04/16/31/novi-sad-5002955_1280.jpg", alt: "Novi Sad city center", dataAiHint: "city square" },
  { id: 3, originalUrl: "https://cdn.pixabay.com/photo/2017/07/15/15/07/belgrade-2506700_1280.jpg", alt: "Belgrade cityscape", dataAiHint: "cityscape river" },
  { id: 4, originalUrl: "https://cdn.pixabay.com/photo/2021/08/27/18/50/water-6579313_1280.jpg", alt: "Calm water surface", dataAiHint: "water reflection" },
  { id: 5, originalUrl: "https://cdn.pixabay.com/photo/2023/10/21/11/46/sunset-8331285_1280.jpg", alt: "Sunset over water", dataAiHint: "sunset sea" },
];

export default function HomePage() {
  return (
    <div className="bg-background p-0 m-0">
      {/* The PhotoGallery component handles its own max-width and centering */}
      <PhotoGallery initialImages={initialGalleryImages} />
    </div>
  );
}
