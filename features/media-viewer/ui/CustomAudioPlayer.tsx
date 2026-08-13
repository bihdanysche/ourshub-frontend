"use client";

import { formatAttachmentName, getAvatarUrl, parseAudioTags } from "@/shared/lib";
import { ArrowRotateRight, MusicNote, Volume, VolumeFill, VolumeSlash } from "@gravity-ui/icons";
import { Button } from "@heroui/react";
import React, { useEffect, useRef, useState } from "react";

interface CustomAudioPlayerProps {
  src: string;
  name?: string;
}

const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const AUDIO_PLAY_EVENT = "ourshub_audio_play";

function SolidPlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"}>
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86a1 1 0 0 0-1.5.86z" />
    </svg>
  );
}

function SolidPauseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"}>
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

export function CustomAudioPlayer({ src, name }: CustomAudioPlayerProps) {
  const mediaUrl = getAvatarUrl(src) || src;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wasPlayingRef = useRef<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const [discScale, setDiscScale] = useState(1.0);
  const [metadataTitle, setMetadataTitle] = useState<string | null>(null);

  // Parse ID3 Tags for title & artist with Cyrillic support
  useEffect(() => {
    let active = true;
    parseAudioTags(mediaUrl).then((tags) => {
      if (!active) return;
      if (tags?.title) {
        const fullStr = tags.artist ? `${tags.artist} - ${tags.title}` : tags.title;
        setMetadataTitle(fullStr);
      }
    });

    return () => {
      active = false;
    };
  }, [mediaUrl]);

  const displayName = metadataTitle || formatAttachmentName(name, src);

  // Setup Web Audio API Analyser for zero-latency sub-bass analysis
  const setupAudioContext = () => {
    if (!audioRef.current || audioCtxRef.current) return;

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const analyser = audioCtx.createAnalyser();

      analyser.fftSize = 64; // Fast low-latency FFT
      analyser.smoothingTimeConstant = 0.0; // ZERO smoothing for instant sharp kick transient response!

      const source = audioCtx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);

      audioCtxRef.current = audioCtx;
      analyserRef.current = analyser;
    } catch {
      // AudioContext fallback
    }
  };

  const updateBassRef = useRef<() => void>(() => {});

  useEffect(() => {
    updateBassRef.current = () => {
      const analyser = analyserRef.current;
      if (!analyser || !isPlaying || isScrubbing) {
        setDiscScale(1.0);
        animFrameRef.current = null;
        return;
      }

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);

      const rawBass = Math.max(dataArray[0] || 0, dataArray[1] || 0) / 255;

      if (rawBass > 0.3) {
        const powerBass = Math.pow((rawBass - 0.3) / 0.7, 1.8);
        const targetScale = 1.0 + powerBass * 0.22;
        setDiscScale(targetScale);
      } else {
        setDiscScale(1.0);
      }

      animFrameRef.current = requestAnimationFrame(() => updateBassRef.current());
    };
  }, [isPlaying, isScrubbing]);

  useEffect(() => {
    if (isPlaying && !isScrubbing) {
      setupAudioContext();
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      if (!animFrameRef.current) {
        animFrameRef.current = requestAnimationFrame(() => updateBassRef.current());
      }
    } else {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      requestAnimationFrame(() => setDiscScale(1.0));
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [isPlaying, isScrubbing]);

  // Stop other playing audio instances globally
  useEffect(() => {
    const handleGlobalPlay = (e: Event) => {
      const customEvent = e as CustomEvent<{ src: string }>;
      if (customEvent.detail?.src !== mediaUrl && audioRef.current) {
        audioRef.current.pause();
      }
    };

    window.addEventListener(AUDIO_PLAY_EVENT, handleGlobalPlay);
    return () => {
      window.removeEventListener(AUDIO_PLAY_EVENT, handleGlobalPlay);
    };
  }, [mediaUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      window.dispatchEvent(
        new CustomEvent(AUDIO_PLAY_EVENT, { detail: { src: mediaUrl } }),
      );
      audio.play().catch(() => {});
    }
  };

  const toggleLoop = () => {
    const nextLoop = !isLooping;
    setIsLooping(nextLoop);
    if (audioRef.current) {
      audioRef.current.loop = nextLoop;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && !isScrubbing) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeekStart = () => {
    setIsScrubbing(true);
    wasPlayingRef.current = isPlaying;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.muted = true;
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = Number(e.target.value);
    setCurrentTime(seekTime);
  };

  const handleSeekEnd = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = currentTime;
      audioRef.current.muted = isMuted;
      if (wasPlayingRef.current) {
        audioRef.current.play().catch(() => {});
      }
    }
    setIsScrubbing(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioRef.current.muted = nextMuted;
  };

  return (
    <div className="flex flex-col gap-3 p-4 sm:p-5 rounded-3xl bg-surface/40 border border-border/60 backdrop-blur-xl shadow-lg w-full relative overflow-hidden group">
      <audio
        ref={audioRef}
        src={mediaUrl}
        loop={isLooping}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        preload="metadata"
        crossOrigin="anonymous"
      />

      <div className="flex items-center gap-4 w-full">
        {/* Ultra-Sharp Instant Sub-Bass Reaction Scale Wrapper */}
        <div
          className="shrink-0 transition-transform duration-[40ms] ease-out"
          style={{ transform: `scale(${discScale})` }}
        >
          {/* Round Vinyl Record Disc (Freezes rotation when scrubbing or paused) */}
          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-accent/40 via-zinc-950 to-purple-900 border-2 border-accent/50 shadow-xl flex items-center justify-center relative overflow-hidden animate-spin ${
              isPlaying && !isScrubbing ? "" : "[animation-play-state:paused]"
            }`}
            style={{ animationDuration: "5s" }}
          >
            {/* Vinyl Record Grooves */}
            <div className="absolute inset-1.5 rounded-full border border-white/10" />
            <div className="absolute inset-3 rounded-full border border-white/10" />

            {/* Center Disc Hole */}
            <div className="w-5 h-5 rounded-full bg-zinc-900 border border-accent/60 flex items-center justify-center shadow-inner z-10">
              <MusicNote className="w-3 h-3 text-accent" />
            </div>
          </div>
        </div>

        {/* Info & Progress */}
        <div className="flex flex-col flex-1 min-w-0 gap-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-foreground truncate flex items-center gap-2">
              <MusicNote className="w-4 h-4 text-accent shrink-0" />
              <span className="truncate">{displayName}</span>
            </span>
            <span className="text-xs font-mono font-medium text-foreground/60 shrink-0">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* YouTube-Style Progress Slider (Freezes rotation while dragging, commits on release) */}
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
            aria-label="Track progress"
            className="w-full h-2 bg-border/40 accent-accent rounded-lg cursor-pointer transition-all"
          />
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          {/* Solid Filled Play/Pause Button */}
          <Button
            variant="primary"
            size="md"
            onPress={togglePlay}
            className="w-10 h-10 min-w-0 rounded-full p-0 flex items-center justify-center shrink-0 shadow-md cursor-pointer bg-accent text-accent-foreground hover:scale-105 active:scale-95 transition-transform"
          >
            {isPlaying ? (
              <SolidPauseIcon className="w-5 h-5 text-accent-foreground" />
            ) : (
              <SolidPlayIcon className="w-5 h-5 text-accent-foreground" />
            )}
          </Button>

          {/* Repeat Button */}
          <Button
            variant="outline"
            size="sm"
            onPress={toggleLoop}
            className={`w-9 h-9 min-w-0 rounded-xl p-0 flex items-center justify-center shrink-0 cursor-pointer border transition-colors ${
              isLooping
                ? "bg-accent/20 text-accent border-accent/40 shadow-xs"
                : "bg-surface-secondary/50 text-foreground/60 border-border/50 hover:bg-surface-secondary hover:text-foreground"
            }`}
            aria-label="Repeat track"
          >
            <ArrowRotateRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Volume & Mute */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onPress={toggleMute}
            className="w-8 h-8 min-w-0 rounded-xl p-0 text-foreground/70 hover:text-foreground bg-surface-secondary/50 border-border/50 hover:bg-surface-secondary cursor-pointer flex items-center justify-center"
          >
            {isMuted || volume === 0 ? (
              <VolumeSlash className="w-4 h-4 text-danger" />
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
            aria-label="Volume slider"
            className="w-16 h-1.5 bg-border/40 accent-accent rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
