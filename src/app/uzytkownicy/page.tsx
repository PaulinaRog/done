import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import EmptyState from "../components/EmptyState";
import { getMyRole, getAllUserRoles } from "../data/api";
import type { Role, UserWithRole, UserRoleProps } from "../utils/Interface";
import UsersTable from "./users-table";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
    const supabase = createServerComponentClient({ cookies });

    const myRole = await getMyRole(supabase);
    if (myRole !== 3) {
        return (
            <main className="mx-auto max-w-4xl p-6">
                <h1 className="mb-4 text-xl font-semibold text-txt-light">Użytkownicy</h1>
                <EmptyState title="Brak dostępu" subtitle="Ta sekcja jest dostępna tylko dla administratorów." />
            </main>
        );
    }

    const rows = await getAllUserRoles(supabase);
    const initial: UserWithRole[] = rows
        .map((r: UserRoleProps) => ({ user_id: r.user_id, email: r.email, role: r.role as Role }))
        .sort((a, b) => a.email.localeCompare(b.email));

    return (
        <main className="mx-auto max-w-4xl p-6">
            <h1 className="mb-4 text-xl font-semibold text-txt-light">Użytkownicy</h1>
            <UsersTable initial={initial} canEdit={true} />
        </main>
    );
}
