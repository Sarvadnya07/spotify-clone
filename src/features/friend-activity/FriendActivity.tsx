import React, { memo } from "react";
import usePlayerStore from "../store/usePlayerStore";
import { useToastStore } from "../store/useToastStore";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";

/**
 * Elite Social Hub — Friend Activity Refined
 * - Replaced clashing avatars with professional stylized indicators.
 * - Improved typography and spacing for a cleaner social feed.
 */
const FriendActivity = () => {
  const { playWithId } = usePlayerStore();
  const { addToast } = useToastStore();

  const friends = [
    { name: "Alex", song: "Blinding Lights", artist: "The Weeknd", id: 0, color: "bg-indigo-500" },
    { name: "Sarah", song: "Levitating", artist: "Dua Lipa", id: 2, color: "bg-pink-500" },
    { name: "Mike", song: "Stay", artist: "Justin Bieber", id: 1, color: "bg-amber-500" },
  ];

  const handleJoin = (friendName: string, songId: number) => {
    playWithId(songId);
    addToast(`Syncing with ${friendName}...`, "success");
  };

  return (
    <div className="w-[300px] h-full hidden xl:flex flex-col bg-black/40 backdrop-blur-3xl border-l border-white/5 select-none relative z-40">
      <div className="p-8 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[9px] font-black tracking-[0.4em] text-gray-500 uppercase opacity-60">Social</span>
          <h2 className="font-bold text-sm text-white tracking-tight">Friend Activity</h2>
        </div>
        <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
          <img className="w-3 opacity-30" src={assets.plus_icon} alt="Invite" />
        </div>
      </div>

      <div className="flex-grow overflow-y-auto px-6 space-y-8 hide-scrollbar pb-32">
        {friends.map((friend, index) => (
          <motion.div
            key={friend.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative cursor-default"
          >
            <div className="flex gap-4">
              <div className="relative flex-shrink-0">
                <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-500 ${friend.color}`}>
                  <span className="text-sm font-black text-white/90">{friend.name[0]}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#1db954] border-[2.5px] border-black rounded-full shadow-lg" />
              </div>
              
              <div className="flex flex-col min-w-0 flex-grow">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[13px] text-gray-300 group-hover:text-white transition tracking-tight">{friend.name}</span>
                  <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest opacity-60">2m</span>
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <p className="text-[11px] font-bold text-[#1db954] truncate group-hover:translate-x-1 transition-transform">
                    {friend.song}
                  </p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider truncate opacity-40">
                    {friend.artist}
                  </p>
                </div>
                
                <button
                  onClick={() => handleJoin(friend.name, friend.id)}
                  className="mt-3 w-full py-2 rounded-xl bg-white text-black text-[9px] font-black tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:scale-105 active:scale-95 uppercase"
                >
                  Join Session
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {/* PROMO CARD */}
        <div className="mt-12 p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 text-center relative overflow-hidden group">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed relative z-10 opacity-60">
            Expand your circle.
          </p>
          <button className="mt-6 w-full py-3 rounded-2xl border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-2xl relative z-10">
            Find Friends
          </button>
        </div>
      </div>

      <div className="p-8 border-t border-white/5 bg-gradient-to-t from-black/40 to-transparent">
        <div className="flex items-center gap-3 opacity-30 hover:opacity-100 transition cursor-pointer group">
          <div className="w-2 h-2 rounded-full bg-[#1db954]" />
          <span className="text-[9px] font-black tracking-[0.3em] uppercase text-gray-400">Live Activity: On</span>
        </div>
      </div>
    </div>
  );
};

export default memo(FriendActivity);
