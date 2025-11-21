import {
  createContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { songsData } from "../assets/assets";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
  const audioRef = useRef(null);
  const seekBg = useRef(null);
  const seekBar = useRef(null);

  const [track, setTrack] = useState(songsData[0]);
  const [playStatus, setPlayStatus] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const [time, setTime] = useState({
    currentTime: { second: 0, minute: 0 },
    totalTime: { second: 0, minute: 0 },
  });

  // Prevent rapid-fire updates (smooth progress bar + lower CPU)
  let lastUpdate = useRef(0);

  const updateTime = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || audio.duration === 0 || isNaN(audio.duration)) return;

    const now = Date.now();
    if (now - lastUpdate.current < 150) return;
    lastUpdate.current = now;

    const progress = audio.currentTime / audio.duration;

    if (seekBar.current) {
      seekBar.current.style.width = `${Math.floor(progress * 100)}%`;
    }

    setTime({
      currentTime: {
        second: Math.floor(audio.currentTime % 60),
        minute: Math.floor(audio.currentTime / 60),
      },
      totalTime: {
        second: Math.floor(audio.duration % 60),
        minute: Math.floor(audio.duration / 60),
      },
    });
  }, []);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio
      .play()
      .then(() => setPlayStatus(true))
      .catch(() => {
        /* autoplay block */
      });
  }, []);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setPlayStatus(false);
  }, []);

  // Enhanced playWithId with safe async loading
  const playWithId = useCallback(
    async (id) => {
      const audio = audioRef.current;
      if (!audio) return;

      pause();
      setIsReady(false);

      const newTrack = songsData[id];
      setTrack(newTrack);

      setTimeout(() => {
        if (!audioRef.current) return;
        audioRef.current.load();
      }, 50);

      setTimeout(() => {
        play();
        setIsReady(true);
      }, 100);
    },
    [pause, play]
  );

  // Click-to-seek handler
  const handleSeek = useCallback(
    (e) => {
      const audio = audioRef.current;
      if (!audio || !seekBg.current) return;

      const rect = seekBg.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;

      audio.currentTime = audio.duration * percentage;
      updateTime();
    },
    [updateTime]
  );

  // Volume control exists but optional (no UI needed)
  const setVolume = useCallback((val) => {
    if (!audioRef.current) return;
    audioRef.current.volume = Math.min(1, Math.max(0, val));
  }, []);

  // ontimeupdate handler
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => updateTime();
    const onLoaded = () => updateTime();

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
    };
  }, [updateTime]);

  // Auto pause playStatus sync
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playStatus) play();
    else pause();
  }, [playStatus, play, pause]);

  const contextValue = {
    audioRef,
    seekBar,
    seekBg,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    play,
    pause,
    playWithId,
    handleSeek,
    isReady,
    setVolume,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
