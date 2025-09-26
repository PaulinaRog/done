"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { addProject, updateProjectDates, getProjectById, getSprintAttachmentCount } from "@/app/data/api";
import { isValidDateRange } from "../utils/date";
import { Toast, ToastConf } from "@/app/services/Toast";
import DeleteProjectModal from "../components/DeleteProjectModal";

export default function ProjectsManagement(): React.ReactElement {
    const supabase = createClientComponentClient();
    const sp = useSearchParams();
    const router = useRouter();

    const editIdParam = sp.get("edit");
    const editId = editIdParam ? Number(editIdParam) : null;
    const isEdit = Number.isFinite(editId);

    const nameRef = useRef<HTMLInputElement>(null);
    const clientRef = useRef<HTMLInputElement>(null);
    const startRef = useRef<HTMLInputElement>(null);
    const endRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [prefilledName, _setPrefilledName] = useState("");
    const [prefilling, setPrefilling] = useState<boolean>(isEdit as boolean);

    useEffect(() => {
        (async () => {
            if (!isEdit || !editId) return;
            try {
                setPrefilling(true);
                const data = await getProjectById(supabase, editId);
                if (!data) {
                    ToastConf.fire({ icon: "error", title: "Nie znaleziono projektu" });
                    return;
                }
                if (nameRef.current) nameRef.current.value = data.name ?? "";
                if (clientRef.current) clientRef.current.value = data.client ?? "";
                const s = data.project_start ? data.project_start.slice(0, 10) : "";
                const e = data.project_end ? data.project_end.slice(0, 10) : "";
                if (startRef.current) startRef.current.value = s;
                if (endRef.current) endRef.current.value = e;
            } catch (e: unknown) {
                const msg = e instanceof Error ? e.message : String(e);
                ToastConf.fire({ icon: "error", title: "Błąd pobierania projektu", text: msg });
            } finally {
                setPrefilling(false);
            }
        })();
    }, [isEdit, editId, supabase]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (prefilling) return;

        const name = nameRef.current?.value?.trim() || "";
        const client = clientRef.current?.value?.trim() || null;
        const projectStart = startRef.current?.value || "";
        const projectEnd = endRef.current?.value || "";

        if (!name || !isValidDateRange(projectStart, projectEnd)) {
            ToastConf.fire({ icon: "error", title: "Uzupełnij poprawnie dane" });
            return;
        }

        try {
            setLoading(true);

            if (isEdit && editId) {
                await updateProjectDates(supabase, { projectId: editId, name, client, startDate: projectStart, endDate: projectEnd });
                const count = await getSprintAttachmentCount(supabase, editId);
                Toast.fire({ icon: "success", title: "Projekt zaktualizowany", text: `Przypięty do ${count} sprintów` });
            } else {
                const projectId = await addProject(supabase, { name, client, project_start: projectStart, project_end: projectEnd });
                const count = await getSprintAttachmentCount(supabase, projectId);
                Toast.fire({ icon: "success", title: "Projekt dodany", text: `Przypięto do ${count} sprintów` });
                if (nameRef.current) nameRef.current.value = "";
                if (clientRef.current) clientRef.current.value = "";
                if (startRef.current) startRef.current.value = "";
                if (endRef.current) endRef.current.value = "";
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            ToastConf.fire({ icon: "error", title: isEdit ? "Błąd aktualizacji projektu" : "Błąd dodawania projektu", text: msg });
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="rounded-2xl border border-secondary-light bg-white p-6 shadow-soft">
            <h1 className="text-xl font-semibold text-txt-light">{isEdit ? "Edytuj projekt" : "Dodaj projekt do sprintów"}</h1>
            <form onSubmit={handleSubmit} className="mt-4 grid max-w-lg gap-4">
                <div>
                    <label htmlFor="name" className="mb-1 block text-sm text-txt-light/80">Nazwa projektu *</label>
                    <input id="name" ref={nameRef} className="w-full" required disabled={prefilling} />
                </div>
                <div>
                    <label htmlFor="client" className="mb-1 block text-sm text-txt-light/80">Klient (opcjonalnie)</label>
                    <input id="client" ref={clientRef} className="w-full" disabled={prefilling} />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="projectStart" className="mb-1 block text-sm text-txt-light/80">Start projektu *</label>
                        <input id="projectStart" type="date" ref={startRef} className="w-full" required disabled={prefilling} />
                    </div>
                    <div>
                        <label htmlFor="projectEnd" className="mb-1 block text-sm text-txt-light/80">Koniec projektu *</label>
                        <input id="projectEnd" type="date" ref={endRef} className="w-full" required disabled={prefilling} />
                    </div>
                </div>
                <div className="mt-2 flex gap-3">
                    <button type="submit" disabled={loading || prefilling} className="rounded-lg border border-acc-light bg-acc-light px-4 py-2 text-bg-light hover:opacity-90 disabled:opacity-60">
                        {loading ? "Zapisywanie…" : isEdit ? "Zapisz zmiany" : "Dodaj projekt"}
                    </button>
                    {isEdit && (
                        <button type="button" onClick={() => setDeleteOpen(true)} className="rounded-md border border-red-500 bg-red-500 px-3 py-2 text-sm text-white hover:opacity-90">
                            Usuń projekt
                        </button>
                    )}
                </div>
            </form>

            {deleteOpen && isEdit && editId && (
                <DeleteProjectModal
                    projectId={editId}
                    projectName={prefilledName}
                    onClose={() => setDeleteOpen(false)}
                    onDeleted={() => { router.replace("/"); }}
                />
            )}
        </section>
    );
}
