"use client";

import { Suspense } from "react";
import { SuspenseWrapperProps } from "../utils/Interface";

export default function SuspenseWrapper({ children }: SuspenseWrapperProps) {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-[200px] w-full items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-acc-light border-t-transparent" />
                </div>
            }
        >
            {children}
        </Suspense>
    );
}
