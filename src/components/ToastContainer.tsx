import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToastStore } from '../store/useToastStore';

/**
 * ToastContainer Component
 * Renders active notifications with smooth Framer Motion transitions.
 */
const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className={`
              px-6 py-3 rounded-full shadow-2xl text-white text-sm font-bold pointer-events-auto cursor-pointer
              ${toast.type === 'success' ? 'bg-[#1db954]' : toast.type === 'error' ? 'bg-red-500' : 'bg-[#2e2e2e]'}
            `}
            onClick={() => removeToast(toast.id)}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
