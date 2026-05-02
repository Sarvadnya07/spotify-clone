import React, {
  useCallback,
  memo,
} from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * AlbumItem Component
 * Enhanced with Framer Motion for shared layout transitions.
 */
interface AlbumItemProps {
  image: string;
  name: string;
  desc: string;
  id: number;
}

const AlbumItem: React.FC<AlbumItemProps> = ({ image, name, desc, id }) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    if (id !== undefined) {
      navigate(`/album/${id}`);
    }
  }, [navigate, id]);

  return (
    <motion.div
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
      whileTap={{ scale: 0.95 }}
      className="min-w-[180px] p-4 rounded-lg cursor-pointer transition-colors duration-200 group"
      role="button"
      tabIndex={0}
      aria-label={name}
    >
      <div className="relative mb-4 shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
        <motion.img
          layoutId={`album-image-${id}`}
          className="rounded-md w-full aspect-square object-cover"
          src={image}
          alt={name}
        />
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute bottom-2 right-2 w-12 h-12 bg-[#1db954] rounded-full flex items-center justify-center shadow-xl text-black"
        >
          <span className="text-xl">▶</span>
        </motion.div>
      </div>

      <motion.p layoutId={`album-name-${id}`} className="font-bold text-white truncate mb-1">
        {name}
      </motion.p>
      <p className="text-gray-400 text-sm line-clamp-2 leading-snug">
        {desc}
      </p>
    </motion.div>
  );
};

export default memo(AlbumItem);
