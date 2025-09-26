"use client";

import React, { useState } from "react";
import { SignProps } from "../utils/Interface";


export default function Sign({ email, password, setEmail, setPassword, emailError = false, passError = false, }: SignProps): React.ReactElement {
  const [toggle, setToggle] = useState<boolean>(false);

  return (
    <>
      <label className="mb-1 mt-6 block" htmlFor="email">
        E-mail
      </label>
      <input id="email"  className={`w-full px-3 py-3 leading-tight ${email && emailError ? "outline-2 -outline-offset-2 outline-red-500" : ""}`}
        onChange={(e) => setEmail(e.target.value)} value={email} type="email" autoComplete="email" required />
      <label className="mb-1 mt-3 block" htmlFor="password">
        Hasło
      </label>
      <div className="relative w-full">
        <div className="absolute inset-y-0 right-0 flex items-center px-2">
          <button type="button" className="cursor-pointer rounded px-2 py-1 text-sm shadow-none" onClick={() => setToggle((t) => !t)} aria-label={toggle ? "Ukryj hasło" : "Pokaż hasło"}>
            {toggle ? <i className="fa-regular fa-eye-slash" /> : <><span className="pr-2 text-xs">zobacz hasło</span><i className="fa-regular fa-eye" /></>}
          </button>
        </div>
        <input id="password" type={toggle ? "text" : "password"} className={`w-full px-3 py-3 leading-tight ${password && passError ? "outline-2 -outline-offset-2 outline-red-500" : ""}`}
          onChange={(e) => setPassword(e.target.value)} value={password} autoComplete="current-password" required />
      </div>
    </>
  );
}
