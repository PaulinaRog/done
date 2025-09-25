"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Toast, ToastConf } from "@/app/services/Toast";

export default function UpdatePasswordPage(): React.ReactElement {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [password, setPassword] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);

  async function handleReset() {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      return ToastConf.fire({ icon: "error", title: "Błąd!", text: error.message });
    }
    Toast.fire({ icon: "success", title: "Hasło zaktualizowane" });
    router.replace("/");
  }

  return (
    <main className="mx-auto my-20 flex max-w-[90vw] flex-col rounded-xl border-2 border-acc-light shadow-md p-4 pb-10 sm:max-w-sm">
      <label className="mb-1 mt-6 block" htmlFor="password">
        Nowe hasło
      </label>

      <div className="relative w-full">
        <button type="button" className="absolute inset-y-0 right-0 px-3 text-sm shadow-none" onClick={() => setShow((s) => !s)} aria-label={show ? "Ukryj hasło" : "Pokaż hasło"}>
          {show ? <i className="fa-regular fa-eye-slash" /> : <i className="fa-regular fa-eye" />}
        </button>

        <input id="password" type={show ? "text" : "password"} className="w-full px-3 py-3 leading-tight"
          onChange={(e) => setPassword(e.target.value)} value={password} autoComplete="new-password" required/>
      </div>

      <button className="mt-10 rounded px-3 py-2 hover:bg-acc-light/20" type="button" onClick={handleReset}>
        Zapisz
      </button>
    </main>
  );
}
