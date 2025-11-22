'use client';

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="rounded-full border border-transparent px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 transition hover:border-slate-700 hover:text-white"
    >
      Sair
    </button>
  );
}
