"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Route } from "next";
import type { SprintSearchProps } from "../utils/Interface";

export default function SprintSearch({ initialQuery = "", initialOnly = false }: SprintSearchProps) {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();

    const [q, setQ] = useState<string>(initialQuery);
    const [only, setOnly] = useState<boolean>(initialOnly);

    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setQ(sp.get("q") ?? "");
        setOnly(sp.get("only") === "1");
    }, [sp]);

    function pushParams(next: { q?: string; only?: boolean }): void {
        const params = new URLSearchParams(sp.toString());
        if (typeof next.q !== "undefined") {
            const val = (next.q ?? "").trim();
            if (val) params.set("q", val); else params.delete("q");
        }
        if (typeof next.only !== "undefined") {
            if (next.only) params.set("only", "1"); else params.delete("only");
        }
        const qs = params.toString();
        const url = (qs ? `${pathname}?${qs}` : pathname) as Route;
        router.push(url, { scroll: false });
    }

    function onChangeQuery(val: string): void {
        setQ(val);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => pushParams({ q: val }), 500);
    }

    function onToggleOnly(): void {
        const next = !only;
        setOnly(next);
        pushParams({ only: next });
    }

    return (
        <div className="flex max-w-full items-center justify-between gap-3 md:justify-normal">
            <button type="button" aria-pressed={only} onClick={onToggleOnly} className={["inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm shadow-sm transition", only ? "border-acc-light bg-acc-light/10" : "border-secondary-light bg-white hover:bg-secondary-light/60"].join(" ")} 
                title="Pokaż tylko projekty z releasem">
                <i className={only ? "fa-solid fa-check" : "fa-regular fa-circle"} />
                <span>release</span>
            </button>
            <div className="relative">
                <input value={q} onChange={(e) => onChangeQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") pushParams({ q }); if (e.key === "Escape") onChangeQuery(""); }}
                    placeholder="Szukaj: projekt lub klient…" className="w-[55vw] rounded-lg border border-secondary-light bg-white py-2 pl-9 pr-8 text-sm text-txt-light shadow-soft placeholder:text-txt-light/50 lg:w-72"/>
                <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-txt-light/60" aria-hidden />
                {q && (
                    <button type="button" aria-label="Wyczyść" onClick={() => onChangeQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-txt-light/60 hover:text-txt-light">
                        <i className="fa-solid fa-xmark" />
                    </button>
                )}
            </div>
        </div>
    );
}
