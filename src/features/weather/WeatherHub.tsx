import React, { memo } from 'react';
import usePlayerStore from '../../store/usePlayerStore';
import { motion } from 'framer-motion';

/**
 * Contextual Intelligence Hub
 * - Subdued, professional aesthetic for industry-grade presentation.
 * - Displays environment-music synchronization data.
 */
const WeatherHub = () => {
    const { currentWeather } = usePlayerStore();

    return (
        <div className="px-6 pt-6 pb-2">
            <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#a7a7a7] opacity-60">Engine</span>
                    <h3 className="text-xs font-bold text-white tracking-tight">Active Context</h3>
                </div>
                <div className={`w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-sm`}>
                    {currentWeather?.mood?.includes('Sun') ? '☀️' : '🌙'}
                </div>
            </div>

            <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] relative overflow-hidden">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xl font-bold tracking-tight text-white leading-none">
                            {currentWeather?.temp || 24}°
                        </span>
                        <span className="text-[10px] font-bold text-[#a7a7a7] uppercase tracking-widest mt-1">
                            {currentWeather?.city || 'Global'}
                        </span>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                        <span className={`text-[9px] font-bold uppercase tracking-wider text-white`}>
                            {currentWeather?.mood || 'Ready'}
                        </span>
                        <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 1.5 }}
                                className="h-full bg-white/20"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(WeatherHub);
