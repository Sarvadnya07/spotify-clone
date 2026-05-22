
import React, { useState } from 'react';
import { audioContext } from '../hooks/useAudioEngine';
import { useToastStore } from '../../../store/useToastStore';

/**
 * SpatialControls
 * UI for controlling the 3D Spatial Audio and Normalization layers.
 * Styled natively to blend inside Spotify's control utility zone.
 */
const SpatialControls: React.FC = () => {
  const [mode, setMode] = useState<'standard' | 'studio' | 'concert'>('standard');
  const { addToast } = useToastStore();

  const setAcousticMode = (newMode: 'standard' | 'studio' | 'concert') => {
    if (!audioContext) return;
    setMode(newMode);
    addToast(`Acoustic Mode: ${newMode.charAt(0).toUpperCase() + newMode.slice(1)}`, 'info');
  };

  return (
    <div className="flex items-center gap-1.5 px-3 py-1 bg-[#242424] rounded-full">
      <span className="text-[11px] font-bold text-[#b3b3b3] mr-1">Acoustics</span>
      <button 
        onClick={() => setAcousticMode('standard')}
        className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${mode === 'standard' ? 'bg-[#1ed760] text-black' : 'text-[#b3b3b3] hover:text-white hover:bg-white/5'}`}
      >
        Standard
      </button>
      <button 
        onClick={() => setAcousticMode('studio')}
        className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${mode === 'studio' ? 'bg-[#1ed760] text-black' : 'text-[#b3b3b3] hover:text-white hover:bg-white/5'}`}
      >
        Studio
      </button>
      <button 
        onClick={() => setAcousticMode('concert')}
        className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${mode === 'concert' ? 'bg-[#1ed760] text-black' : 'text-[#b3b3b3] hover:text-white hover:bg-white/5'}`}
      >
        Concert
      </button>
    </div>
  );
};

export default SpatialControls;
