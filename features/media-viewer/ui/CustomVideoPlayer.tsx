"use client";

import { formatAttachmentName, getAvatarUrl } from "@/shared/lib";
import {
  ChevronsExpandUpRight,
  Pause,
  Play,
  Volume,
  VolumeFill,
  VolumeSlash,
} from "@gravity-ui/icons";
import { Button } from "@heroui/react";
import React, { useRef, useState } from "react";

interface CustomVideoPlayerProps {
  src: string;
  name?: string;
}

const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export function CustomVideoPlayer({ src, name }: CustomVideoPlayerProps) {
  const mediaUrl = getAvatarUrl(src) || src;
  const displayName = formatAttachmentName(name, src);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wasPlayingRef = useRef<boolean>(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !isScrubbing) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeekStart = () => {
    setIsScrubbing(true);
    wasPlayingRef.current = isPlaying;
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.muted = true;
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = Number(e.target.value);
    setCurrentTime(seekTime);
  };

  const handleSeekEnd = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = currentTime;
      videoRef.current.muted = isMuted;
      if (wasPlayingRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }
    setIsScrubbing(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      containerRef.current.requestFullscreen().catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className="relative w-full rounded-2xl overflow-hidden bg-black border border-border/60 group shadow-md flex items-center justify-center [&:fullscreen]:max-h-none [&:fullscreen]:h-screen [&:fullscreen]:w-screen [&:fullscreen]:rounded-none"
    >
      <video
        ref={videoRef}
        src={mediaUrl}
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        className="w-full h-full max-h-[500px] [&:fullscreen]:max-h-none [&:fullscreen]:h-full [&:fullscreen]:w-full object-contain cursor-pointer"
        playsInline
      />

      {!isPlaying && (
        <button
          type="button"
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-xs transition-all cursor-pointer z-10"
        >
          <div className="w-14 h-14 rounded-full bg-accent/90 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
            <Play className="w-7 h-7 ml-1 fill-current" />
          </div>
        </button>
      )}

      <div
        className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 flex flex-col gap-2 transition-opacity duration-200 z-20 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <input
          type="range"
          step="any"
          min={0}
          max={duration && !isNaN(duration) && isFinite(duration) ? duration : 100}
          value={currentTime}
          onMouseDown={handleSeekStart}
          onTouchStart={handleSeekStart}
          onChange={handleSeekChange}
          onMouseUp={handleSeekEnd}
          onTouchEnd={handleSeekEnd}
          aria-label="Video seek bar"
          className="w-full h-1.5 bg-white/30 accent-accent rounded-lg cursor-pointer transition-all"
        />

        <div className="flex items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onPress={togglePlay}
              className="p-1 h-8 w-8 min-w-0 rounded-lg text-white border-white/20 hover:bg-white/20 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 ml-0.5 fill-current" />}
            </Button>

            <div className="flex items-center gap-1.5 ml-1">
              <Button
                variant="outline"
                size="sm"
                onPress={toggleMute}
                className="p-1 h-7 w-7 min-w-0 rounded-lg text-white/80 border-transparent hover:bg-white/20 cursor-pointer"
              >
                {isMuted || volume === 0 ? (
                  <VolumeSlash className="w-4 h-4" />
                ) : volume > 0.5 ? (
                  <VolumeFill className="w-4 h-4 text-accent" />
                ) : (
                  <Volume className="w-4 h-4" />
                )}
              </Button>

              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                aria-label="Volume bar"
                className="w-16 h-1 bg-white/30 accent-accent rounded-lg cursor-pointer"
              />
            </div>

            <span className="text-xs font-mono text-white/80 ml-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {displayName && <span className="text-xs text-white/70 truncate max-w-[150px]">{displayName}</span>}
            <Button
              variant="outline"
              size="sm"
              onPress={toggleFullscreen}
              className="p-1 h-8 w-8 min-w-0 rounded-lg text-white border-white/20 hover:bg-white/20 cursor-pointer"
            >
              <ChevronsExpandUpRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
