import { MessageCircle } from "lucide-react";

export function WhatsappFloat() {
  return (
    <a
      className="whatsapp-float"
      href="https://wa.me/573122184430"
      target="_blank"
      rel="noreferrer"
      aria-label="Escribir por WhatsApp"
    >
      <MessageCircle size={24} aria-hidden="true" />
    </a>
  );
}