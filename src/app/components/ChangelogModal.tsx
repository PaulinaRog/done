"use client";

import { useEffect, useRef, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { addChangelogAndAttach, fetchChangelogById, updateChangelog } from "@/app/data/api";
import { Toast, ToastConf } from "@/app/services/Toast";
import { ChangelogModalProps, ChangelogRow } from "../utils/Interface";

export default function ChangelogModal({sprintId, projectId, changelogId, onClose, onSaved,}: ChangelogModalProps) {

    const supabase = createClientComponentClient();
    const versionRef = useRef<HTMLInputElement>(null);
    const changesRef = useRef<HTMLTextAreaElement>(null);

    const [saving, setSaving] = useState<boolean>(false);
    const [prefilling, setPrefilling] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            if (!changelogId) return;
            try {
                setPrefilling(true);
                const chg = await fetchChangelogById(supabase, changelogId);
                if (chg) {
                    if (versionRef.current) versionRef.current.value = chg.version ?? "";
                    const lines = Array.isArray(chg.changelog) ? chg.changelog.map((x: any) => typeof x === "string" ? x : x?.description ?? JSON.stringify(x)): [];
                    if (changesRef.current) changesRef.current.value = lines.join("\n");
                }
            } finally {
                setPrefilling(false);
            }
        })();
    }, [supabase, changelogId]);

    async function handleSave() {
        try {
            const version = versionRef.current?.value?.trim() ?? "";
            const lines = (changesRef.current?.value ?? "").split("\n").map((s) => s.trim()).filter(Boolean);

            if (lines.length === 0) {
                ToastConf.fire({ icon: "error", title: "Dodaj przynajmniej jedną zmianę" });
                return;
            }

            setSaving(true);

            let chg: ChangelogRow;
            if (changelogId) {
                chg = await updateChangelog(supabase, changelogId, version, lines);
                Toast.fire({ icon: "success", title: "Changelog zaktualizowany" });
            } else {
                chg = await addChangelogAndAttach(supabase, { sprintId, projectId, version, lines });
                Toast.fire({ icon: "success", title: "Changelog dodany" });
            }

            onSaved(chg);
            onClose();
        } catch (e: any) {
            ToastConf.fire({ icon: "error", title: "Błąd zapisu changeloga", text: e.message });
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-soft">
                <h4 className="text-base font-semibold text-txt-light">
                    {changelogId ? "Edytuj changelog" : "Dodaj changelog"}
                </h4>
                <div className="mt-3 space-y-3">
                    <div>
                        <label className="mb-1 block text-sm text-txt-light/80">Wersja</label>
                        <input ref={versionRef} className="w-full" placeholder="np. 1.4.0" disabled={prefilling} />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm text-txt-light/80">Lista zmian</label>
                        <textarea ref={changesRef} className="w-full p-2 rounded-md shadow-sm focus:outline-acc-light border-secondary-light"
                            rows={6} placeholder="- Dodano X&#10;- Naprawiono Y" disabled={prefilling} />
                    </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                    <button className="rounded-md px-3 py-1.5 text-sm" onClick={onClose} disabled={saving}>
                        Anuluj
                    </button>
                    <button onClick={handleSave} disabled={saving || prefilling}  className="rounded-md border border-acc-light bg-acc-light px-3 py-1.5 text-sm text-bg-light disabled:opacity-60" >
                        {saving ? "Zapisywanie…" : "Zapisz"}
                    </button>
                </div>
            </div>
        </div>
    );
}
