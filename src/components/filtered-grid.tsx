"use client";

import { Fragment, type ReactNode, useState } from "react";
import type { FilterKey } from "@/content/types";

export type Filter = { key: FilterKey; label: string; all: string };
export type FilterItem = { slug: string; price: number; values: Partial<Record<FilterKey, string[]>>; card: ReactNode };

const ORDERS = {
  "": { label: "Pertinence", compare: () => 0 },
  asc: { label: "Prix croissant", compare: (a: FilterItem, b: FilterItem) => a.price - b.price },
  desc: { label: "Prix décroissant", compare: (a: FilterItem, b: FilterItem) => b.price - a.price },
};

/**
 * Products under one row of choices per filter, with a count and a sort. The cards are rendered on the server and all
 * of them are in the HTML; a choice only hides the others, so the address and what search engines read stay the same.
 */
export function FilteredGrid({ filters = [], items }: { filters?: Filter[]; items: FilterItem[] }) {
  const [chosen, setChosen] = useState<Partial<Record<FilterKey, string>>>({});
  const [order, setOrder] = useState<keyof typeof ORDERS>("");
  // Whether an item passes every chosen filter, leaving out `skip` (to count the choices of that filter).
  const passes = (item: FilterItem, skip?: FilterKey) =>
    filters.every(({ key }) => key === skip || !chosen[key] || !!item.values[key]?.includes(chosen[key]));
  const shown = items.filter((i) => passes(i)).sort(ORDERS[order].compare);
  const active = filters.some(({ key }) => chosen[key]);
  const plural = (n: number) => `${n} produit${n > 1 ? "s" : ""}`;

  return (
    <>
      {filters.length > 0 && (
        <div className="filters">
          {filters.map(({ key, label, all }) => {
            const options = [...new Set(items.flatMap((i) => i.values[key] ?? []))];
            if (options.length < 2) return null;
            const pick = (value?: string) => setChosen((c) => ({ ...c, [key]: value }));
            return (
              <div key={key} className="filter-row" role="group" aria-label={label}>
                <span className="filter-label">{label}</span>
                <div className="filter-chips">
                  <button type="button" className="filter-chip" aria-pressed={!chosen[key]} onClick={() => pick(undefined)}>
                    {all}
                  </button>
                  {options.map((o) => {
                    const n = items.filter((i) => passes(i, key) && i.values[key]?.includes(o)).length;
                    const on = chosen[key] === o;
                    return (
                      <button
                        key={o}
                        type="button"
                        className="filter-chip"
                        aria-pressed={on}
                        disabled={!n && !on}
                        onClick={() => pick(on ? undefined : o)}
                      >
                        {o} <span className="filter-n">{n}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="grid-bar">
        <p className="grid-count" aria-live="polite">
          {active ? `${plural(shown.length)} sur ${items.length}` : plural(items.length)}
          {active && (
            <button type="button" className="filter-reset" onClick={() => setChosen({})}>
              Tout afficher
            </button>
          )}
        </p>
        {items.length > 1 && (
          <label className="grid-sort">
            <span>Trier par</span>
            <select value={order} onChange={(e) => setOrder(e.target.value as keyof typeof ORDERS)}>
              {Object.entries(ORDERS).map(([value, o]) => (
                <option key={value} value={value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      <div className="grid">
        {shown.map((i) => (
          <Fragment key={i.slug}>{i.card}</Fragment>
        ))}
      </div>
    </>
  );
}
