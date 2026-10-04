import { FormEvent, useEffect, useRef, useState } from "react";
import type { SiteConfig } from "../config/types";
import { verifyPassphrase, rememberUnlock, failureDelay } from "../utils/auth";
import Flourish from "./Flourish";

/* ──────────────────────────────────────────────────────────────
   The front door — a full-screen, cinematic love-letter gate.
   Staggers in beautifully. The passphrase field feels like
   writing a letter, not entering a password.
   ────────────────────────────────────────────────────────────── */

export default function Gate({ site, onOpen, flowers }: { site: SiteConfig; onOpen: () => void; flowers?: boolean }) {
  const [value, setValue] = useState("");
  const [state, setState] = useState<"idle" | "checking" | "wrong" | "waiting" | "opening">("idle");
  const [stage, setStage] = useState(0);
  const failures = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  /* staggered entrance — builds the scene piece by piece */
  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 300),
      setTimeout(() => setStage(2), 900),
      setTimeout(() => setStage(3), 1500),
      setTimeout(() => setStage(4), 2100),
      setTimeout(() => setStage(5), 2700),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (state === "checking" || state === "waiting" || state === "opening") return;
    setState("checking");
    const ok = await verifyPassphrase(value);
    if (ok) {
      rememberUnlock();
      setState("opening");
      window.setTimeout(onOpen, 900);
    } else {
      failures.current += 1;
      const wait = failureDelay(failures.current);
      setState("wrong");
      setValue("");
      window.setTimeout(() => {
        setState("waiting");
        window.setTimeout(() => {
          setState("idle");
          inputRef.current?.focus();
        }, wait);
      }, 500);
    }
  };

  const isOpening = state === "opening";

  return (
    <div className={`gate ${isOpening ? "gate-opening" : ""}`}>
      {flowers && <Flourish kind="stem" className="flor-gate" />}

      {/* Decorative large background monogram */}
      <div className="gate-bg-monogram" aria-hidden="true">❦</div>

      <div className="gate-inner">
        {/* Wax seal */}
        <div
          className="gate-seal"
          aria-hidden="true"
          style={{ opacity: stage >= 1 ? 1 : 0, transform: stage >= 1 ? "scale(1) rotate(0deg)" : "scale(0.4) rotate(-20deg)", transition: "opacity 1s ease, transform 1.2s cubic-bezier(0.2, 0.7, 0.2, 1)" }}
        >
          <span className="gate-seal-monogram sign">❦</span>
        </div>

        {/* eyebrow */}
        <p
          className="label gate-eyebrow"
          style={{ opacity: stage >= 2 ? 1 : 0, transform: stage >= 2 ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.9s ease 0s, transform 0.9s cubic-bezier(0.2,0.7,0.2,1) 0s" }}
        >
          {site.eyebrow}
        </p>

        {/* main title */}
        <h1
          className="serif gate-title"
          style={{ opacity: stage >= 2 ? 1 : 0, transform: stage >= 2 ? "none" : "translateY(16px)", transition: "opacity 1s ease 0.1s, transform 1s cubic-bezier(0.2,0.7,0.2,1) 0.1s" }}
        >
          This page is locked,
          <br />
          <em>the way some things should be.</em>
        </h1>

        {/* privacy hand-written line */}
        <p
          className="gate-line hand"
          style={{ opacity: stage >= 3 ? 1 : 0, transform: stage >= 3 ? "rotate(-1.2deg)" : "rotate(-1.2deg) translateY(10px)", transition: "opacity 1s ease, transform 1s cubic-bezier(0.2,0.7,0.2,1)" }}
        >
          {site.privacyLine}
        </p>

        {/* divider ornament */}
        <div
          className="gate-divider"
          aria-hidden="true"
          style={{ opacity: stage >= 3 ? 1 : 0, transition: "opacity 1.2s ease 0.2s" }}
        >
          <svg viewBox="0 0 180 16" fill="none" stroke="#B97878" strokeWidth="1" strokeLinecap="round">
            <path d="M0 8 H70 M110 8 H180" />
            <path d="M90 2 L96 8 L90 14 L84 8Z" fill="#B97878" fillOpacity="0.25" />
            <path d="M76 8 c-3 -6 -9 -2 -5 2 M104 8 c3 -6 9 -2 5 2" />
          </svg>
        </div>

        {/* passphrase form */}
        <form
          className="gate-form"
          onSubmit={submit}
          aria-label="Enter the passphrase"
          style={{ opacity: stage >= 4 ? 1 : 0, transform: stage >= 4 ? "none" : "translateY(14px)", transition: "opacity 1s ease, transform 1s cubic-bezier(0.2,0.7,0.2,1)" }}
        >
          <label className="label gate-label" htmlFor="gate-pass">
            the phrase, please
          </label>
          <div className="gate-row">
            <input
              id="gate-pass"
              ref={inputRef}
              type="password"
              autoComplete="current-password"
              className="gate-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={state === "checking" || state === "waiting" || state === "opening"}
              aria-invalid={state === "wrong"}
              aria-describedby="gate-status"
              placeholder="···"
            />
            <button
              className="gate-open label"
              type="submit"
              disabled={state === "checking" || state === "waiting" || state === "opening" || !value}
            >
              open
            </button>
          </div>
          <p id="gate-status" className="gate-status" role="status">
            {state === "wrong" && "That isn't it. Try again, gently."}
            {state === "waiting" && "One moment…"}
            {state === "opening" && "Welcome in. ❦"}
          </p>
        </form>
      </div>

      {/* footer */}
      <p
        className="gate-foot label"
        style={{ opacity: stage >= 5 ? 1 : 0, transition: "opacity 1.4s ease" }}
      >
        a private place · made by hand
      </p>
    </div>
  );
}
