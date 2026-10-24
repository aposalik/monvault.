"use client";

import Image from "next/image";
import { useState } from "react";
import { Surface } from "@/components/ui/surface";

export interface ProductGalleryProps {
  images: string[];
  title: string;
  badge?: string | null;
}

export function ProductGallery({ images, title, badge }: ProductGalleryProps) {
  const galleryList = images.length > 0 ? images : ["/visuals/products/studio-headphones.svg"];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = galleryList[activeIndex] ?? galleryList[0];

  return (
    <div className="space-y-4">
      <Surface
        tone="raised"
        radius="card"
        className="relative overflow-hidden border border-line p-6 md:p-8"
      >
        {badge ? (
          <span className="absolute left-5 top-5 z-10 rounded-full bg-violet-100 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-violet-700">
            {badge}
          </span>
        ) : null}

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] bg-muted/40">
          <Image
            src={activeImage}
            alt={`${title} — view ${activeIndex + 1}`}
            width={640}
            height={480}
            priority
            className="h-full w-full object-contain p-4"
          />
        </div>
      </Surface>

      {galleryList.length > 1 ? (
        <div
          role="tablist"
          aria-label={`${title} product photos`}
          className="flex items-center gap-3"
        >
          {galleryList.map((imgSrc, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={`${imgSrc}-${idx}`}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={`View photo ${idx + 1}`}
                onClick={() => setActiveIndex(idx)}
                className={`relative h-20 w-24 overflow-hidden rounded-2xl border bg-surface p-2 transition-all cursor-pointer ${
                  isSelected
                    ? "border-2 border-violet-600 shadow-sm"
                    : "border-line opacity-75 hover:opacity-100"
                }`}
              >
                <Image
                  src={imgSrc}
                  alt=""
                  width={160}
                  height={120}
                  className="h-full w-full object-contain"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
