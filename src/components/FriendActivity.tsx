import React from "react";
import usePlayerStore from "../store/usePlayerStore";
import { useToastStore } from "../store/useToastStore";
import { assets, songsData } from "../assets/assets";
import { motion } from "framer-motion";

/**
 * Modern Social Hub — Friend Activity
 * - Real-time "Listening Now" status.
 * - "Join Session" interactivity.
 * - High-fidelity glass styling.
 */
const FriendActivity = () => {
  const { playWithId } = usePlayerStore();
  const { addToast } = useToastStore();

  const friends = [
    { name: "Alex", song: "Blinding Lights", artist: "The Weeknd", id: 0, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
    { name: "Sarah", song: "Levitating", artist: "Dua Lipa", id: 2, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
    { name: "Mike", song: "Stay", artist: "Justin Bieber", id: 1, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" },
  ];

  const handleJoin = (friendName: string, songId: number) => {
    playWithId(songId);
    addToast(`You are now listening with ${friendName}!`, "success");
  };

  return (
    <div className="w-[280px] h-full hidden xl:flex flex-col bg-black/20 border-l border-white/5 select-none">
      <div className="p-6 flex items-center justify-between">
        <h2 className="font-black text-xs tracking-[0.3em] text-gray-500 uppercase">Friend Activity</h2>
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
          <img className="w-4 opacity-40" src={assets.plus_icon} alt="Invite" />
        </div>
      </div>

      <div className="flex-grow overflow-y-auto px-4 space-y-6 hide-scrollbar">
        {friends.map((friend, index) => (
          <motion.div
            key={friend.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative"
          >
            <div className="flex gap-4">
              <div className="relative">
                <img className="w-10 h-10 rounded-full border border-white/10" src={friend.avatar} alt={friend.name} />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#1db954] border-2 border-black rounded-full" />
              </div>
              
              <div className="flex flex-col min-w-0 flex-grow">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-gray-300 group-hover:text-white transition">{friend.name}</span>
                  <span className="text-[10px] text-gray-500">2m</span>
                </div>
                <p className="text-[11px] text-gray-500 truncate mt-0.5">
                  <span className="text-[#1db954] font-bold">{friend.song}</span> • {friend.artist}
                </p>
                
                {/* Interactive Join Button */}
                <button
                  onClick={() => handleJoin(friend.name, friend.id)}
                  className="mt-2 w-full py-1.5 rounded-lg bg-white/5 text-[10px] font-black tracking-widest text-[#1db954] opacity-0 group-hover:opacity-100 transition-all border border-[#1db95433] hover:bg-[#1db954] hover:text-black"
                >
                  JOIN SESSION
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Social Empty State */}
        <div className="mt-8 p-6 rounded-2xl glass-card text-center border-dashed border-white/5">
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Connect with Facebook to see what your friends are playing.
          </p>
          <button className="mt-4 px-6 py-2 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition">
            Connect
          </button>
        </div>
      </div>

      <div className="p-6 mt-auto border-t border-white/5">
        <div className="flex items-center gap-3 opacity-40 hover:opacity-100 transition cursor-pointer">
          <div className="w-2 h-2 rounded-full bg-[#1db954]" />
          <span className="text-[10px] font-bold tracking-widest uppercase">Live Activity On</span>
        </div>
      </div>
    </div>
  );
};

export default FriendActivity;
