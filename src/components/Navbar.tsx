import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useToastStore } from "../store/useToastStore";

/**
 * Modern Glass Navbar
 * - Features dynamic user profile synchronization.
 * - Integrated Premium Upgrade flow.
 * - Optimized for the "Modern Glass" aesthetic.
 */
const Navbar = () => {
  const navigate = useNavigate();
  const { user, upgradeToPremium } = useAuthStore();
  const { addToast } = useToastStore();

  const handleUpgrade = () => {
    upgradeToPremium();
    addToast("Welcome to Spotify Premium!", "success");
  };

  return (
    <nav className="w-full h-[64px] glass-panel border-x-0 border-t-0 px-6 flex justify-between items-center z-50 sticky top-0 bg-black/40 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <div 
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer transition-all active:scale-90"
        >
          <img className="w-2.5 opacity-60" src={assets.arrow_left} alt="Back" />
        </div>
        <div 
          onClick={() => navigate(1)}
          className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer transition-all active:scale-90"
        >
          <img className="w-2.5 opacity-60" src={assets.arrow_right} alt="Forward" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user?.tier === 'Free' && (
          <button
            onClick={handleUpgrade}
            className="hidden md:block px-6 py-2 rounded-full bg-white text-black text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            Explore Premium
          </button>
        )}
        
        <button className="hidden md:block px-4 py-2 rounded-full glass-panel border-white/10 text-white text-[11px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
          Install App
        </button>

        <div className="flex items-center gap-3 p-1.5 px-3 glass-panel rounded-full border-white/10 cursor-pointer hover:bg-white/5 transition-all group">
          <div className="w-7 h-7 rounded-full overflow-hidden border border-white/20 group-hover:scale-110 transition-transform">
            <img src={user?.avatar} alt="P" className="w-full h-full" />
          </div>
          <span className="text-[11px] font-bold text-gray-300 group-hover:text-white transition-colors">{user?.name}</span>
          {user?.tier === 'Premium' && (
            <span className="text-[9px] font-black text-[#1db954] bg-[#1db95422] px-1.5 py-0.5 rounded uppercase tracking-tighter">Pro</span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
