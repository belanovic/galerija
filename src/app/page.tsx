
import { PhotoGallery } from "@/components/photo-gallery";
import { EmbedCodeGenerator } from "@/components/embed-code-generator";

const initialGalleryImages = [
  { id: 1, originalUrl: "https://cdn.pixabay.com/photo/2019/10/22/20/19/most-na-adi-4569762_1280.jpg", alt: "Ada Bridge, Belgrade", dataAiHint: "bridge city" },
  { id: 2, originalUrl: "https://cdn.pixabay.com/photo/2020/04/04/16/31/novi-sad-5002955_1280.jpg", alt: "Novi Sad city center", dataAiHint: "city square" },
  { id: 3, originalUrl: "https://cdn.pixabay.com/photo/2017/07/15/15/07/belgrade-2506700_1280.jpg", alt: "Belgrade cityscape", dataAiHint: "cityscape river" },
  { id: 4, originalUrl: "https://cdn.pixabay.com/photo/2021/08/27/18/50/water-6579313_1280.jpg", alt: "Calm water surface", dataAiHint: "water reflection" },
  { id: 5, originalUrl: "https://cdn.pixabay.com/photo/2023/10/21/11/46/sunset-8331285_1280.jpg", alt: "Sunset over water", dataAiHint: "sunset sea" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="container mx-auto py-8 px-4 flex-grow flex flex-col items-center space-y-12">
        <header className="text-center">
          <h1 className="font-headline text-5xl font-bold text-primary mb-2">
            PhotoFlow Gallery
          </h1>
          <p className="text-xl text-muted-foreground">
            A stunning, swipeable gallery experience.
          </p>
        </header>

        <section className="w-full py-6">
          <PhotoGallery initialImages={initialGalleryImages} />
        </section>

        <section className="w-full py-6">
          <EmbedCodeGenerator galleryEmbedPath="/embed/gallery" />
        </section>
      </main>
      
      <footer className="text-center text-muted-foreground py-6 border-t border-border">
        <p>&copy; {new Date().getFullYear()} PhotoFlow Gallery. All rights reserved.</p>
      </footer>
    </div>
  );
}
