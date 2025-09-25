"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AuthState } from "@/app/utils/Interface";
import type { User } from "@supabase/supabase-js";

const AuthCtx = createContext<AuthState | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const supabase = useMemo(() => createClientComponentClient(), []);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            const { data } = await supabase.auth.getUser();
            if (!mounted) return;
            setUser(data.user ?? null);
            setLoading(false);
        })();
        return () => { mounted = false; };
    }, [supabase]);

    useEffect(() => {
        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => sub.subscription.unsubscribe();
    }, [supabase]);

    async function signOut() {
        await supabase.auth.signOut();
        setUser(null);
    }

    async function refresh() {
        const { data } = await supabase.auth.getUser();
        setUser(data.user ?? null);
    }

    const value: AuthState = { user, loading, signOut, refresh };
    return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth(): AuthState {
    const ctx = useContext(AuthCtx);
    if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
    return ctx;
}
