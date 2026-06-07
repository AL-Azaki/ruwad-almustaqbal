import { MessageCircle } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

export default function FloatingWhatsApp() {
  const { settings } = useSettings();
  
  // Format number for WhatsApp link (remove '+' or leading '00')
  const phone = settings?.whatsappNumber || '966506396004';
  const waLink = `https://wa.me/${phone}`;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-[0_4px_15px_rgba(34,197,94,0.4)] hover:bg-green-600 hover:scale-110 transition-all duration-300 animate-bounce"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="w-8 h-8" />
      {/* Ping animation effect */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-20 animate-ping"></span>
    </a>
  );
}
