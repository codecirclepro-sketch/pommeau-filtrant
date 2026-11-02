"use client";

import { useEffect, useState } from "react";
import { NO_COUNT_KEY } from "@/lib/beacon";

/** Lets Nicolas leave his own visits out of the counts, on each browser he uses. */
export function NoCount() {
  const [off, setOff] = useState<boolean | null>(null);
  useEffect(() => {
    let value = false;
    try {
      value = localStorage.getItem(NO_COUNT_KEY) === "1";
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable in the browser
    setOff(value);
  }, []);
  if (off === null) return null;
  const toggle = () => {
    try {
      if (off) localStorage.removeItem(NO_COUNT_KEY);
      else localStorage.setItem(NO_COUNT_KEY, "1");
      setOff(!off);
    } catch {}
  };
  return (
    <p className="adm-nocount">
      {off ? "Vos visites sur ce navigateur ne sont pas comptées." : "Vos visites sur ce navigateur sont comptées."}{" "}
      <button type="button" onClick={toggle}>
        {off ? "Les compter à nouveau" : "Ne plus les compter"}
      </button>
    </p>
  );
}
