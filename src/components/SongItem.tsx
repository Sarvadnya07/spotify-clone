import React, { useState } from "react";
import usePlayerStore from "../store/usePlayerStore";
import { motion } from "framer-motion";

interface SongItemProps {
  name: string;
  image: string;
  desc: string;
  id: number;
}

/**
 * Modern Glass SongItem
 * - Integrated glass-card styling with spring animations.
 * - Dynamic shadow and scale feedback.
 */
const SongItem: React.FC<SongItemProps> = ({ name, image, desc, id }) => {
  const { playWithId } = usePlayerStore();
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => playWithId(id)}
      className="min-w-[180px] p-4 rounded-2xl glass-card cursor-pointer group flex flex-col gap-3 select-none"
      role="button"
      tabIndex={0}
    >
      <div className="w-full aspect-square overflow-hidden rounded-xl relative shadow-2xl">
        {!imgLoaded && <div className="absolute inset-0 bg-white/5 animate-pulse" />}
        <img
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          src={image}
          alt={name}
          onLoad={() => setImgLoaded(true)}
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
          <div className="w-12 h-12 bg-[#1db954] rounded-full flex items-center justify-center text-black font-bold shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            ▶
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <p className="font-black text-sm text-white truncate leading-tight tracking-tight">{name}</p>
        <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed font-medium">{desc}</p>
      </div>
    </motion.div>
  );
};

export default SongItem;
