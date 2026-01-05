import { useState, useEffect } from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { storage, STORAGE_KEYS } from '../utils/storage';

const CTA = () => {
  const [whatsappLink, setWhatsappLink] = useState('');

  useEffect(() => {
    loadSocialLinks();
  }, []);

  const loadSocialLinks = async () => {
    const socialLinks = await storage.get(STORAGE_KEYS.SOCIAL_LINKS);
    if (socialLinks?.whatsapp) {
      // Menggunakan format wa.me agar langsung berfungsi jika admin hanya input nomor
      const waNumber = socialLinks.whatsapp.replace(/\D/g, '');
      setWhatsappLink(`https://wa.me/${waNumber}`);
    }
  };

  const handleStartProject = () => {
    if (whatsappLink) {
      window.open(whatsappLink, '_blank');
    } else {
      alert('WhatsApp link not configured. Please contact admin.');
    }
  };

  return (
    <section id="contact" className="py-20 px-6 lg:px-12 bg-[#FAF9F6]">
      <div className="container mx-auto">
        {/* max-w-4xl ditambahkan untuk mengecilkan ukuran kotak */}
        <div className="relative bg-gradient-to-br from-beige-dark to-beige rounded-3xl shadow-xl overflow-hidden max-w-4xl mx-auto">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
          
          {/* Content - Padding diperkecil (py-12) agar kotak tidak terlalu tinggi */}
          <div className="relative z-10 text-center py-12 px-8 lg:px-16">
            <div className="inline-block mb-4">
              <Sparkles className="w-10 h-10 text-white animate-pulse" />
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-playfair font-bold text-white mb-2">
              Ready to collaborate?
            </h2>
            <p className="text-3xl lg:text-4xl font-inter font-extrabold italic text-white/90 mb-6">
              Let's collaborate
            </p>
            
            <p className="text-white/80 font-inter max-w-xl mx-auto mb-8 leading-relaxed text-sm lg:text-base">
              Have a project in mind? Let's discuss how we can work together to create something amazing. From strategy to execution, I'm here to help bring your ideas to life.
            </p>

            <button
              onClick={handleStartProject}
              className="inline-flex items-center space-x-3 bg-white text-beige-dark px-8 py-3.5 rounded-full font-inter font-bold text-base hover:bg-beige-lightest hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 active:scale-95"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Start a Project</span>
            </button>

            <p className="text-white/60 font-inter text-xs mt-6">
              Click to send me a message on WhatsApp
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;