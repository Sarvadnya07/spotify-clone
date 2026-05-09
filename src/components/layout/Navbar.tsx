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
    <header className="sticky top-0 h-16 bg-background/60 backdrop-blur-3xl flex items-center justify-between px-8 z-40 border-b border-white/[0.03]">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-all border border-white/5 active:scale-95">
          <img className="w-4 opacity-60" src={assets.arrow_left} alt="<" />
        </button>
        <button onClick={() => navigate(1)} className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-all border border-white/5 active:scale-95">
          <img className="w-4 opacity-60" src={assets.arrow_right} alt=">" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        {user?.tier === 'Free' && (
          <button
            onClick={handleUpgrade}
            className="hidden md:block px-4 py-1.5 rounded-full bg-white text-black text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
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

        <button className="hidden md:block px-4 py-1.5 rounded-full border border-white/10 text-white text-xs font-bold hover:bg-white/5 transition-all">
          Install App
        </button>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 group-hover:border-white/20 transition-all">
            <img src={user?.avatar} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <span className="text-xs font-bold text-[#a7a7a7] group-hover:text-white transition-colors">{user?.name}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
