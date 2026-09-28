"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = `Hola, soy ${data.get("name")}. Mi correo es ${data.get("email")}${data.get("phone") ? ` y mi teléfono es ${data.get("phone")}` : ""}. ${data.get("message")}`;
    setIsSending(true);
    setError("");
    const popup = window.open(`https://wa.me/573122184430?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    window.setTimeout(() => {
      setIsSending(false);
      if (popup) setSent(true);
      else setError("No pudimos abrir WhatsApp. Usa el botón directo para continuar.");
    }, 450);
  }

  if (sent) {
    return <div className="contact-success" role="status"><CheckCircle2 size={24} aria-hidden="true" /><div><strong>Mensaje listo para enviar.</strong><p>Gracias por escribirnos. Te responderemos por el canal disponible.</p></div></div>;
  }

  return <form className="contact-form" onSubmit={submit}>
    <div className="contact-form-grid">
      <label className="admin-field"><span>Nombre</span><input className="admin-input" name="name" autoComplete="name" required placeholder="Tu nombre" /></label>
      <label className="admin-field"><span>Correo electrónico</span><input className="admin-input" name="email" type="email" autoComplete="email" required placeholder="tu@correo.com" /></label>
    </div>
    <label className="admin-field"><span>Teléfono</span><input className="admin-input" name="phone" type="tel" autoComplete="tel" placeholder="312 000 0000" /></label>
    <label className="admin-field"><span>¿Qué necesitas?</span><textarea className="admin-input contact-textarea" name="message" required rows={5} placeholder="Cuéntanos el producto, medida o cantidad que buscas." /></label>
    {error ? <p className="admin-error" role="alert">{error}</p> : null}
    <button className="button primary" type="submit" disabled={isSending}>{isSending ? "Abriendo WhatsApp..." : <><Send size={17} aria-hidden="true" /> Enviar por WhatsApp</>}</button>
  </form>;
}
