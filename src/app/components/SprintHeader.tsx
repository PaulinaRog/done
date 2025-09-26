"use client";

import Link from "next/link";
import { SprintHeaderProps } from "../utils/Interface";
import type { UrlObject } from "url";

export default function SprintHeader({ start, end, prevId, nextId, q, only, isCurrent = true }: SprintHeaderProps) {
  
  const hrefWithFilters = (id?: number | null): UrlObject => {
    if (!id) return { pathname: "#" };
    const query: Record<string, string> = { sprintId: String(id) };
    if (q?.trim()) query.q = q.trim();
    if (only) query.only = "1";
    return { pathname: "/", query };
  };

  return (
    <div role="group" className="mt-2 flex w-full max-w-full items-center gap-2 rounded-xl border border-secondary-light bg-white px-3 py-2 text-sm text-txt-light shadow-soft lg:max-w-[30vw]">
      <div className="shrink-0">
        <Link aria-label="Poprzedni sprint" href={hrefWithFilters(prevId)} className={`rounded-md border-none px-2 py-1 ${prevId ? "hover:bg-secondary-light/60" : "pointer-events-none opacity-30"}`}>
          <i className="fa-solid fa-chevron-left" />
        </Link>
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
        {isCurrent && <span className="shrink-0 font-semibold">Aktualny sprint</span>}
        {isCurrent && <span className="shrink-0 opacity-50">•</span>}
        <span className="truncate">{formatDate(start)} — {formatDate(end)}</span>
      </div>
      <div className="shrink-0">
        <Link aria-label="Następny sprint" href={hrefWithFilters(nextId)} className={`rounded-md border-none px-2 py-1 ${nextId ? "hover:bg-secondary-light/60" : "pointer-events-none opacity-30"}`}>
          <i className="fa-solid fa-chevron-right" />
        </Link>
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("pl-PL", { year: "numeric", month: "2-digit", day: "2-digit" });
  } catch {
    return iso;
  }
}
