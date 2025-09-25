"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem, SidebarProps } from "../utils/Interface";

const baseItems: ReadonlyArray<NavItem> = [
    { href: "/", label: "Dashboard"},
    { href: "/projekty", label: "Zarządzanie projektami" }
 ];

export default function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();

    const items: ReadonlyArray<NavItem> = role === 3 ? [...baseItems, { href: "/uzytkownicy", label: "Użytkownicy" }] : baseItems;

    const isActive = (href: string) => {
        if (!pathname) return false;
        if (href === "/") return pathname === "/";
        return pathname === href || pathname.startsWith(`${href}/`);
    };

    return (
        <>
            <div className="max-w-full lg:hidden space-y-2 mt-2">
                {items.map(i => (
                    <Link key={i.href} href={i.href}
                        className={["inline-flex max-w-full items-center gap-2 rounded-lg border px-3 py-3 mx-2 text-sm shadow-sm",
                            "whitespace-nowrap text-ellipsis overflow-hidden",
                            "transition focus:outline-none focus-visible:ring-2 focus-visible:ring-acc-light/60",
                            isActive(i.href) ? "border-acc-light text-acc-light"
                                : "border-secondary-light text-txt-light hover:border-acc-light hover:text-acc-light"].join(" ")}>
                        <i className="fa-regular fa-rectangle-list text-[0.9em]" />
                        <span className="truncate">{i.label}</span>
                        <i className="fa-solid fa-chevron-right text-[0.85em] opacity-60" />
                    </Link>
                ))}
            </div>

            <aside className="sticky top-0 mb-10 mt-6 hidden h-[80vh] w-64 shrink-0 overflow-y-auto rounded-2xl border bg-white shadow-soft lg:block">
                <nav className="p-4">
                    <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-txt-light/70">
                        Nawigacja
                    </h3>
                    <ul className="space-y-1">
                        {items.map(i => (
                            <li key={i.href}>
                                <Link href={i.href}
                                    className={["block rounded-lg border px-3 py-2 text-sm transition",
                                        isActive(i.href) ? "border-acc-light bg-acc-light/10 text-acc-light"
                                            : "border-transparent text-txt-light hover:bg-secondary-light/60"].join(" ")}>
                                    {i.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
        </>
    );
}