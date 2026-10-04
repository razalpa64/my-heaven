import { useEffect, useMemo, useRef, useState } from "react";
import type { MusicConfig, MusicTrack } from "../config/types";

/* ──────────────────────────────────────────────────────────────
   A romantic vintage record player.
   Supports full playlist, graceful fallbacks, safe-area insets,
   and elegant mobile drawer ergonomics.
   ────────────────────────────────────────────────────────────── */

export default function MusicPlayer({ music }: { music: MusicConfig }) {
  const tracks: MusicTrack[] = useMemo(() => {
    if (music.tracks && music.tracks.length > 0) return music.tracks;
    if (music.src) return [{ src: music.src, title: music.title ?? "untitled", artist: music.artist }];
    return [];
  }, [music]);

  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [open, setOpen] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [missing, setMissing] = useState(false);

  const track = tracks[index];

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  /* when the track changes while playing, keep playing */
  useEffect(() => {
    setMissing(false);
    const a = audioRef.current;
    if (!a || !track) return;
    a.load();
    if (playing) {
      a.play().catch(() => setPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  /* Close panel when clicking/tapping outside */
  useEffect(() => {
    if (!open) return;
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [open]);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a || !track) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      try {
        await a.play();
        setPlaying(true);
        setMissing(false);
      } catch {
        setMissing(true);
        setPlaying(false);
      }
    }
  };

  const step = (dir: 1 | -1) => {
    if (tracks.length < 2) return;
    setIndex((i) => (i + dir + tracks.length) % tracks.length);
  };

  return (
    <div
      ref={containerRef}
      className={`music ${open ? "music-open" : ""} ${playing ? "is-playing" : ""}`}
      aria-label="Music Player"
    >
      {track && (
        <audio
          ref={audioRef}
          src={track.src}
          preload="none"
          onEnded={() => {
            if (tracks.length > 1) {
              setIndex((i) => (i + 1) % tracks.length);
            } else {
              const a = audioRef.current;
              if (a) {
                a.currentTime = 0;
                a.play().catch(() => setPlaying(false));
              }
            }
          }}
          onError={() => {
            if (playing || open) setMissing(true);
            setPlaying(false);
          }}
        />
      )}

      {/* Floating Pop-up Music Card (always anchors neatly above button) */}
      <div className="music-panel" aria-hidden={!open}>
        <div className="music-panel-header">
          <div className="music-status-row">
            <span className="music-eq" aria-hidden="true">
              <span className={`music-eq-bar ${playing ? "bar-anim" : ""}`} />
              <span className={`music-eq-bar ${playing ? "bar-anim" : ""}`} />
              <span className={`music-eq-bar ${playing ? "bar-anim" : ""}`} />
            </span>
            <p className="label music-label">
              {playing ? "playing for you" : "our soundtrack"}
            </p>
          </div>
          <button
            type="button"
            className="music-close"
            onClick={() => setOpen(false)}
            aria-label="Close music panel"
          >
            ✕
          </button>
        </div>

        {track ? (
          <>
            <div className="music-track-info">
              <p className="serif music-title">“{track.title}”</p>
              {track.artist && <p className="music-artist">{track.artist}</p>}
            </div>

            {missing && (
              <p className="music-missing hand">
                this song hasn't arrived yet — drop the file into public/music
              </p>
            )}

            <div className="music-controls">
              <button
                type="button"
                className="label music-step"
                onClick={() => step(-1)}
                disabled={tracks.length < 2}
                aria-label="Previous song"
              >
                ‹ prev
              </button>

              <button
                type="button"
                className="music-play"
                onClick={toggle}
                aria-label={playing ? "Pause" : "Play"}
                aria-pressed={playing}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                  {playing ? (
                    <g fill="currentColor">
                      <rect x="6.5" y="5.5" width="3.5" height="13" rx="1" />
                      <rect x="14" y="5.5" width="3.5" height="13" rx="1" />
                    </g>
                  ) : (
                    <path
                      d="M8.5 5.5v13c0 .6.65.95 1.15.65l10-6.5a.75.75 0 0 0 0-1.3l-10-6.5A.75.75 0 0 0 8.5 5.5Z"
                      fill="currentColor"
                    />
                  )}
                </svg>
              </button>

              <button
                type="button"
                className="label music-step"
                onClick={() => step(1)}
                disabled={tracks.length < 2}
                aria-label="Next song"
              >
                next ›
              </button>
            </div>

            {tracks.length > 1 && (
              <p className="label music-count" aria-hidden="true">
                {index + 1} / {tracks.length}
              </p>
            )}

            <div className="music-volume-wrapper">
              <span className="label music-vol-icon" aria-hidden="true">
                vol
              </span>
              <input
                className="music-volume"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                aria-label="Volume"
              />
            </div>
          </>
        ) : (
          <div className="music-track-info">
            <p className="serif music-title">Silence, for now</p>
            <p className="music-missing hand">
              drop your songs into public/music and list them in gallery.json
            </p>
          </div>
        )}
      </div>

      {/* Floating Vinyl Button */}
      <button
        type="button"
        className={`music-btn ${playing ? "music-spinning" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close the music player" : "Open the music player"}
        aria-expanded={open}
      >
        {/* Radiating soundwave pulse when playing */}
        {playing && <span className="music-pulse-ring" aria-hidden="true" />}

        {/* Vinyl Disc Artwork */}
        <svg
          viewBox="0 0 48 48"
          width="42"
          height="42"
          aria-hidden="true"
          className="music-disc-svg"
        >
          <defs>
            <radialGradient id="vinyl-groove" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1a1214" />
              <stop offset="35%" stopColor="#2c1f23" />
              <stop offset="65%" stopColor="#1c1417" />
              <stop offset="100%" stopColor="#120c0e" />
            </radialGradient>
            <linearGradient id="vinyl-sheen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
              <stop offset="48%" stopColor="rgba(255,255,255,0)" />
              <stop offset="52%" stopColor="rgba(255,255,255,0.18)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <radialGradient id="center-label" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#b97878" />
              <stop offset="70%" stopColor="#7b3f46" />
              <stop offset="100%" stopColor="#53242a" />
            </radialGradient>
          </defs>

          {/* Vinyl Body */}
          <circle cx="24" cy="24" r="22" fill="url(#vinyl-groove)" stroke="#b99354" strokeWidth="0.8" />

          {/* Concentric Grooves */}
          <circle cx="24" cy="24" r="19" fill="none" stroke="#3d2c32" strokeWidth="0.5" opacity="0.75" />
          <circle cx="24" cy="24" r="16.5" fill="none" stroke="#251a1e" strokeWidth="0.6" opacity="0.8" />
          <circle cx="24" cy="24" r="14" fill="none" stroke="#48333b" strokeWidth="0.5" opacity="0.6" />
          <circle cx="24" cy="24" r="11.5" fill="none" stroke="#2b1c21" strokeWidth="0.5" opacity="0.7" />

          {/* Specular Light Reflection */}
          <circle cx="24" cy="24" r="22" fill="url(#vinyl-sheen)" />

          {/* Center Record Label */}
          <circle cx="24" cy="24" r="8.5" fill="url(#center-label)" stroke="#d4af37" strokeWidth="0.75" />
          <circle cx="24" cy="24" r="6.2" fill="none" stroke="#f6f1e8" strokeWidth="0.4" opacity="0.5" />

          {/* Center Spindle Hole / Heart Icon */}
          <circle cx="24" cy="24" r="2.2" fill="#faf6f0" />
        </svg>

        {/* Tiny romantic floating note indicator when paused */}
        {!playing && (
          <span className="music-idle-indicator" aria-hidden="true">
            ♪
          </span>
        )}
      </button>
    </div>
  );
}
