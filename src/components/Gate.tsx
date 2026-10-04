import { FormEvent, useRef, useState } from "react";
import type { SiteConfig } from "../config/types";
import { verifyPassphrase, rememberUnlock, failureDelay } from "../utils/auth";
import Flourish from "./Flourish";

/* The front door. Quiet, like the first page of a letter left on a desk. */

export default function Gate({ site, onOpen, flowers }: { site: SiteConfig; onOpen: () => void; flowers?: boolean }) {
  const [value, setValue] = useState("");
  const [state, setState] = useState<"idle" | "checking" | "wrong" | "waiting" | "opening">("idle");
  const failures = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

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
      }, 600);
    }
  };

  return (
    <div className={`gate ${state === "opening" ? "gate-opening" : ""}`}>
      {flowers && <Flourish kind="stem" className="flor-gate" />}
      <div className="gate-inner">
        <p className="label gate-eyebrow">{site.eyebrow}</p>
        <h1 className="serif gate-title">
          This page is locked,
          <br />
          <em>the way some things should be.</em>
        </h1>
        <p className="gate-line hand">{site.privacyLine}</p>

        <form className="gate-form" onSubmit={submit} aria-label="Enter the passphrase">
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
            {state === "opening" && "Welcome in."}
          </p>
        </form>
      </div>
      <p className="gate-foot label">a private place · made by hand</p>
    </div>
  );
}
