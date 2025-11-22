import { authOptions } from "@/auth/options";
import { getServerSession } from "next-auth";

export const getSession = () => getServerSession(authOptions);
