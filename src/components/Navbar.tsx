import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useToastStore } from "../store/useToastStore";

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
    <nav className="w-full h-[64px] flex justify-between items-center px-8 sticky top-0 bg-[#121212]/80 backdrop-blur-md z-50">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full bg-black flex items-center justify-center hover:bg-[#282828] transition-colors"
        >
          <img className="w-2.5 opacity-60" src={assets.arrow_left} alt="Back" />
        </button>
        <button 
          onClick={() => navigate(1)}
          className="w-8 h-8 rounded-full bg-black flex items-center justify-center hover:bg-[#282828] transition-colors"
        >
          <img className="w-2.5 opacity-60" src={assets.arrow_right} alt="Forward" />
        </button>
      </div>

      <div className="flex items-center gap-6">
        {user?.tier === 'Free' && (
          <button
            onClick={handleUpgrade}
            className="hidden md:block px-5 py-1.5 rounded-full bg-white text-black text-xs font-bold hover:scale-105 transition-transform"
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
    </nav>
  );
};

export default Navbar;
