import React from 'react';
import usePlayerStore from "../../store/usePlayerStore";

const ErrorToast = () => {
  const { error, setError } = usePlayerStore();

  if (!error) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-3 animate-bounce">
      <span>⚠️ {error}</span>
      <button 
        onClick={() => setError(null)}
        className="bg-white/20 hover:bg-white/30 rounded-full w-6 h-6 flex items-center justify-center transition"
      >
        ✕
      </button>
    </div>
  );
};

export default ErrorToast;
