"use client";

import { useState } from "react";

export interface StarRatingProps {
  label: string;
  rating: number;
  onChange: (rating: number) => void;
}

export function StarRating({ label, rating, onChange }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  return (
    <div className="flex items-center justify-between py-2 border-b border-border-custom last:border-0">
      <span className="text-xs font-medium text-text-sub">{label}</span>
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(null)}
            className="focus:outline-none transition-transform active:scale-90 cursor-pointer text-base"
          >
            <i
              className={`fa-solid fa-star ${
                star <= (hoverRating ?? rating)
                  ? "text-amber-500"
                  : "text-gray-300 dark:text-gray-700"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
