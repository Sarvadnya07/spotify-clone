import React, { memo } from 'react';
import usePlayerStore from '../../store/usePlayerStore';

interface SongItemProps {
  name: string;
  image: string;
  desc: string;
  id: number;
}

/**
 * Top 1% High-Performance SongItem
 * - Decoupled from router during playback trigger for instant response.
 * - Hardware-accelerated hover effects.
 * - Minimalist render footprint.
 */
const SongItem: React.FC<SongItemProps> = ({ name, image, desc, id }) => {
  // Directly subscribe to the action to avoid extra navigation overhead
  const playWithId = usePlayerStore(state => state.playWithId);

  return (
    <div
      onClick={() => playWithId(id)}
      className="min-w-[170px] p-4 rounded-lg cursor-pointer bg-[#181818] hover:bg-[#282828] transition-all duration-300 group gpu"
    >
      <div className="relative aspect-square mb-4 rounded-md overflow-hidden shadow-2xl bg-[#121212]">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover will-change-transform" 
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 bg-[#1db954] rounded-full flex items-center justify-center shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-black border-b-[8px] border-b-transparent ml-1" />
          </div>
        </div>
      </div>
      
      <div className="min-w-0">
        <p className="font-bold text-[14px] text-white truncate mb-1 tracking-tight">{name}</p>
        <p className="text-[#a7a7a7] text-[12px] font-medium line-clamp-2 leading-snug">{desc}</p>
      </div>
    </div>
  );
};

export default memo(SongItem);
