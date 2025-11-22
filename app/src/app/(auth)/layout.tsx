import type { ReactNode } from "react";


export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#05070e] to-black text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
        {children}
      </div>
    </div>
  );
}
