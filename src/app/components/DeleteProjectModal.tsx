"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { deleteProjectCompletely } from "@/app/data/api";
import { Toast, ToastConf } from "@/app/services/Toast";
import type { DeleteProjectModalProps } from "@/app/utils/Interface";

export default function DeleteProjectModal({ projectId, projectName, onClose, onDeleted }: DeleteProjectModalProps) {
    const supabase = createClientComponentClient();
    const [confirm, setConfirm] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    async function handleDelete() {
        try {
            setLoading(true);
            const res = await deleteProjectCompletely(supabase, projectId);
            Toast.fire({ icon: "success", title: "Projekt usunięty", text: `Usunięto powiązania: ${res.removedLinks}, changelogi: ${res.removedChangelogs}` });
            onDeleted();
            onClose();
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            ToastConf.fire({ icon: "error", title: "Błąd usuwania projektu", text: msg });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-soft">
                <h4 className="text-base font-semibold text-txt-light">Usuń projekt</h4>
                <p className="mt-2 text-sm text-txt-light/80">Tej operacji nie można cofnąć. Zniknie cała historia releasów i powiązania ze sprintami.</p>
                {projectName && <p className="mt-1 text-sm font-medium text-txt-light">Projekt: <span className="font-semibold">{projectName}</span></p>}
                <label className="mt-4 flex items-start gap-2 text-sm text-txt-light">
                    <input type="checkbox" className="mt-1 size-4 accent-red-500" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} />
                    <span>Chcę trwale usunąć ten projekt.</span>
                </label>
                <div className="mt-5 flex justify-end gap-2">
                    <button className="rounded-md px-3 py-1.5 text-sm" onClick={onClose} disabled={loading}>Anuluj</button>
                    <button className="rounded-md border border-red-500 bg-red-500 px-3 py-1.5 text-sm text-white disabled:opacity-60" disabled={!confirm || loading} onClick={handleDelete}>{loading ? "Usuwanie…" : "Usuń na zawsze"}</button>
                </div>
            </div>
        </div>
    );
}
