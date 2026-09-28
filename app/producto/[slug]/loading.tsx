export default function ProductLoading() {
  return (
    <main className="product-page" aria-busy="true" aria-label="Cargando producto">
      <div className="shell">
        <div className="product-detail-layout">
          <div className="skeleton product-detail-media" />
          <div className="product-detail-copy">
            <span className="skeleton skeleton-kicker" />
            <span className="skeleton skeleton-title" />
            <span className="skeleton skeleton-line" />
            <span className="skeleton skeleton-line short" />
          </div>
        </div>
      </div>
    </main>
  );
}
