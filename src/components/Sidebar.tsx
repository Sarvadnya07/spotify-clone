import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

/**
 * Enhanced Sidebar Component
 * - Features navigation to Home and Search routes.
 * - Library management placeholders.
 */
const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div
      className="w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex transition-all duration-200"
      role="navigation"
      aria-label="Main Sidebar"
    >
      {/* TOP SECTION */}
      <div className="bg-[#121212] h-[15%] rounded flex flex-col justify-around shadow-md">
        {/* Home */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 pl-8 cursor-pointer hover:bg-[#1f1f1f] py-3 transition rounded-t"
          tabIndex={0}
          role="button"
          aria-label="Home"
        >
          <img className="w-6" src={assets.home_icon} alt="Home Icon" />
          <p className="font-bold">Home</p>
        </div>

        {/* Search */}
        <div
          onClick={() => navigate("/search")}
          className="flex items-center gap-3 pl-8 cursor-pointer hover:bg-[#1f1f1f] py-3 transition rounded-b"
          tabIndex={0}
          role="button"
          aria-label="Search"
        >
          <img className="w-6" src={assets.search_icon} alt="Search Icon" />
          <p className="font-bold">Search</p>
        </div>
      </div>

      {/* MAIN LIBRARY AREA */}
      <div className="bg-[#121212] h-[85%] rounded overflow-hidden flex flex-col">
        {/* Library Header */}
        <div className="p-4 flex items-center justify-between border-b border-[#1f1f1f]">
          <div className="flex items-center gap-3">
            <img className="w-8" src={assets.stack_icon} alt="Library Icon" />
            <p className="font-semibold">Your Library</p>
          </div>
          <div className="flex items-center gap-3">
            <img className="w-5 cursor-pointer hover:opacity-70" src={assets.arrow_icon} alt="Expand" />
            <img className="w-5 cursor-pointer hover:opacity-70" src={assets.plus_icon} alt="Add" />
          </div>
        </div>

        {/* Scrollable Library Container */}
        <div className="flex-1 overflow-y-auto pr-2 mt-1">
          <div className="p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start gap-1 hover:bg-[#2e2e2e] transition shadow-lg">
            <h1>Create your first playlist</h1>
            <p className="font-light text-sm text-gray-400">It's easy, we'll help you</p>
            <button className="px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4 hover:scale-105 active:scale-95 transition">
              Create Playlist
            </button>
          </div>

          <div className="p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start gap-1 hover:bg-[#2e2e2e] transition shadow-lg mt-4">
            <h1>Let's find some podcasts to follow</h1>
            <p className="font-light text-sm text-gray-400">We'll keep you updated on new episodes</p>
            <button className="px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4 hover:scale-105 active:scale-95 transition">
              Browse Podcasts
            </button>
          </div>

          <div className="px-4 mt-6 opacity-80">
            <p className="text-[13px] tracking-wide uppercase font-bold text-gray-400">
              Your Favorites
            </p>
          </div>

          <div className="mt-2 pl-4 flex flex-col gap-4 pb-10">
            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80">
              <div className="w-10 h-10 rounded bg-gradient-to-br from-indigo-700 to-indigo-300 flex items-center justify-center">
                <span className="text-white text-lg">❤️</span>
              </div>
              <p className="text-sm font-medium">Liked Songs</p>
            </div>
            {/* Additional library items can be mapped here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
