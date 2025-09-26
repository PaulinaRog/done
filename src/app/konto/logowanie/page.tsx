"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Toast, ToastConf } from "@/app/services/Toast";
import Sign from "@/app/components/Sign";
import ResetModal from "@/app/components/ResetModal";
import { createUserRole } from "@/app/data/api";

export default function LoginPage(): React.ReactElement {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [modal, setModal] = useState<boolean>(false);
  const [_userId, setUserId] = useState<string>("");

  async function handleSignIn() {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      ToastConf.fire({icon: "error", title: error.message === "Invalid login credentials" ? "Błędne dane logowania" : error.message,});
      return;
    }

 const uid = data.user?.id ?? null;
      if (uid) {
        try {
          await createUserRole(supabase, uid, 1, email);
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e);
          console.log(msg)
        }
        setUserId(uid);
      }

    Toast.fire({ icon: "success", title: "Zalogowano pomyślnie" });
    router.push("/");
  }

  return (
    <main className="mx-auto my-20 max-w-[90vw] rounded-xl shadow-xl border-acc-light border-2 p-4 pb-10 sm:max-w-sm">
      <h1 className="text-xl">Logowanie</h1>

      <Sign email={email} password={password} setEmail={setEmail} setPassword={setPassword}/>

      <button className="mt-7 rounded px-3 py-2 hover:bg-acc-light/20" type="button" onClick={handleSignIn}>
        Zaloguj
      </button>

      <button className="mt-2 ml-5 self-end text-sm text-stone-500 hover:text-acc-light shadow-none" onClick={() => setModal(true)}type="button">
        Zapomniałeś hasła?
      </button>

      <div className="mt-10 text-center text-sm text-stone-500">
        <span className="mr-1">Nie masz jeszcze konta?</span>
        <Link href="/konto/rejestracja" className="underline">
          Zarejestruj się
        </Link>
      </div>

      <ResetModal modal={modal} setModal={setModal} />
    </main>
  );
}
