"use client";

import { Package } from "lucide-react";
import { useState } from "react";

type ProductImageProps = {
  src: string | null;
  alt: string;
  className?: string;
};

export function ProductImage({ src, alt, className = "" }: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className={`product-image-placeholder ${className}`} role="img" aria-label={`${alt} sin imagen disponible`}>
        <Package size={42} strokeWidth={1.25} aria-hidden="true" />
        <span>Imagen no disponible</span>
      </div>
    );
  }

  return <img className={className} src={src} alt={alt} onError={() => setHasError(true)} />;
}
