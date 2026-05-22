
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

  const modes = ['standard', 'studio', 'concert'] as const;

  const toggleMode = () => {
    if (!audioContext) return;
    const nextIndex = (modes.indexOf(mode) + 1) % modes.length;
    const newMode = modes[nextIndex];
    setMode(newMode);
    addToast(`Acoustics: ${newMode.charAt(0).toUpperCase() + newMode.slice(1)}`, 'info');
  };

  return (
    <button 
      onClick={toggleMode} 
      className={`p-1.5 transition-opacity ${mode !== 'standard' ? 'text-[#1ed760]' : 'opacity-70 hover:opacity-100'}`}
      title={`Acoustics: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`}
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        {mode === 'studio' && <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />}
        {mode === 'concert' && (
          <>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </>
        )}
      </svg>
    </button>
  );
};

export default SpatialControls;
