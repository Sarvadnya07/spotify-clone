import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * ShortcutsModal Component
 * Displays global keyboard controls for accessibility and power users.
 * Features a sleek dark glassmorphism design.
 */
const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  const shortcuts = [
    { key: "Space", desc: "Play / Pause" },
    { key: "L", desc: "Toggle Like" },
    { key: "M", desc: "Mute / Unmute" },
    { key: "← / →", desc: "Seek Backward / Forward" },
    { key: "↑ / ↓", desc: "Volume Up / Down" },
    { key: "?", desc: "Toggle this help menu" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] cursor-pointer"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-[#282828] rounded-xl shadow-2xl z-[101] overflow-hidden border border-white/10"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black">Keyboard Shortcuts</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition">✕</button>
              </div>

              <div className="space-y-4">
                {shortcuts.map((s, i) => (
                  <div key={i} className="flex justify-between items-center group">
                    <span className="text-gray-400 font-medium group-hover:text-gray-200 transition-colors">{s.desc}</span>
                    <kbd className="px-3 py-1 bg-black/40 rounded border border-white/10 font-mono text-sm text-[#1db954] shadow-inner">
                      {s.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black/20 p-4 text-center">
              <p className="text-xs text-gray-500">Press <span className="text-[#1db954]">?</span> anywhere to toggle this menu</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShortcutsModal;
