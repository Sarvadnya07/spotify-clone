import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import usePlayerStore from "../store/usePlayerStore";
import { useToastStore } from "../store/useToastStore";

interface SidebarProps {
  onShowShortcuts: () => void;
}

/**
 * Seamless Modern Sidebar
 * - Replaced rounded floating panels with a docked, edge-to-edge layout.
 * - Maintains glassmorphism but eliminates "void" gaps.
 */
const Sidebar: React.FC<SidebarProps> = ({ onShowShortcuts }) => {
  const navigate = useNavigate();
  const { playlists, createPlaylist } = usePlayerStore();
  const { addToast } = useToastStore();

  const handleCreatePlaylist = () => {
    createPlaylist("");
    addToast("Playlist created!", "success");
  };

  const NavItem = ({ icon, label, onClick, active = false }: any) => (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 px-6 py-3 cursor-pointer transition-all duration-300 group ${active ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
    >
      <img className={`w-5 transition-all ${active ? 'brightness-125' : 'opacity-60 group-hover:opacity-100'}`} src={icon} alt={label} />
      <span className="font-bold text-[14px] tracking-wide">{label}</span>
    </div>
  );

  return (
    <div
      className="w-[280px] h-full flex flex-col hidden lg:flex select-none border-r border-white/5 bg-black/20"
      role="navigation"
    >
      {/* NAVIGATION SECTION */}
      <div className="py-4 flex flex-col gap-1">
        <NavItem icon={assets.home_icon} label="Home" onClick={() => navigate("/")} active={window.location.pathname === '/'} />
        <NavItem icon={assets.search_icon} label="Search" onClick={() => navigate("/search")} active={window.location.pathname === '/search'} />
      </div>

      {/* LIBRARY SECTION */}
      <div className="flex-grow flex flex-col overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img className="w-5 opacity-60" src={assets.stack_icon} alt="Library" />
            <p className="font-black text-xs tracking-widest uppercase opacity-80 text-gray-400">Library</p>
          </div>
          <button 
            onClick={handleCreatePlaylist}
            className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center transition-all active:scale-90"
          >
            <img className="w-3" src={assets.plus_icon} alt="+" />
          </button>
        </div>

        {/* Scrollable Collections */}
        <div className="flex-1 overflow-y-auto px-2 pb-32 hide-scrollbar">
          <div className="mx-2 mb-4 p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition">
                <span className="text-lg">❤️</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[13px]">Liked Songs</span>
                <span className="text-[10px] text-gray-500 font-medium">Automatic Mix</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            {playlists.map((playlist) => (
              <div 
                key={playlist.id} 
                onClick={() => navigate(`/playlist/${playlist.id}`)}
                className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/5 transition-all cursor-pointer group"
              >
                <img className="w-10 h-10 rounded-md shadow-lg group-hover:scale-105 transition" src={playlist.image} alt={playlist.name} />
                <div className="flex flex-col min-w-0">
                  <p className="text-[13px] font-bold truncate text-gray-300 group-hover:text-white transition">{playlist.name}</p>
                  <p className="text-[10px] text-gray-500 truncate">Playlist • {playlist.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Command Center Footer */}
        <div className="mt-auto p-4 border-t border-white/5">
          <button 
            onClick={onShowShortcuts}
            className="w-full py-2 rounded-lg bg-white/5 text-[9px] font-black tracking-[0.2em] text-gray-500 hover:text-white transition-all uppercase"
          >
            Command Center
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
