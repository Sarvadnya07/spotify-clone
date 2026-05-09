import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContextMenuProps {
  x: number;
  y: number;
  visible: boolean;
  onClose: () => void;
  options: {
    label: string;
    icon?: string;
    onClick: () => void;
    variant?: 'default' | 'danger';
  }[];
}

/**
 * ContextMenu Component
 * A premium, Spotify-style right-click menu.
 * Uses Framer Motion for smooth entry/exit.
 */
const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, visible, onClose, options }) => {
  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop to close on click outside */}
          <div 
            className="fixed inset-0 z-[100]" 
            onClick={onClose}
            onContextMenu={(e) => { e.preventDefault(); onClose(); }}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{ top: y, left: x }}
            className="fixed z-[101] min-w-[200px] bg-[#282828] border border-white/10 rounded shadow-2xl p-1"
          >
            {options.map((option, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  option.onClick();
                  onClose();
                }}
                className={`
                  w-full text-left px-3 py-2 text-sm font-medium rounded-sm flex items-center gap-3 transition-colors
                  ${option.variant === 'danger' ? 'text-red-500 hover:bg-red-500 hover:text-white' : 'text-gray-200 hover:bg-white/10 hover:text-white'}
                `}
              >
                {option.icon && <span>{option.icon}</span>}
                {option.label}
              </button>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContextMenu;
