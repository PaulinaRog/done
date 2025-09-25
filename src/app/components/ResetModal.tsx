"use client";

import React, { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Toast, ToastConf } from "@/app/services/Toast";
import { Props } from "../utils/Interface";

export default function ResetModal({ modal, setModal }: Props): React.ReactElement | null {
  const [resetEmail, setResetEmail] = useState<string>("");
  const supabase = createClientComponentClient();

  const handleSendEmail = async () => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${location.origin}/konto/reset-hasla`,
    });

    if (data) {
      Toast.fire({ icon: "success", title: "E-mail został wysłany!", text: "Sprawdź swoją skrzynkę" });
    }
    if (error) {
      ToastConf.fire({ icon: "error", title: "Błąd!", text: error.message });
    }
  };

  if (!modal) return null;

  return (
    <div className="fixed left-1/2 top-1/2 z-20 h-[80vh] w-[90vw] -translate-x-1/2 -translate-y-1/2  rounded-xl border-2 border-secondary-light bg-bg-light sm:h-[50vh] lg:h-[70vh] lg:w-1/2">
      <i onClick={() => setModal(false)} className="fa-solid fa-xmark float-right p-5 cursor-pointer" />
      <div className="mx-auto my-20 w-[80vw] max-w-sm rounded-xl border-2 border-acc-light p-4 pb-10">
        <h2 className="text-xl">Resetowanie hasła</h2>
        <label className="mb-1 mt-6 block" htmlFor="resetEmail">
          E-mail podany przy rejestracji:
        </label>
        <input id="resetEmail" className="w-full px-3 py-3 leading-tight" onChange={(e) => setResetEmail(e.target.value)}
          value={resetEmail} type="email" autoComplete="email" required />
        <button className="mt-10 rounded px-3 py-2 hover:bg-acc-light/20" type="button" onClick={handleSendEmail} >
          Prześlij
        </button>
      </div>
    </div>
  );
}
