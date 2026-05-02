import React, { useRef, memo } from "react";
import DisplayHome from "./DisplayHome";
import { Route, Routes, useLocation } from "react-router-dom";
import DisplayAlbum from "./DisplayAlbum";
import Search from "./Search";
import { AnimatePresence } from "framer-motion";

/**
 * Display Component - Modern Overhaul
 * - Removed legacy width constraints (w-[75%], w-[55%]) that caused layout gaps.
 * - Now fills the entire available flex-grow space provided by the App root.
 * - Optimized for a seamless, edge-to-edge glass experience.
 */
const Display: React.FC = () => {
  const displayRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  return (
    <div
      ref={displayRef}
      className="w-full h-full text-white flex flex-col relative transition-all duration-300"
    >
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<DisplayHome />} />
          <Route path="/album/:id" element={<DisplayAlbum />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default memo(Display);
