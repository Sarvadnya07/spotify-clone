import React, { memo } from 'react';
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
      className="min-w-[170px] p-4 rounded-lg cursor-pointer bg-[#181818] hover:bg-[#282828] transition-all duration-300 group"
    >
      <div className="relative aspect-square mb-4 rounded-md overflow-hidden shadow-2xl">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover" 
          loading="lazy"
        />
        <div className="absolute bottom-2 right-2 w-10 h-10 bg-[#1db954] rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[12px] border-l-black border-b-[6px] border-b-transparent ml-1" />
        </div>
      </div>

      <div className="min-w-0">
        <p className="font-bold text-[14px] text-white truncate mb-1">{name}</p>
        <p className="text-[#a7a7a7] text-[12px] font-medium truncate">{desc}</p>
      </div>
    </div>
  );
};

export default memo(AlbumItem);
