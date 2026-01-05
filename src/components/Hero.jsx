import { useState, useEffect } from 'react';
import { Download, Linkedin, Instagram, Mail, MessageCircle } from 'lucide-react';
import { storage, STORAGE_KEYS } from '../utils/storage';
import Swal from 'sweetalert2';

const Hero = () => {
  const [profile, setProfile] = useState(null);
  const [socialLinks, setSocialLinks] = useState(null);
  const [cvData, setCvData] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [prof, soc, cv] = await Promise.all([
      storage.get(STORAGE_KEYS.PROFILE),
      storage.get(STORAGE_KEYS.SOCIAL_LINKS),
      storage.get(STORAGE_KEYS.CV_URL)
    ]);
    setProfile(prof);
    setSocialLinks(soc);
    setCvData(cv);
  };

  const handleDownloadCV = () => {
    if (cvData?.file_url) {
      window.open(cvData.file_url, '_blank');
    } else {
      Swal.fire('Info', 'File CV belum tersedia.', 'info');
    }
  };

  // Fungsi pengolah link Email & WA agar otomatis bekerja dari Panel Admin
  const getSocialLink = (type, value) => {
    if (!value) return '#';
    if (type === 'email') return `mailto:${value}`;
    if (type === 'whatsapp') return `https://wa.me/${value.replace(/\D/g, '')}`;
    return value;
  };

  const socialIcons = [
    { icon: Linkedin, link: getSocialLink('linkedin', socialLinks?.linkedin), color: 'hover:text-blue-600' },
    { icon: Instagram, link: getSocialLink('instagram', socialLinks?.instagram), color: 'hover:text-pink-600' },
    { icon: Mail, link: getSocialLink('email', socialLinks?.email), color: 'hover:text-red-600' },
    { icon: MessageCircle, link: getSocialLink('whatsapp', socialLinks?.whatsapp), color: 'hover:text-green-600' }
  ];

  return (
    <section id="home" className="relative min-h-screen pt-32 pb-20 px-6 lg:px-12 bg-[#FAF9F6] overflow-hidden">
      {/* Background Subtle Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-[#F3EEEA] blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] rounded-full bg-[#EBE3D5] blur-[100px] opacity-40"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6 animate-slideIn">
            <p className="text-beige-dark font-inter font-semibold mb-2 uppercase tracking-widest">
              {profile?.title || 'Public Relations Professional'}
            </p>
            <h1 className="text-5xl lg:text-6xl font-playfair font-bold text-gray-800 mb-4 leading-tight">
              {profile?.name || 'Loading...'}
            </h1>
            <p className="text-gray-600 font-inter leading-relaxed text-lg max-w-lg">
              {profile?.description || 'Silakan isi deskripsi profil di Admin Panel.'}
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <button onClick={handleDownloadCV} className="btn-primary flex items-center space-x-2 px-8 py-4 shadow-md hover:shadow-lg transition-shadow">
                <Download className="w-5 h-5" />
                <span>Download CV</span>
              </button>
              
              <div className="flex items-center space-x-4">
                {socialIcons.map((social, index) => (
                  <a 
                    key={index} 
                    href={social.link} 
                    target={social.link.startsWith('http') ? "_blank" : "_self"} 
                    rel="noopener noreferrer" 
                    className={`w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-700 transition-all hover:scale-110 shadow-sm border border-beige-lighter/50 ${social.color}`}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-center lg:justify-end animate-fadeIn">
            <div className="relative">
              {/* Decorative elements behind the photo */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-beige-light rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-beige rounded-full opacity-10 animate-pulse"></div>
              
              {/* Modern frame effect with rotation and hover animation */}
              <div className="relative w-80 h-[450px] rounded-[100px] overflow-hidden shadow-2xl border-[12px] border-white transform rotate-3 hover:rotate-0 transition-transform duration-500 bg-beige-lighter">
                <img 
                  src={profile?.image || 'https://via.placeholder.com/400x500'} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;