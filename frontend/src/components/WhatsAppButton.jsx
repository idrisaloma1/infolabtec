// Replace with the real INFOLAB WhatsApp number in international format, no leading +.
const WHATSAPP_NUMBER = "234XXXXXXXXXX";

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        "Hi INFOLAB TECH BRIDGE, I'd like to know more."
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with INFOLAB on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-brand-ink shadow-lg shadow-black/30 hover:scale-105 transition-transform"
    >
      <span className="text-lg">💬</span>
      <span className="hidden sm:inline">Chat on WhatsApp</span>
    </a>
  );
}
