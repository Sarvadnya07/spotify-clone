import React, { useContext, useState, useRef } from "react";
import { PlayerContext } from "../context/PlayerContext";

// Enhanced SongItem component with richer UI feedback, animations,
// lazy-loading, accessible labels, and better performance handling.
const SongItem = ({ name, image, desc, id }) => {
  const { playWithId } = useContext(PlayerContext);

  // Local UI states
  const [isHover, setIsHover] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [pressed, setPressed] = useState(false);

  const itemRef = useRef(null);

  const handlePlay = () => {
    // small ripple-style feedback animation
    setPressed(true);
    setTimeout(() => setPressed(false), 120);

    // maintain original behaviour
    playWithId(id);
  };

  return (
    <div
      ref={itemRef}
      onClick={handlePlay}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="
        min-w-[180px]
        p-2
        px-3
        rounded
        cursor-pointer
        transition-all
        duration-200
        relative
        overflow-hidden
        group
        select-none
        hover:bg-[#ffffff26]
      "
      style={{
        transform: pressed ? "scale(0.96)" : "scale(1)",
        boxShadow: isHover ? "0 4px 14px rgba(0,0,0,0.3)" : "none",
      }}
      aria-label={`Play ${name}`}
      role="button"
      tabIndex={0}
    >

      {/* Image container with fade-in, skeleton, and hover zoom */}
      <div className="w-full h-[180px] overflow-hidden rounded relative">
        {/* Skeleton loader */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-[#333] animate-pulse rounded" />
        )}

        <img
          className={`
            rounded
            w-full
            h-full
            object-cover
            transition-all
            duration-300
            ${isHover ? "scale-110" : "scale-100"}
            ${imgLoaded ? "opacity-100" : "opacity-0"}
          `}
          src={image}
          alt={`${name} cover art`}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
        />

        {/* Play pulse effect on hover */}
        {isHover && (
          <div
            className="
              absolute
              inset-0
              bg-black/40
              flex
              items-center
              justify-center
              transition
              duration-200
            "
          >
            <div
              className="
                w-10
                h-10
                bg-green-500
                rounded-full
                flex
                items-center
                justify-center
                text-black
                font-bold
                text-lg
                opacity-90
                shadow-xl
                group-hover:scale-110
                transition-transform
                duration-200
              "
            >
              ▶
            </div>
          </div>
        )}
      </div>

      {/* Song name */}
      <p
        className="
          font-bold
          mt-2
          mb-1
          text-white
          truncate
          transition-all
          duration-200
        "
        title={name}
      >
        {name}
      </p>

      {/* Description */}
      <p
        className="
          text-slate-300
          text-sm
          leading-tight
          line-clamp-2
        "
        title={desc}
      >
        {desc}
      </p>

      {/* Focus ring for keyboard navigation */}
      <style>
        {`
          div:focus {
            outline: 2px solid #1db954;
            outline-offset: 4px;
          }
        `}
      </style>
    </div>
  );
};

export default SongItem;
