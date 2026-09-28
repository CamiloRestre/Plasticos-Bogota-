"use client";

interface ProductMarqueeProps {
  items: string[];
}

export function ProductMarquee({ items }: ProductMarqueeProps) {
  const doubled = [...items, ...items];

  return (
    <div className="product-marquee" aria-label="Líneas de producto">
      <div className="product-marquee-track">
        {doubled.map((item, index) => (
          <div key={`${item}-${index}`} className="product-marquee-item">
            <span className="product-marquee-text">{item}</span>
            <span className="product-marquee-dot" aria-hidden="true">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}
