import Link from "next/link";
import React from "react";
import type { Route } from "next";

export default function Footer() {
    return (
        <footer 
            className="fixed bottom-0 left-0 right-0 border-t border-gray-200 h-[50px] flex items-center justify-center text-xs md:text-sm text-gray-500 bg-white">
            <div className="flex justify-center gap-6">
                <Link href={"/polityka-prywatnosci" as Route} className="hover:underline">
                    Polityka prywatności
                </Link>
                <Link href={"/warunki" as Route} className="hover:underline">
                    Warunki korzystania z aplikacji
                </Link>
            </div>
        </footer>
    );
}
