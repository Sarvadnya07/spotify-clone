import React, { memo } from "react";
import usePlayerStore from "../../store/usePlayerStore";
import { useToastStore } from "../../store/useToastStore";
import { assets, songsData } from "../../assets/assets";
import { motion, AnimatePresence } from "framer-motion";
import { socketService } from "../../services/SocketService";

/**
 * Enterprise Social Hub — Friend Activity Refined
 * - Formatted exactly like Spotify's right-hand active panel.
 * - Circular profile avatars with active indicator status.
 * - Normal casing and Spotify green interactive hover colors.
 */
const FriendActivity = () => {
  const { playWithId } = usePlayerStore();
  const { addToast } = useToastStore();

  const friends = [
    { name: "Alex", song: "Blinding Lights", artist: "The Weeknd", id: 0, color: "bg-indigo-600" },
    { name: "Sarah", song: "Levitating", artist: "Dua Lipa", id: 2, color: "bg-pink-600" },
    { name: "Mike", song: "Stay", artist: "Justin Bieber", id: 1, color: "bg-amber-600" },
  ];

  const [liveFriends, setLiveFriends] = React.useState(friends);

  React.useEffect(() => {
    const unsubscribe = socketService.on('SOCIAL_UPDATE', (data: { user: string, trackId: number }) => {
      setLiveFriends(prev => {
        const index = prev.findIndex(f => f.name === data.user);
        if (index === -1) return prev;
        
        const updated = [...prev];
        const song = songsData.find((s: any) => s.id === data.trackId);
        if (song) {
          updated[index] = { 
            ...updated[index], 
            song: song.name, 
            artist: song.desc.split('•')[0].trim() 
          };
        }
        return updated;
      });
      
      addToast(`${data.user} is now listening to new music!`, 'info');
    });

    return () => unsubscribe();
  }, [addToast]);

  const handleJoin = (friendName: string, songId: number) => {
    playWithId(songId);
    addToast(`Syncing with ${friendName}...`, "success");
  };

  return (
    <div className="w-[280px] h-full hidden xl:flex flex-col bg-[#121212] rounded-lg select-none relative z-40 flex-shrink-0">
      <div className="p-4 flex items-center justify-between">
        <h2 className="font-bold text-sm text-white tracking-tight hover:underline cursor-pointer">Friend Activity</h2>
        <div className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/5 text-[#b3b3b3] hover:text-white transition-colors cursor-pointer">
          <img className="w-3.5 opacity-70 invert" src={assets.plus_icon} alt="Invite" />
        </div>
      </div>

      <div className="flex-grow overflow-y-auto px-4 space-y-4 custom-scrollbar pb-24">
        <AnimatePresence>
          {liveFriends.map((friend, index) => (
            <motion.div
              key={friend.name}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              className="group relative cursor-default"
            >
              <div className="flex gap-3">
                <div className="relative flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md ${friend.color}`}>
                    <span className="text-xs font-bold text-white">{friend.name[0]}</span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#1ed760] border-2 border-[#121212] rounded-full" />
                </div>
                
                <div className="flex flex-col min-w-0 flex-grow">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-bold text-[12px] text-gray-200 group-hover:text-white transition-colors cursor-pointer hover:underline">{friend.name}</span>
                    <span className="text-[10px] text-[#b3b3b3] font-normal">Active</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <p className="text-[11px] text-[#b3b3b3] truncate font-normal hover:text-[#1ed760] hover:underline cursor-pointer">
                      {friend.song}
                    </p>
                    <p className="text-[10px] text-[#b3b3b3]/60 truncate font-normal hover:text-white hover:underline cursor-pointer mt-0.5">
                      {friend.artist}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleJoin(friend.name, friend.id)}
                    className="mt-2 w-full py-1.5 rounded-full bg-white hover:bg-[#f6f6f6] text-black text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-all duration-200 active:scale-95"
                  >
                    Join Session
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* PROMO CARD - Settings Info banner */}
        <div className="mt-4 p-4 rounded-lg bg-[#242424]/60 border border-white/5 text-left">
          <h3 className="text-xs font-bold text-white mb-1.5">Settings &gt; Display</h3>
          <p className="text-[11px] text-[#b3b3b3] leading-relaxed mb-4 font-normal">
            Show Friend Activity to see what your friends are listening to on Spotify.
          </p>
          <button className="w-full py-2 px-4 rounded-full bg-white hover:bg-[#f6f6f6] text-black text-xs font-bold transition-all active:scale-[0.98]">
            Find Friends
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[#b3b3b3]">
          <div className="w-2 h-2 rounded-full bg-[#1ed760]" />
          <span>Social Sync Active</span>
        </div>
      </div>
    </div>
  );
};

export default memo(FriendActivity);
