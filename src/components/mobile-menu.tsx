"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "./icon";

/**
 * The menu of phones and tablets: a button of the header that opens the menu over the page. The panel is rendered
 * into <body>: inside the header, whose backdrop-filter traps fixed elements, it could not cover the screen.
 * Following a link, pressing Escape or tapping outside closes it.
 */
export function MobileMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const opener = button.current;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.add("menu-open");
    close.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("menu-open");
      opener?.focus();
    };
  }, [open]);

  return (
    <>
      <button ref={button} type="button" className="hd-burger" aria-expanded={open} aria-controls="menu-mobile" onClick={() => setOpen(true)}>
        <Icon name="menu" size={22} />
        <span className="sr-only">Menu</span>
      </button>
      {open &&
        createPortal(
          <div className="msheet" id="menu-mobile" role="dialog" aria-modal="true" aria-label="Menu">
            <div className="msheet-backdrop" onClick={() => setOpen(false)} />
            <div
              className="msheet-panel"
              onClick={(e) => {
                if ((e.target as HTMLElement).closest("a")) setOpen(false);
              }}
            >
              <div className="msheet-head">
                <span className="msheet-title">Menu</span>
                <button ref={close} type="button" className="msheet-close" onClick={() => setOpen(false)}>
                  <Icon name="close" size={22} />
                  <span className="sr-only">Fermer le menu</span>
                </button>
              </div>
              {children}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
