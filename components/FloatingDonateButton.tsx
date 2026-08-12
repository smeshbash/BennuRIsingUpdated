
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart } from 'lucide-react';

const FloatingDonateButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on donate page and admin pages
  if (location.pathname.startsWith('/donate') || location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <button
      onClick={() => navigate('/donate')}
      className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40 bg-gradient-to-r from-brand-red to-[#b92b14] text-white py-4 px-6 md:px-8 rounded-full shadow-skeuo-raised hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 border-4 border-white/30 backdrop-blur-md group animate-fade-in-up"
    >
      <div className="bg-white/20 p-2 rounded-full">
        <Heart className="w-5 h-5 md:w-6 md:h-6 fill-white text-white animate-pulse" />
      </div>
      <span className="text-lg md:text-xl font-bold tracking-wider font-serif-heading">DONATE</span>
    </button>
  );
};

export default FloatingDonateButton;
