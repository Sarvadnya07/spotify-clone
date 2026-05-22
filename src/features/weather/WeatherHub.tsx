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
        <div className="pb-4 mb-2 border-b border-white/5 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
                <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-text-muted">Weather Context</span>
                    <h3 className="text-xs font-bold text-white">Smart Listening</h3>
                </div>
                <div className="w-7 h-7 rounded bg-white/5 border border-white/5 flex items-center justify-center text-sm">
                    {currentWeather?.mood?.includes('Sun') ? '☀️' : '🌙'}
                </div>
            </div>

            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-white leading-none">
                            {currentWeather?.temp || 24}°C
                        </span>
                        <span className="text-xs text-text-muted mt-1">
                            {currentWeather?.city || 'Global'}
                        </span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-medium text-primary">
                            {currentWeather?.mood || 'Ready'}
                        </span>
                        <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 1.5 }}
                                className="h-full bg-primary"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(WeatherHub);
