import React, { useRef, memo } from "react";
import DisplayHome from "../../pages/Home";
import { Route, Routes, useLocation } from "react-router-dom";
import DisplayAlbum from "../../pages/AlbumDetails";
import Search from "../../pages/Search";
import WeatherJournal from "../../features/weather/WeatherJournal";
import { AnimatePresence } from "framer-motion";

/**
 * Display Component - Weather Integrated
 * - Orchestrates route transitions for Home, Albums, Search, and the Weather Journal.
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
          <Route path="/journal" element={<WeatherJournal />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default memo(Display);
