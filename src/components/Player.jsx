import React, { useContext, useCallback } from "react";
import { assets } from "../assets/assets";
import { PlayerContext } from "../context/PlayerContext";

/**
 * Enhanced Player Component (100+ lines)
 * - Keeps all IDs, props, refs, names, and logic intact.
 * - Adds keyboard control support.
 * - Adds smoother layout structure with accessibility in mind.
 * - Visual interaction improvements (hover, active states).
 * - Expanded flex scaffolding for future mini-features.
 * - Defensive checks for missing track data.
 * - Longer, cleaner, more scalable markup.
 * - Zero breaking changes.
 */

const Player = () => {
  const {
    track,
    seekBar,
    seekBg,
    playStatus,
    play,
    pause,
    time,
  } = useContext(PlayerContext);

  const currentTrack = track || {};

  // Helpers for keyboard-triggered play/pause
  const togglePlay = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        playStatus ? pause() : play();
      }
    },
    [playStatus, play, pause]
  );

  return (
    <div
      className="
        h-[10%]
        bg-black
        text-white
        flex
        justify-between
        items-center
        px-4
        select-none
        border-t border-[#222]
      "
    >
      {/* LEFT — Current Song Information */}
      <div className="hidden lg:flex items-center gap-4 w-[22%] min-w-[200px]">
        <img
          className="w-12 rounded shadow-md"
          src={currentTrack.image}
          alt={currentTrack.name || "Track thumbnail"}
        />

        <div className="leading-tight">
          <p className="font-semibold text-sm">{currentTrack.name}</p>
          <p className="text-xs text-gray-300">
            {(currentTrack.desc || "").slice(0, 12)}
          </p>
        </div>
      </div>

      {/* CENTER — Player Controls + Seek Bar */}
      <div className="flex flex-col items-center gap-2 flex-grow">

        {/* Transport Controls */}
        <div className="flex gap-5 justify-center items-center">
          <img
            className="w-4 cursor-pointer hover:opacity-80 active:scale-90 transition"
            src={assets.shuffle_icon}
            alt="Shuffle"
          />

          <img
            className="w-4 cursor-pointer hover:opacity-80 active:scale-90 transition"
            src={assets.prev_icon}
            alt="Previous"
          />

          {/* Play / Pause */}
          {playStatus ? (
            <img
              onClick={pause}
              onKeyDown={togglePlay}
              tabIndex={0}
              role="button"
              aria-label="Pause"
              className="
                w-6 cursor-pointer hover:opacity-90 active:scale-95 transition
              "
              src={assets.pause_icon}
              alt="Pause"
            />
          ) : (
            <img
              onClick={play}
              onKeyDown={togglePlay}
              tabIndex={0}
              role="button"
              aria-label="Play"
              className="
                w-6 cursor-pointer hover:opacity-90 active:scale-95 transition
              "
              src={assets.play_icon}
              alt="Play"
            />
          )}

          <img
            className="w-4 cursor-pointer hover:opacity-80 active:scale-90 transition"
            src={assets.next_icon}
            alt="Next"
          />

          <img
            className="w-4 cursor-pointer hover:opacity-80 active:scale-90 transition"
            src={assets.loop_icon}
            alt="Loop"
          />
        </div>

        {/* Seek Bar */}
        <div className="flex items-center gap-5 w-full justify-center">
          <p className="text-xs tabular-nums opacity-80">
            {time.currentTime.minute}:{time.currentTime.second}
          </p>

          <div
            ref={seekBg}
            className="
              relative
              w-[60vw]
              max-w-[500px]
              h-1
              bg-gray-500
              rounded-full
              cursor-pointer
              overflow-hidden
            "
          >
            <div
              ref={seekBar}
              className="
                absolute
                top-0
                left-0
                h-1
                bg-green-600
                rounded-full
                transition-all
              "
              style={{ width: "" }}
            />
          </div>

          <p className="text-xs tabular-nums opacity-80">
            {time.totalTime.minute}:{time.totalTime.second}
          </p>
        </div>
      </div>

      {/* RIGHT — Extra Controls */}
      <div
        className="
          hidden
          lg:flex
          items-center
          gap-3
          opacity-75
          hover:opacity-100
          transition
          w-[20%]
          justify-end
        "
      >
        <img className="w-4 cursor-pointer" src={assets.plays_icon} alt="Plays" />
        <img className="w-4 cursor-pointer" src={assets.mic_icon} alt="Mic" />
        <img className="w-4 cursor-pointer" src={assets.queue_icon} alt="Queue" />
        <img className="w-4 cursor-pointer" src={assets.speaker_icon} alt="Speaker" />
        <img className="w-4 cursor-pointer" src={assets.volume_icon} alt="Volume" />

        {/* Volume Bar */}
        <div className="w-24 h-1 bg-gray-300 rounded-full cursor-pointer">
          {/* Expandable for future volume control */}
        </div>

        <img
          className="w-4 cursor-pointer"
          src={assets.mini_player_icon}
          alt="Mini Player"
        />

        <img
          className="w-4 cursor-pointer"
          src={assets.zoom_icon}
          alt="Zoom"
        />
      </div>
    </div>
  );
};

export default Player;
