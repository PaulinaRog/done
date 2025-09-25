"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Toast } from "@/app/services/Toast";

export default function AccountPage(): React.ReactElement | null {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [ready, setReady] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/konto/logowanie");
        return;
      }
      setEmail(user.email ?? null);
      setReady(true);
    })();
  }, [router, supabase]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    Toast.fire({ icon: "success", title: "Wylogowano" });
    router.replace("/konto/logowanie");
  }

  if (!ready) return null;

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">Witaj{email ? `, ${email}` : ""}</h1>
      <button onClick={handleSignOut} className="mt-4 rounded px-3 py-2">
        Wyloguj
      </button>
    </main>
  );
}
