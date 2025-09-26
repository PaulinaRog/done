"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/AuthProvider";

export default function NavbarUser(): React.ReactElement {
    const { user, signOut } = useAuth();
    const router = useRouter();

    if (!user) {
        return (
            <Link href="/konto/logowanie" className="inline-flex items-center gap-2 rounded-full border border-acc-light px-3 py-1.5 text-sm text-txt-dark hover:text-txt-dark hover:bg-acc-light transition">
                <i className="fa-solid fa-user text-txt-inverse text-[16px]" aria-hidden="true" />
                <span>Zaloguj się</span>
            </Link>
        );
    }

    const email = user.email ?? "Konto";
    const initials = email[0]?.toUpperCase() ?? "U";

    return (
        <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-acc-light text-txt-dark">
                {initials}
            </div>
            <span className="hidden text-sm text-txt-dark sm:inline">{email}</span>
            <button className="rounded border border-acc-light px-3 py-1.5 text-sm text-txt-dark hover:bg-acc-light hover:text-txt-dark transition shadow-shdw-dark"
                onClick={async () => {
                    await signOut();
                    router.replace("/konto/logowanie");
                }}>
                Wyloguj
            </button>
        </div>
    );
}
