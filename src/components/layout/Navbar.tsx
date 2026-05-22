import React from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useToastStore } from "../../store/useToastStore";

/**
 * Production Navbar
 * - Minimalist design with high-performance navigation logic.
 */
const Navbar = () => {
  const navigate = useNavigate();
  const { user, upgradeToPremium } = useAuthStore();
  const { addToast } = useToastStore();

  const handleUpgrade = () => {
    upgradeToPremium();
    addToast("Upgraded to Premium", "success");
  };

  return (
    <header className="sticky top-0 h-16 bg-[#121212]/90 backdrop-blur-md flex items-center justify-between px-6 z-40">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-black transition-all border border-white/5 active:scale-95">
          <img className="w-3 opacity-60 hover:opacity-100" src={assets.arrow_left} alt="<" />
        </button>
        <button onClick={() => navigate(1)} className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-black transition-all border border-white/5 active:scale-95">
          <img className="w-3 opacity-60 hover:opacity-100" src={assets.arrow_right} alt=">" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        {user?.tier === 'Free' && (
          <button
            onClick={handleUpgrade}
            className="hidden md:block px-4 py-2 rounded-full bg-white text-black text-xs font-semibold hover:scale-105 active:scale-95 transition-all shadow-md"
          >
            Explore Premium
          </button>
        )}
        
        <button 
          onClick={() => navigate('/search')}
          className="md:hidden w-8 h-8 rounded-full bg-black flex items-center justify-center"
        >
          <img src={assets.search_icon} className="w-4 opacity-60" alt="Search" />
        </button>

        <button className="hidden md:block px-4 py-2 rounded-full bg-black/40 border border-white/10 text-white text-xs font-semibold hover:scale-105 hover:bg-black/60 transition-all">
          Install App
        </button>

        <div className="flex items-center gap-2 cursor-pointer group bg-black/40 rounded-full pl-1 pr-3 py-1 hover:bg-black/60 transition-all border border-white/5">
          <div className="w-7 h-7 rounded-full overflow-hidden border border-white/10">
            <img src={user?.avatar} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <span className="text-xs font-semibold text-text-muted group-hover:text-white transition-colors">{user?.name}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
