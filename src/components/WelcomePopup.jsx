import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { storage, STORAGE_KEYS } from '../utils/storage';

const WelcomePopup = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadPopupData = async () => {
      const popup = await storage.get(STORAGE_KEYS.POPUP_SETTINGS);
      if (popup && popup.is_active) {
        setData(popup);
        setTimeout(() => setIsVisible(true), 500);
      } else {
        onClose(); // Tutup jika tidak aktif
      }
    };
    loadPopupData();
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!data) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-300 ${isVisible ? 'bg-opacity-50' : 'bg-opacity-0'}`} onClick={handleClose}>
      <div className={`relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`} onClick={(e) => e.stopPropagation()}>
        <button onClick={handleClose} className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-beige-lighter transition-colors">
          <X className="w-5 h-5 text-gray-600" />
        </button>
        <div className="p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-48 h-48 bg-beige-lighter rounded-full overflow-hidden">
              <img src={data.image || '/popup-tiara.png'} alt="Welcome" className="w-full h-full object-cover" />
            </div>
          </div>
          <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-3">{data.title}</h2>
          <p className="text-gray-600 font-inter text-sm leading-relaxed">{data.content}</p>
          <button onClick={handleClose} className="mt-6 btn-primary">Let's Explore</button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;