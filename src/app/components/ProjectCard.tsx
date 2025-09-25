"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { fetchChangelogById, toggleRelease, updateReleaseDate, getMyRole } from "@/app/data/api";
import { Toast, ToastConf } from "@/app/services/Toast";
import ChangelogModal from "./ChangelogModal";
import ReleaseDateModal from "./ReleaseDateModal";
import type { ProjectCardProps } from "../utils/Interface";

export default function ProjectCard({ project, sprintId, link, sprintStart, sprintEnd }: ProjectCardProps) {
    const supabase = createClientComponentClient();

    const [canManage, setCanManage] = useState<boolean>(false);
    const [release, setRelease] = useState<boolean>(link.release);
    const [releaseDate, setReleaseDate] = useState<string | null>(link.release_date);
    const [changelog, setChangelog] = useState<{ id: number; version: string; date: string; changelog: any[] } | null>(null);
    const [chgOpen, setChgOpen] = useState<boolean>(false);
    const [dateOpen, setDateOpen] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            let role = await getMyRole(supabase);            
            if (role && (role === 2 || role === 3)){
            setCanManage(true);}
        })();
    },
    [supabase]);

    useEffect(() => {
        (async () => {
            if (!link.changelog_id) {
                setChangelog(null); return;
            }
            const data = await fetchChangelogById(supabase, link.changelog_id);
            if (data) setChangelog(data);
        })();
    },
    [supabase, link.changelog_id]);

    const showVersion = useMemo(() => (changelog ? changelog.version : "v?"), [changelog]);
    const showDate = useMemo(() => (changelog ? changelog.date : releaseDate ?? ""), [changelog, releaseDate]);

    async function onToggleRelease() {
        try {
            const on = !release;
            const err = await toggleRelease(supabase, { sprintId, projectId: Number(project.id), on, changelogId: link.changelog_id });
            if (err) throw err;
            setRelease(on);
            setReleaseDate(on ? new Date().toISOString() : null);
            if (!on) setChangelog(null);
            Toast.fire({ icon: "success", title: on ? "Release oznaczony" : "Release odznaczony" });
        } catch (e: any) {
            ToastConf.fire({ icon: "error", title: "Błąd zmiany release", text: e.message });
        }
    }

    useEffect(() => {
        setRelease(link.release);
        setReleaseDate(link.release_date ?? null);
        setChgOpen(false);
    }, [link.release, link.release_date, link.changelog_id, sprintId]);

    useEffect(() => {
        if (!link.changelog_id) {
            setChangelog(null); return;
        }
        (async () => {
            const data = await fetchChangelogById(supabase, link.changelog_id!);
            setChangelog(data);
        })();
    }, [supabase, link.changelog_id]);

    const minDate = sprintStart.slice(0, 10);
    const maxDate = new Date(new Date(sprintEnd).getTime() - 24 * 3600 * 1000).toISOString().slice(0, 10);

    function inHalfOpenRange(iso: string) {
        const t = new Date(iso).getTime();
        return t >= new Date(sprintStart).getTime() && t < new Date(sprintEnd).getTime();
    }

    return (
        <div className="flex h-full flex-col rounded-2xl border bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-base font-semibold leading-tight">{project.name}</h3>
                    {project.client && <div className="mt-1 text-xs text-gray-500">{project.client}</div>}
                </div>
                <span className={["inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs", release ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"].join(" ")}>
                    <span className="size-2 rounded-full bg-current opacity-60" />
                    {release ? "Release" : "Brak release"}
                </span>
            </div>

            <div className="mt-3 text-sm text-gray-600">
                {release ? (
                    <>
                        <div><span className="text-gray-500">Wersja:</span> {showVersion}</div>
                        <div>
                            <span className="text-gray-500">Data:</span>{" "}
                            {showDate ? (canManage ? (
                                <button type="button" className="cursor-pointer hover:opacity-80 shadow-none" 
                                    onClick={() => setDateOpen(true)}>{formatDate(showDate)}</button>
                            ) : (formatDate(showDate))) : "—"}
                        </div>
                    </>
                ) : (<div className="italic text-gray-500">W tym sprincie nie było releasu.</div>)}
            </div>

            {release && changelog && changelog.changelog?.length > 0 && (
                <details className="mt-3">
                    <summary className="cursor-pointer text-sm text-acc-light">Pokaż changelog</summary>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-800">
                        {changelog.changelog.map((item, i) => <li key={i}>{typeof item === "string" ? item : `${item.type.toUpperCase()} — ${item.description}`}</li>)}
                    </ul>
                </details>
            )}

            {release && (!changelog || (Array.isArray(changelog.changelog) && changelog.changelog.length === 0)) && (<p className="mt-3 text-sm text-txt-light/60">Brak changelogu</p>)}

            <div className="mt-auto flex flex-wrap gap-2 pt-4">
                {canManage && (
                    <>
                        <button onClick={onToggleRelease} className={["rounded-md border px-3 py-1.5 text-sm transition", 
                            release ? "border-acc-light bg-acc-light text-bg-light hover:opacity-90" : "border-acc-light text-acc-light hover:bg-acc-light/10"].join(" ")}>
                                {release ? "Wyłącz release" : "Oznacz release"}</button>
                        <button onClick={() => setChgOpen(true)} disabled={!release}
                            className="rounded-md border border-secondary-light px-3 py-1.5 text-sm text-txt-light disabled:opacity-50 hover:bg-secondary-light/60">Changelog</button>
                    </>
                )}
               {canManage && <Link href={`/projekty?edit=${project.id}`} className="rounded-md border border-secondary-light px-3 py-1.5 text-sm text-txt-light hover:bg-secondary-light/60">Edytuj projekt</Link>}
            </div>

            {chgOpen && (
                <ChangelogModal sprintId={sprintId} projectId={Number(project.id)} changelogId={link.changelog_id ?? null} 
                    onClose={() => setChgOpen(false)} onSaved={(chg) => { setChangelog(chg); if (!release) setRelease(true); if (!releaseDate) setReleaseDate(chg.date); }} />
            )}

            {dateOpen && (
                <ReleaseDateModal
                    initialDate={releaseDate ?? null}
                    minDate={minDate}
                    maxDate={maxDate}
                    onClose={() => setDateOpen(false)}
                    onSave={async (iso) => {
                        if (!inHalfOpenRange(iso)) {
                            const msg = `Data musi mieścić się w zakresie ${formatDate(sprintStart)} — ${formatDate(new Date(new Date(sprintEnd).getTime() - 24 * 3600 * 1000).toISOString())}`;
                            ToastConf.fire({ icon: "error", title: "Nieprawidłowa data releasu", text: msg });
                            return false;
                        }
                        await updateReleaseDate(supabase, { sprintId, projectId: Number(project.id), releaseDate: iso });
                        setRelease(true);
                        setReleaseDate(iso);
                        Toast.fire({ icon: "success", title: "Zmieniono datę releasu" });
                        return true;
                    }}
                />
            )}
        </div>
    );
}

function formatDate(iso: string) {
    try { return new Date(iso).toLocaleDateString("pl-PL", { year: "numeric", month: "2-digit", day: "2-digit" }); } catch { return iso; }
}
