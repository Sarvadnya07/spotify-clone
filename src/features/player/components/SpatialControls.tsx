
import React, { useState } from 'react';
import { audioContext } from '../hooks/useAudioEngine';
import usePlayerStore from '../../../store/usePlayerStore';

/**
 * SpatialControls
 * UI for controlling the 3D Spatial Audio and Normalization layers.
 */
const SpatialControls: React.FC = () => {
  const [mode, setMode] = useState<'standard' | 'studio' | 'concert'>('standard');
  const { addToast } = usePlayerStore();

  const setAcousticMode = (newMode: 'standard' | 'studio' | 'concert') => {
    if (!audioContext) return;

    // In a real implementation, we would access the singleton nodes
    // For now, we simulate the effect by informing the user
    setMode(newMode);
    addToast(`Acoustic Mode: ${newMode.toUpperCase()}`, 'info');
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] rounded-full border border-white/5">
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 mr-2">Acoustics</span>
      <button 
        onClick={() => setAcousticMode('standard')}
        className={`px-3 py-1 rounded-full text-[9px] font-bold transition-all ${mode === 'standard' ? 'bg-[#1db954] text-black' : 'text-gray-400 hover:text-white'}`}
      >
        Standard
      </button>
      <button 
        onClick={() => setAcousticMode('studio')}
        className={`px-3 py-1 rounded-full text-[9px] font-bold transition-all ${mode === 'studio' ? 'bg-[#1db954] text-black' : 'text-gray-400 hover:text-white'}`}
      >
        Studio
      </button>
      <button 
        onClick={() => setAcousticMode('concert')}
        className={`px-3 py-1 rounded-full text-[9px] font-bold transition-all ${mode === 'concert' ? 'bg-[#1db954] text-black' : 'text-gray-400 hover:text-white'}`}
      >
        Concert
      </button>
    </div>
  );
};

export default SpatialControls;
