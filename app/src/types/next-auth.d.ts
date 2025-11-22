import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: "ADMIN" | "EMPLOYEE";
    };
  }

  interface User {
    role: "ADMIN" | "EMPLOYEE";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "ADMIN" | "EMPLOYEE";
  }
}
