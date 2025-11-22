import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/options";
import { recordProgress } from "@/controllers/progressController";
import { ensureCertificate } from "@/controllers/certificateController";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new NextResponse("Não autorizado", { status: 401 });
  }

  try {
    const body = await request.json();
    const result = await recordProgress(body, session.user.id);

    if (result.moduleCompleted) {
      await ensureCertificate(session.user.id, result.moduleId);
    }

    return NextResponse.json({ success: true, moduleCompleted: result.moduleCompleted });
  } catch (error) {
    console.error(error);
    return new NextResponse("Erro ao registrar progresso", { status: 400 });
  }
}
