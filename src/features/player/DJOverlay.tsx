import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import usePlayerStore from '../../store/usePlayerStore';
import { useAuthStore } from '../../store/useAuthStore';
import { aiDjService } from '../../services/AiDjService';

/**
 * Modern Glass DJOverlay - Weather Aware
 * - Now integrates environment intelligence into its narration logic.
 * - Freezes voice synthesis for Free users, provides atmospheric audio for Premium.
 */
const DJOverlay = () => {
  const { track, currentWeather, showDjOverlay, toggleDjOverlay } = usePlayerStore();
  const { user } = useAuthStore();
  const [commentary, setCommentary] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis || user?.tier !== 'Premium') return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Natural')) || voices[0];
    if (premiumVoice) utterance.voice = premiumVoice;

    utterance.pitch = 0.9;
    utterance.rate = 0.95;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [user?.tier]);

  useEffect(() => {
    if (!showDjOverlay) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const triggerDj = async () => {
      const text = await aiDjService.getCommentary(track, track, currentWeather);
      setCommentary(text);
      
      if (user?.tier === 'Premium') {
        setTimeout(() => speak(text), 800);
      }
    };

    triggerDj();

    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [showDjOverlay, track.id, speak, user?.tier, currentWeather]);

  return (
    <AnimatePresence>
      {showDjOverlay && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-28 right-6 z-[100] max-w-sm w-full px-4"
        >
          <div className="glass-panel p-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 relative overflow-hidden bg-[#181818]/95 backdrop-blur-xl">
            <div className={`absolute inset-0 bg-[#1db954] transition-opacity duration-1000 ${isSpeaking ? 'opacity-[0.05]' : 'opacity-0'}`} />

            {/* Dynamic Close Button */}
            <button 
              onClick={toggleDjOverlay}
              className="absolute top-4 right-4 w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center text-text-muted hover:text-white transition-colors cursor-pointer z-30"
              aria-label="Close DJ Overlay"
            >
              <span className="text-sm font-normal">✕</span>
            </button>

            <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#1db954] rounded-xl flex items-center justify-center shadow-xl border border-white/10 z-20">
              <span className="text-xl">{isSpeaking ? '🎙️' : '🎧'}</span>
            </div>
            
            <div className="flex flex-col gap-3 relative z-10 pl-4 mt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#1db954] tracking-[0.2em] uppercase">AI DJ ALEX</span>
                  {isSpeaking && (
                    <div className="flex gap-0.5 items-end h-3">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-0.5 bg-[#1db954] animate-[bounce_0.8s_infinite]" style={{ height: '100%', animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  )}
                </div>
                {currentWeather && (
                  <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20 mr-6">
                    Weather Aware
                  </span>
                )}
              </div>

              <p className="text-white font-medium text-sm leading-relaxed italic pr-2">
                "{commentary || "Synthesizing narration..."}"
              </p>
            </div>

            {user?.tier === 'Free' && (
              <div className="mt-4 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/20 ml-4">
                <p className="text-[10px] font-semibold text-cyan-300">Upgrade to Premium to hear Alex's smart weather voice insights!</p>
              </div>
            )}

            <div className="mt-5 flex items-center gap-4 pt-4 border-t border-white/5 relative z-10 ml-4">
              <img className="w-10 h-10 rounded shadow-md object-cover" src={track.image} alt="Cover" />
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-semibold text-[#b3b3b3] tracking-[0.15em] uppercase">ON DECK</span>
                <span className="text-xs font-semibold text-white truncate">{track.name}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DJOverlay;
