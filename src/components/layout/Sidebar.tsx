import React, { memo } from "react";
import { assets } from "../../assets/assets";
import { useNavigate, useLocation } from "react-router-dom";
import usePlayerStore from "../../store/usePlayerStore";
import { useToastStore } from "../../store/useToastStore";
import WeatherHub from "../../features/weather/WeatherHub";
import { spotifyAuthService } from "../../services/SpotifyAuthService";

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
        className={`flex items-center gap-4 px-3 py-2.5 cursor-pointer transition-all duration-200 group rounded-md ${isActive ? 'bg-white/5 text-white font-semibold' : 'text-text-muted hover:text-white hover:bg-white/[0.02]'}`}
      >
        <div className="w-6 flex items-center justify-center">
          {isEmoji ? (
            <span className="text-lg leading-none">{icon}</span>
          ) : (
            <img className={`w-5 h-5 object-contain transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`} src={icon} alt={label} />
          )}
        </div>
        <span className="text-sm font-semibold transition-opacity duration-200">{label}</span>
      </div>
    );
  });

  return (
    <aside
      className="w-[260px] h-full flex flex-col gap-2 select-none relative z-40 bg-transparent flex-shrink-0"
      role="navigation"
    >
      {/* BOX 1: NAVIGATION */}
      <div className="bg-[#121212] rounded-lg p-5 flex flex-col gap-1">
        <NavItem icon={assets.home_icon} label="Home" onClick={() => navigate("/")} path="/" />
        <NavItem icon={assets.search_icon} label="Search" onClick={() => navigate("/search")} path="/search" />
        <NavItem icon="📖" label="Weather Journal" onClick={() => navigate("/journal")} path="/journal" />
      </div>

      {/* BOX 2: LIBRARY */}
      <div className="bg-[#121212] rounded-lg flex-1 flex flex-col min-h-0 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 text-text-muted hover:text-white transition cursor-pointer">
            <img className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity" src={assets.stack_icon} alt="L" />
            <p className="font-semibold text-sm">Your Library</p>
          </div>
          <button onClick={handleCreatePlaylist} className="p-1 rounded-full hover:bg-white/5 text-text-muted hover:text-white transition-all">
            <img className="w-3.5 h-3.5 opacity-70 hover:opacity-100 transition-opacity" src={assets.plus_icon} alt="+" />
          </button>
        </div>

        {/* WEATHER HUB STATUS */}
        <WeatherHub />

        <div className="flex-1 overflow-y-auto custom-scrollbar mt-2 space-y-1 pr-1">
          <div 
            onClick={() => navigate('/collection/tracks')}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-white/[0.05] cursor-pointer group transition-all duration-200"
          >
            <div className="w-12 h-12 rounded bg-gradient-to-br from-indigo-700 to-indigo-400 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-[1.02] transition-transform duration-200">
              <span className="text-lg">❤️</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-text-base truncate">Liked Songs</span>
              <span className="text-xs text-text-muted mt-0.5">Playlist • 84 songs</span>
            </div>
          </div>

          {playlists.map((playlist) => (
            <div 
              key={playlist.id} 
              onClick={() => navigate(`/playlist/${playlist.id}`)}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-white/[0.05] transition-all duration-200 cursor-pointer group"
            >
              <img className="w-12 h-12 rounded object-cover shadow flex-shrink-0 group-hover:scale-[1.02] transition-transform duration-200" src={playlist.image} alt={playlist.name} />
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-semibold truncate text-text-base">{playlist.name}</p>
                <p className="text-xs text-text-muted truncate mt-0.5">Playlist • {playlist.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-white/5 space-y-3 flex-shrink-0">
          {/* ELITE CONNECT — OAuth 2.0 PKCE */}
          <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/5 relative overflow-hidden group">
            <h3 className="text-xs font-semibold text-white mb-1">Spotify Connect</h3>
            <p className="text-[11px] text-text-muted mb-2.5 leading-relaxed">
              Link Spotify to sync your real library.
            </p>
            <button 
              onClick={() => spotifyAuthService.redirectToAuthCodeFlow()}
              className="w-full py-1.5 bg-white text-black hover:bg-[#e6e6e6] text-xs font-semibold rounded-full hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              Connect Account
            </button>
          </div>

          <button onClick={onShowShortcuts} className="w-full py-2 rounded-full bg-transparent hover:bg-white/5 border border-white/10 text-xs font-semibold text-[#b3b3b3] hover:text-white transition-all">
            Shortcuts
          </button>
        </div>
      </div>
    </aside>
  );
};

export default memo(Sidebar);
