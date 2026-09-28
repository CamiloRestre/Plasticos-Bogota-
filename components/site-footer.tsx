import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Link className="footer-brand" href="/">
            <Image
              src="/img/logo.png"
              alt="Plásticos Bogotá"
              width={200}
              height={60}
              className="footer-logo"
            />
          </Link>
          <p>Productos plásticos y atención cercana para Colombia.</p>
        </div>
        <div>
          <h3>Explora</h3>
          <nav className="footer-nav" aria-label="Navegación del pie de página">
            <Link href="/catalogo">Catálogo</Link>
            <Link href="/nosotros">Nosotros</Link>
            <Link href="/contacto">Contacto</Link>
          </nav>
          <Link className="footer-cta" href="/catalogo">Ver productos</Link>
        </div>
        <div><h3>Contacto</h3><p>Carrera 25 # 31-20<br />B/ Salesianos · Tuluá, Valle</p><a href="mailto:plasticosbogota@hotmail.com">plasticosbogota@hotmail.com</a></div>
        <div><h3>Atención</h3><p>Lun–Vie 8:00–12:00 y 14:00–17:30<br />Sáb 8:00–12:30<br />Domingos y festivos cerrado</p></div>
      </div>
      <div className="shell footer-bottom"><span>© 2026 Plásticos Bogotá</span><span>Servicio a domicilio · Parqueadero</span></div>
    </footer>
  );
}
