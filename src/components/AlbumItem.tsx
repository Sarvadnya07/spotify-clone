import React, { useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface AlbumItemProps {
  image: string;
  name: string;
  desc: string;
  id: number;
}

/**
 * Modern Glass AlbumItem
 * - High-fidelity card layout with depth effects.
 * - Supports shared element transition patterns.
 */
const AlbumItem: React.FC<AlbumItemProps> = ({ image, name, desc, id }) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate(`/album/${id}`);
  }, [navigate, id]);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="min-w-[180px] p-4 rounded-2xl glass-card cursor-pointer group flex flex-col gap-3 select-none"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl shadow-2xl">
        <motion.img
          layoutId={`album-image-${id}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          src={image}
          alt={name}
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
          <div className="w-12 h-12 bg-[#1db954] rounded-full flex items-center justify-center text-black font-bold shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-300">
            ▶
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <motion.p 
          layoutId={`album-name-${id}`} 
          className="font-black text-sm text-white truncate tracking-tight"
        >
          {name}
        </motion.p>
        <p className="text-[11px] text-gray-500 font-medium line-clamp-2 leading-relaxed">
          {desc}
        </p>
      </div>
    </motion.div>
  );
};

export default memo(AlbumItem);
