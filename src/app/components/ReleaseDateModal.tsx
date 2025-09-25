"use client";

import { useRef, useState } from "react";
import type { ReleaseDateModalProps } from "../utils/Interface";

export default function ReleaseDateModal({ initialDate, minDate, maxDate, onClose, onSave }: ReleaseDateModalProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [saving, setSaving] = useState<boolean>(false);

    const initial = (initialDate ?? new Date().toISOString()).slice(0, 10);

    async function handleSave() {
        const v = inputRef.current?.value || initial;
        const iso = new Date(v).toISOString();
        setSaving(true);
        try {
            const ok = await onSave(iso);
            if (ok) onClose();
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-3">
            <div className="w-full max-w-xs rounded-xl bg-white p-4 shadow-soft">
                <h4 className="text-sm font-semibold text-txt-light">Zmień datę releasu</h4>
                <div className="mt-3">
                    <input type="date" ref={inputRef} defaultValue={initial} min={minDate} max={maxDate} className="w-full" />
                </div>
                <div className="mt-4 flex justify-end gap-2">
                    <button type="button" className="rounded-md border border-secondary-light px-3 py-1.5 text-sm text-txt-light hover:bg-secondary-light/60 disabled:opacity-60" 
                        onClick={onClose} disabled={saving}>Anuluj</button>
                    <button type="button" className="rounded-md border border-acc-light bg-acc-light px-3 py-1.5 text-sm text-bg-light hover:opacity-90 disabled:opacity-60" 
                        onClick={handleSave} disabled={saving}>{saving ? "Zapisywanie…" : "Zapisz"}</button>
                </div>
            </div>
        </div>
    );
}
