"use client";

import { Package } from "lucide-react";
import Image from "next/image";
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

  return <Image className={className} src={src} alt={alt} width={960} height={768} sizes="(max-width: 768px) 100vw, (max-width: 1160px) 50vw, 33vw" loading="lazy" unoptimized onError={() => setHasError(true)} />;
}
