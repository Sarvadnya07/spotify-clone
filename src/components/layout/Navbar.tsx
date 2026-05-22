import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useToastStore } from "../../store/useToastStore";
import usePlayerStore from "../../store/usePlayerStore";

/**
 * Enterprise-Grade Spotify Top Header
 * - Designed to match Spotify's global top bar layout exactly.
 * - Centralized Home circular button + search input pill with route-switching listener.
 * - Dynamic side-drawer menu toggle controls.
 */
const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, upgradeToPremium } = useAuthStore();
  const { addToast } = useToastStore();
  
  const { 
    showFriendActivity, 
    toggleFriendActivity, 
    sidebarCollapsed, 
    toggleSidebarCollapsed,
    searchQuery,
    setSearchQuery
  } = usePlayerStore();

  const handleUpgrade = () => {
    upgradeToPremium();
    addToast("Upgraded to Premium", "success");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (location.pathname !== "/search") {
      navigate("/search");
    }
  };

  const handleSearchFocus = () => {
    if (location.pathname !== "/search") {
      navigate("/search");
    }
  };

  const handleHomeClick = () => {
    setSearchQuery("");
    navigate("/");
  };

  return (
    <header className="w-full h-16 bg-black flex items-center justify-between px-5 z-50 select-none flex-shrink-0">
      
      {/* LEFT SECTION: SPOTIFY LOGO + SIDEBAR TOGGLER */}
      <div className="flex items-center gap-4">
        {/* Crisp White Spotify SVG Logo */}
        <svg 
          className="h-8 w-auto fill-white cursor-pointer active:scale-95 transition-transform" 
          viewBox="0 0 24 24" 
          onClick={() => navigate("/")}
          aria-label="Spotify Home"
        >
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.895-.98-.336.075-.668-.135-.744-.47-.077-.337.135-.668.47-.745 3.856-.88 7.15-.5 9.822 1.135.296.18.39.563.207.857zm1.22-2.72c-.227.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.08-1.182-.413.125-.847-.107-.972-.52-.125-.413.107-.847.52-.972 3.67-1.114 8.235-.572 11.345 1.343.367.226.49.707.26 1.072zm.106-2.833C14.39 8.79 8.39 8.592 4.905 9.65c-.535.162-1.1-.14-1.262-.676-.162-.534.14-1.1.676-1.262 3.997-1.213 10.63-1.002 14.71 1.42.48.285.64.902.355 1.382-.285.48-.902.64-1.382.355z"/>
        </svg>

        {/* Left Sidebar Collapse/Menu Toggle Button */}
        <button 
          onClick={toggleSidebarCollapsed}
          className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all active:scale-95 ${
            sidebarCollapsed 
              ? 'bg-[#1ed760]/10 border-[#1ed760]/30 text-[#1ed760]' 
              : 'bg-black/50 border-white/10 text-[#b3b3b3] hover:text-white hover:bg-white/5'
          }`}
          title={sidebarCollapsed ? "Expand Sidebar Menu" : "Collapse Sidebar Menu"}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 3v18" />
          </svg>
        </button>
      </div>

      {/* CENTER SECTION: HOME BUTTON + PILL SEARCH INPUT */}
      <div className="flex items-center gap-2 flex-grow max-w-[520px] mx-4">
        {/* Dark Circular Home Button */}
        <button 
          onClick={handleHomeClick}
          className="w-11 h-11 rounded-full bg-[#1f1f1f] hover:bg-[#282828] text-white flex items-center justify-center transition-all flex-shrink-0 active:scale-95"
          title="Home"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20a1 1 0 0 0 1 1h5v-7h4v7h5a1 1 0 0 0 1-1V7.577l-7.5-4.33z" />
          </svg>
        </button>

        {/* Pill-Shaped Search Input Container */}
        <div className="flex-grow relative flex items-center bg-[#1f1f1f] hover:bg-[#282828] border border-transparent focus-within:border-white/20 focus-within:bg-[#282828] rounded-full px-4 h-11 transition-all group">
          {/* Magnifying Glass Search Icon */}
          <svg className="w-5 h-5 text-[#b3b3b3] group-focus-within:text-white transition-colors flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          {/* Search Input Field */}
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            placeholder="What do you want to play?"
            className="w-full h-full bg-transparent border-none text-white text-sm font-normal placeholder-[#b3b3b3] focus:outline-none px-3"
          />

          {/* Right Browse/Folder Icon inside search box */}
          <div className="flex-shrink-0 border-l border-white/10 pl-3">
            <svg 
              onClick={() => {
                setSearchQuery("");
                navigate("/search");
              }}
              className="w-5 h-5 text-[#b3b3b3] hover:text-white transition-colors cursor-pointer" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              title="Browse Categories"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION: PREMIUM PILL, INSTALL BADGE, BELL, FRIEND TOGGLE, AVATAR */}
      <div className="flex items-center gap-4 flex-shrink-0">
        
        {/* Explore Premium white pill button */}
        {user?.tier === "Free" && (
          <button
            onClick={handleUpgrade}
            className="hidden md:block px-4 py-2 rounded-full bg-white text-black text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-md flex-shrink-0"
          >
            Explore Premium
          </button>
        )}

        {/* Install App Badge */}
        <button className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black border border-white/20 hover:border-white/40 text-white text-xs font-bold hover:scale-105 active:scale-95 transition-all flex-shrink-0">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v8" />
            <path d="M8 12l4 4 4-4" />
          </svg>
          Install App
        </button>

        {/* Notification Bell Circular Button */}
        <button 
          className="w-10 h-10 rounded-full bg-black hover:bg-white/5 flex items-center justify-center text-[#b3b3b3] hover:text-white border border-white/5 transition-all active:scale-95 flex-shrink-0"
          title="Notifications"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        {/* Dynamic Friend Activity Toggle Button */}
        <button 
          onClick={toggleFriendActivity}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 border flex-shrink-0 ${
            showFriendActivity 
              ? 'bg-[#1ed760]/10 border-[#1ed760]/30 text-[#1ed760]' 
              : 'bg-black border-white/10 text-[#b3b3b3] hover:text-white hover:bg-white/5'
          }`}
          title="Friend Activity Toggle"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </button>

        {/* Profile Avatar Badge: white 'S' on blue circle */}
        <div 
          onClick={() => {
            if (user?.tier === "Free") {
              handleUpgrade();
            } else {
              addToast(`Signed in as ${user?.name}`, "info");
            }
          }}
          className="w-10 h-10 rounded-full bg-[#005cbf] hover:bg-[#0069d9] text-white font-bold text-sm flex items-center justify-center shadow-inner cursor-pointer select-none active:scale-95 hover:scale-105 transition-all flex-shrink-0"
          title={`Profile: ${user?.name}`}
        >
          S
        </div>
      </div>
    </header>
  );
};

export default Navbar;
