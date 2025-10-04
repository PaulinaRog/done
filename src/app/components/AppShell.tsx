"use client";

import { useAuth } from "@/app/components/AuthProvider";
import { usePathname } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import { useEffect, useMemo, useState } from "react";
import { getMyRole } from "@/app/data/api";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Role } from "../utils/Interface";

export default function AppShell({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const pathname = usePathname();
    const isAuthPage = pathname.startsWith("/konto");
    const supabase = createClientComponentClient();

    const [role, setRole] = useState<Role | null>(null);

    useEffect(() => {
        let alive = true;

        if (loading) {
            setRole(null);
            return;
        }
        if (!user?.id) {
            setRole(null);
            return;
        }

        (async () => {
            try {
                const r = (await getMyRole(supabase)) as Role | null;
                if (alive) setRole(r ?? 1);
            } catch {
                if (alive) setRole(1);
            }
        })();

        return () => {
            alive = false;
        };
    }, [user?.id, loading, supabase]);

    const canManage = useMemo(() => role === 2 || role === 3, [role]);

    return (
        <div className="mx-auto md:flex max-w-7xl gap-6 px-4 lg:py-12 py-2">
            {!isAuthPage && role !== null && canManage && <Sidebar role={role} />}
            <main className="flex-1">{children}</main>
        </div>
    );
}
