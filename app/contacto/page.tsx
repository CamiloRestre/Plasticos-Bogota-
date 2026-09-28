import dynamic from "next/dynamic";
import { ContactForm } from "@/components/contact-form";
import type { Metadata } from "next";

const AnimatedCanvas = dynamic(() => import("@/components/animated-canvas"), { ssr: false });

export const metadata: Metadata = {
  title: "Contacto | Plásticos Bogotá",
  description: "Consulta disponibilidad, medidas, precios y zonas de entrega.",
};

export default function ContactoPage() {
  return <main><section className="section page-hero"><AnimatedCanvas /><div className="shell"><p className="eyebrow">Hablemos</p><h1 style={{ fontSize: "clamp(3rem,7vw,5.8rem)", lineHeight: .95, letterSpacing: "-.06em", maxWidth: 850 }}>Cuéntanos qué necesitas.</h1><p style={{ maxWidth: 600, color: "var(--muted)", fontSize: 20, marginTop: 26 }}>Nuestro equipo te ayuda a confirmar disponibilidad, medidas, precios y zonas de entrega.</p><div className="hero-actions"><a className="button primary" href="https://wa.me/573122184430" target="_blank" rel="noreferrer">Escribir por WhatsApp</a><a className="button secondary" href="tel:+573122184430">Llamar al 312 218 4430</a></div></div></section><section className="section contact-section"><div className="shell contact-layout"><div><p className="eyebrow">Escríbenos</p><h2>Te ayudamos a encontrar la opción adecuada.</h2><p>Déjanos tus datos y una breve descripción. También puedes contactarnos directamente por WhatsApp.</p><ContactForm /></div><div className="contact-details"><p className="eyebrow">Visítanos</p><h2>Tuluá · Valle del Cauca</h2><p>Carrera 25 # 31-20, B/ Salesianos</p><p className="eyebrow">Horario</p><p>Lun–Vie 8:00–12:00 y 14:00–17:30<br />Sáb 8:00–12:30<br />Domingos y festivos cerrado</p></div></div></section></main>;
}
