import React, { memo } from 'react';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

interface AlbumItemProps {
  image: string;
  name: string;
  desc: string;
  id: number;
}

/**
 * Industry-Grade AlbumItem
 * - Standardized grid item with high-fidelity finish.
 */
const AlbumItem: React.FC<AlbumItemProps> = ({ image, name, desc, id }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/album/${id}`)} 
      className="group p-4 rounded-lg bg-surface/60 hover:bg-white/[0.05] transition-all duration-200 cursor-pointer border border-white/5 relative overflow-hidden will-change-transform active:scale-[0.98]"
    >
      <div className="relative mb-4 aspect-square overflow-hidden rounded-md shadow-lg">
        <img 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
          src={image} 
          alt={name} 
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <img className="w-5 brightness-0 opacity-80" src={assets.play_icon} alt="View" />
          </div>
        </div>
      </div>
      
      <div className="space-y-1 min-w-0">
        <p className="text-sm font-black text-text-base truncate tracking-tight">{name}</p>
        <p className="text-[11px] font-bold text-text-muted truncate uppercase tracking-widest opacity-80">{desc}</p>
      </div>
    </div>
  );
};

export default memo(AlbumItem);
