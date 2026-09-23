import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div><Link className="footer-brand" href="/">Plásticos Bogotá</Link><p>Productos plásticos y atención cercana para Colombia.</p></div>
        <div><h3>Contacto</h3><p>Carrera 25 # 31-20<br />B/ Salesianos · Tuluá, Valle</p><a href="mailto:plasticosbogota@hotmail.com">plasticosbogota@hotmail.com</a></div>
        <div><h3>Atención</h3><p>Lun–Vie 8:00–12:00 y 14:00–17:30<br />Sáb 8:00–12:30<br />Domingos y festivos cerrado</p></div>
      </div>
      <div className="shell footer-bottom"><span>© 2026 Plásticos Bogotá</span><span>Servicio a domicilio · Parqueadero</span></div>
    </footer>
  );
}
