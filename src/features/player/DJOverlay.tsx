import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { assets } from '../../assets/assets';
import usePlayerStore from '../../store/usePlayerStore';
import { useAuthStore } from '../../store/useAuthStore';
import { aiDjService } from '../../services/AiDjService';

/**
 * Modern Glass DJOverlay - Weather Aware
 * - Now integrates environment intelligence into its narration logic.
 * - Freezes voice synthesis for Free users, provides atmospheric audio for Premium.
 */
const DJOverlay = () => {
  const { track, currentWeather } = usePlayerStore();
  const { user } = useAuthStore();
  const [commentary, setCommentary] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
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
      setTimeout(() => setIsVisible(false), 2000);
    };

    window.speechSynthesis.speak(utterance);
  }, [user?.tier]);

  useEffect(() => {
    const triggerDj = async () => {
      // 20% chance to trigger AI DJ
      if (Math.random() > 0.8) {
        // PASSING CURRENT WEATHER TO AI SERVICE
        const text = await aiDjService.getCommentary(track, track, currentWeather);
        setCommentary(text);
        setIsVisible(true);
        
        if (user?.tier === 'Premium') {
          setTimeout(() => speak(text), 1000);
        } else {
          setTimeout(() => setIsVisible(false), 6000);
        }
      }
    };

    triggerDj();
    
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [track.id, speak, user?.tier, currentWeather]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 100 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: 100 }}
          className="fixed bottom-32 right-10 z-[100] max-w-sm"
        >
          <div className="glass-panel p-6 rounded-3xl shadow-[0_20px_60px_rgba(29,185,84,0.4)] border border-[#1db95444] relative overflow-hidden">
            <div className={`absolute inset-0 bg-[#1db954] transition-opacity duration-1000 ${isSpeaking ? 'opacity-[0.08]' : 'opacity-0'}`} />

            <div className="absolute -top-6 -left-6 w-14 h-14 bg-[#1db954] rounded-2xl flex items-center justify-center shadow-2xl border-2 border-black z-20">
              <span className="text-2xl">{isSpeaking ? '🎙️' : '🎧'}</span>
            </div>
            
            <div className="flex flex-col gap-3 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-[#1db954] tracking-[0.3em] uppercase">AI DJ ALEX</span>
                  {isSpeaking && (
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-1 h-3 bg-[#1db954] animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                      ))}
                    </div>
                  )}
                </div>
                {currentWeather && (
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/20">
                    Weather Aware
                  </span>
                )}
              </div>

              <p className="text-white font-bold text-base leading-relaxed tracking-tight italic">
                "{commentary}"
              </p>
            </div>

            {user?.tier === 'Free' && (
              <div className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl border border-indigo-500/20">
                <p className="text-[10px] font-bold text-indigo-300">Upgrade to hear Alex's weather insights!</p>
              </div>
            )}

            <div className="mt-5 flex items-center gap-4 pt-4 border-t border-white/10 relative z-10">
              <img className="w-10 h-10 rounded-lg shadow-lg" src={track.image} alt="S" />
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-black text-gray-500 tracking-[0.2em] uppercase">ON DECK</span>
                <span className="text-xs font-bold text-white truncate">{track.name}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DJOverlay;
