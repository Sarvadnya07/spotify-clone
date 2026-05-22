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
      className="group p-4 rounded-md bg-[#181818] hover:bg-[#282828] transition-all duration-300 cursor-pointer relative overflow-hidden will-change-transform active:scale-[0.98]"
    >
      <div className="relative mb-4 aspect-square overflow-hidden rounded shadow-md">
        <img 
          className="w-full h-full object-cover" 
          src={image} 
          alt={name} 
        />
        <div className="absolute inset-0 flex items-end justify-end p-2">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hover:scale-105 active:scale-95">
            <img className="w-4 brightness-0 ml-0.5" src={assets.play_icon} alt="Play" />
          </div>
        </div>
      </div>
      
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white truncate">{name}</p>
        <p className="text-xs text-text-muted truncate mt-1.5 font-normal">{desc}</p>
      </div>
    </div>
  );
};

export default memo(AlbumItem);
