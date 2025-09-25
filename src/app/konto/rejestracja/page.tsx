"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Toast, ToastConf } from "@/app/services/Toast";
import Sign from "@/app/components/Sign";

export default function SignUpPage(): React.ReactElement {
  const supabase = createClientComponentClient();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passError, setPassError] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const isValidEmail = useMemo(() => /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(email), [email]);
  const isValidPass = useMemo(() => /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/.test(password), [password]);

  async function handleSignUp() {
    setEmailError(!isValidEmail);
    setPassError(!isValidPass);
    if (!isValidEmail || !isValidPass) return;

    try {
      setSaving(true);

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      });

      if (error) {
        return ToastConf.fire({ icon: "error", title: "Błąd rejestracji", text: error.message });
      }

      Toast.fire({ icon: "success", title: "Zarejestrowano!", text: "Sprawdź skrzynkę i potwierdź e-mail." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto my-20 flex max-w-[90vw] flex-col rounded-xl border-2 border-acc-light shadow-lg p-4 pb-10 sm:max-w-sm">
      <h1 className="text-xl">Rejestracja</h1>

      <Sign email={email} password={password} setEmail={setEmail} setPassword={setPassword} emailError={emailError} passError={passError} />

      <div className="mt-3 flex flex-col text-xs text-red-600">
        {emailError && <span>Nieprawidłowy format email</span>}
        {passError && <span>Hasło: min. 8 znaków, 1 wielka litera, 1 znak specjalny, 1 cyfra.</span>}
      </div>

      <button className="mb-5 mt-6 rounded px-4 py-2 hover:bg-acc-light/20 disabled:opacity-60" type="button" onClick={handleSignUp} disabled={saving}>
        {saving ? "Rejestruję…" : "Zarejestruj"}
      </button>

      <div className="mt-10 text-center text-sm text-stone-500">
        <span className="mr-1">Masz już konto?</span>
        <Link href="/konto/logowanie" className="underline">Zaloguj się</Link>
      </div>
    </main>
  );
}
