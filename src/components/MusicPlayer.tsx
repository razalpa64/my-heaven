import { useEffect, useMemo, useRef, useState } from "react";
import type { MusicConfig, MusicTrack } from "../config/types";

/* ──────────────────────────────────────────────────────────────
   A discreet record player in the corner. Supports a playlist:
   add songs to `music.tracks` in gallery.json and drop the files
   into public/music/. Never autoplays; advances to the next song
   when one ends; fails gently when a file hasn't been added yet.
   ────────────────────────────────────────────────────────────── */

export default function MusicPlayer({ music }: { music: MusicConfig }) {
  const tracks: MusicTrack[] = useMemo(() => {
    if (music.tracks && music.tracks.length > 0) return music.tracks;
    if (music.src) return [{ src: music.src, title: music.title ?? "untitled", artist: music.artist }];
    return [];
  }, [music]);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [open, setOpen] = useState(false);
  const [volume, setVolume] = useState(0.6);
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
    <div className={`music ${open ? "music-open" : ""}`}>
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

      <div className="music-panel" aria-hidden={!open}>
        {track ? (
          <>
            <p className="label music-label">{playing ? "now playing" : "paused"}</p>
            <p className="serif music-title">“{track.title}”</p>
            {track.artist && <p className="music-artist">{track.artist}</p>}
            {missing && (
              <p className="music-missing hand">
                this song hasn't arrived yet — drop the file into public/music
              </p>
            )}
            <div className="music-controls">
              <button
                className="label music-step"
                onClick={() => step(-1)}
                disabled={tracks.length < 2}
                aria-label="Previous song"
              >
                ‹ prev
              </button>
              <button className="music-play" onClick={toggle} aria-label={playing ? "Pause" : "Play"} aria-pressed={playing}>
                <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                  {playing ? (
                    <g fill="currentColor">
                      <rect x="7" y="6" width="3.2" height="12" rx="0.6" />
                      <rect x="13.8" y="6" width="3.2" height="12" rx="0.6" />
                    </g>
                  ) : (
                    <path d="M8 5.8v12.4c0 .5.55.8.98.54l9.3-6.2a.64.64 0 0 0 0-1.08l-9.3-6.2A.64.64 0 0 0 8 5.8Z" fill="currentColor" />
                  )}
                </svg>
              </button>
              <button
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
          </>
        ) : (
          <>
            <p className="label music-label">music</p>
            <p className="music-missing hand">
              no songs yet — drop .mp3 files into public/music and list them in gallery.json
            </p>
          </>
        )}
      </div>

      <button
        className={`music-btn ${playing ? "music-spinning" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close the music player" : "Open the music player"}
        aria-expanded={open}
      >
        <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" className="music-disc">
          <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.1" />
          <circle cx="12" cy="12" r="5.4" fill="none" stroke="currentColor" strokeWidth="0.55" opacity="0.5" />
          <circle cx="12" cy="12" r="1.7" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
}
