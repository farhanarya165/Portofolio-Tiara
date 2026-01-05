import { useState, useEffect } from 'react';
import { Linkedin, Instagram, Mail, MessageCircle, Heart } from 'lucide-react';
import { storage, STORAGE_KEYS } from '../utils/storage';

const Footer = () => {
  const [socialLinks, setSocialLinks] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const socialData = await storage.get(STORAGE_KEYS.SOCIAL_LINKS);
    const profileData = await storage.get(STORAGE_KEYS.PROFILE);
    setSocialLinks(socialData);
    setProfile(profileData);
  };

  const socialIcons = [
    { icon: Linkedin, link: socialLinks?.linkedin },
    { icon: Instagram, link: socialLinks?.instagram },
    { icon: Mail, link: socialLinks?.email },
    { icon: MessageCircle, link: socialLinks?.whatsapp }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12 px-6 lg:px-12">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-playfair font-bold mb-4 text-beige-light">
              Tiara's Corner
            </h3>
            <p className="text-gray-400 font-inter text-sm leading-relaxed">
              {profile?.bio || 'Creating meaningful digital experiences through strategic communication and creative content.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-inter font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Projects', 'Portfolio', 'Contact'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="text-gray-400 hover:text-beige-light transition-colors font-inter text-sm"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-inter font-bold mb-4">Connect With Me</h4>
            <div className="flex items-center space-x-4">
              {socialIcons.map((social, index) => (
                <a
                  key={index}
                  href={social.link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-beige-dark hover:text-white transition-all"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 font-inter text-sm flex items-center justify-center">
            Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> by Tiara © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;