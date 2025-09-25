"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { UsersTableProps, UserWithRole, Role } from "../utils/Interface";
import { ROLE_LABELS } from "../utils/Interface";
import { updateUserRole } from "../data/api";
import { Toast, ToastConf } from "../services/Toast";

export default function UsersTable({ initial, canEdit }: UsersTableProps) {
    const supabase = createClientComponentClient();
    const [rows, setRows] = useState<UserWithRole[]>(initial);
    const [savingId, setSavingId] = useState<string | null>(null);

    async function onChangeRole(user_id: string, nextRole: Role) {
        try {
            setSavingId(user_id);
            setRows((prev) => prev.map((r) => (r.user_id === user_id ? { ...r, role: nextRole } : r)));
            await updateUserRole(supabase, user_id, nextRole);
            Toast.fire({ icon: "success", title: "Zmieniono rolę" });
        } catch (e: any) {
            setRows(initial);
            ToastConf.fire({ icon: "error", title: "Błąd zmiany roli", text: e?.message || String(e) });
        } finally {
            setSavingId(null);
        }
    }

    return (
        <div className="overflow-hidden rounded-xl border bg-white shadow-soft">
            <table className="min-w-full divide-y">
                <thead className="bg-secondary-light/40">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-txt-light/70">E-mail</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-txt-light/70">Rola</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {rows.map((r) => (
                        <tr key={r.user_id} className="hover:bg-secondary-light/40">
                            <td className="px-4 py-3 text-sm">{r.email}</td>
                            <td className="px-4 py-3">
                                <select
                                    value={r.role}
                                    disabled={!canEdit || savingId === r.user_id}
                                    onChange={(e) => onChangeRole(r.user_id, Number(e.target.value) as Role)}
                                    className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-60"
                                >
                                    <option value={1}>{ROLE_LABELS[1]}</option>
                                    <option value={2}>{ROLE_LABELS[2]}</option>
                                    <option value={3}>{ROLE_LABELS[3]}</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
