import React, { memo } from "react";
import { assets } from "../assets/assets";
import { useNavigate, useLocation } from "react-router-dom";
import usePlayerStore from "../store/usePlayerStore";
import { useToastStore } from "../store/useToastStore";
import WeatherHub from "./WeatherHub";

interface SidebarProps {
  onShowShortcuts: () => void;
}

/**
 * High-Performance Production Sidebar
 * - Granular Zustand subscriptions to prevent render bloat.
 * - Hardware-accelerated UI elements.
 */
const Sidebar: React.FC<SidebarProps> = ({ onShowShortcuts }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const playlists = usePlayerStore(state => state.playlists);
  const createPlaylist = usePlayerStore(state => state.createPlaylist);
  const addToast = useToastStore(state => state.addToast);

  const handleCreatePlaylist = () => {
    createPlaylist("New Playlist");
    addToast("New playlist created", "success");
  };

  const NavItem = memo(({ icon, label, onClick, path }: any) => {
    const isActive = location.pathname === path;
    const isEmoji = typeof icon === 'string' && icon.length <= 4;

    return (
      <div
        onClick={onClick}
        className={`flex items-center gap-4 px-6 py-2.5 cursor-pointer transition-colors group ${isActive ? 'text-white' : 'text-[#a7a7a7] hover:text-white'}`}
      >
        <div className={`w-6 flex items-center justify-center transition-transform duration-200 ${isActive ? 'scale-105' : 'group-hover:scale-105'}`}>
          {isEmoji ? (
            <span className="text-lg leading-none">{icon}</span>
          ) : (
            <img className={`w-5 h-5 object-contain ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`} src={icon} alt={label} />
          )}
        </div>
        <span className={`text-sm font-bold tracking-tight`}>{label}</span>
      </div>
    );
  });

  return (
    <aside
      className="w-[260px] h-full flex flex-col hidden lg:flex bg-[#000000] border-r border-white/5 select-none z-50 gpu"
      role="navigation"
    >
      <WeatherHub />

      <nav className="py-4 space-y-0.5">
        <NavItem icon={assets.home_icon} label="Home" onClick={() => navigate("/")} path="/" />
        <NavItem icon={assets.search_icon} label="Search" onClick={() => navigate("/search")} path="/search" />
        <NavItem icon="📖" label="Journal" onClick={() => navigate("/journal")} path="/journal" />
      </nav>

      <div className="flex-grow flex flex-col overflow-hidden px-2">
        <div className="px-4 py-4 flex items-center justify-between mt-2">
          <div className="flex items-center gap-3 opacity-60">
            <img className="w-5" src={assets.stack_icon} alt="L" />
            <p className="font-bold text-xs uppercase tracking-widest">Library</p>
          </div>
          <button onClick={handleCreatePlaylist} className="p-1.5 rounded-full hover:bg-white/5 transition-colors">
            <img className="w-3 opacity-60" src={assets.plus_icon} alt="+" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
          <div 
            onClick={() => navigate('/collection/tracks')}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/[0.05] cursor-pointer group transition-colors"
          >
            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-indigo-700 to-indigo-400 flex items-center justify-center shadow-lg">
              <span className="text-lg">❤️</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-white truncate">Liked Songs</span>
              <span className="text-[11px] text-white/40 font-medium">84 tracks</span>
            </div>
          </div>

          {playlists.map((playlist) => (
            <div 
              key={playlist.id} 
              onClick={() => navigate(`/playlist/${playlist.id}`)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/[0.05] transition-colors cursor-pointer group"
            >
              <img className="w-10 h-10 rounded-md object-cover border border-white/5" src={playlist.image} alt={playlist.name} />
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-bold truncate text-[#a7a7a7] group-hover:text-white transition">{playlist.name}</p>
                <p className="text-[11px] text-[#a7a7a7]/60 truncate font-medium">Playlist • {playlist.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 mt-auto">
        <button onClick={onShowShortcuts} className="w-full py-2.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-[#a7a7a7] hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest">
          Shortcuts
        </button>
      </div>
    </aside>
  );
};

export default memo(Sidebar);
