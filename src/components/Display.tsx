import React, {
  useRef,
  memo,
} from "react";
import DisplayHome from "./DisplayHome";
import { Route, Routes, useLocation } from "react-router-dom";
import DisplayAlbum from "./DisplayAlbum";
import Search from "./Search";
import { AnimatePresence } from "framer-motion";

/**
 * Display Component
 * Orchestrates route transitions and the global main container.
 */
const Display: React.FC = () => {
  const displayRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  return (
    <div
      ref={displayRef}
      className="w-full m-2 px-0 rounded bg-[#121212] text-white overflow-hidden lg:w-[75%] lg:ml-0 flex flex-col relative"
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
