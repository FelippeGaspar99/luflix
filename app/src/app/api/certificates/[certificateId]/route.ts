import path from "path";
import fs from "fs/promises";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/options";
import { prisma } from "@/lib/prisma";

interface RouteProps {
  params: Promise<{ certificateId: string }>;
}

export async function GET(_: Request, { params }: RouteProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new NextResponse("Não autorizado", { status: 401 });
  }

  const { certificateId } = await params;

  const certificate = await prisma.certificate.findUnique({
    where: { id: certificateId },
    include: { module: true },
  });

  if (!certificate) {
    return new NextResponse("Certificado não encontrado", { status: 404 });
  }

  if (session.user.role !== "ADMIN" && certificate.userId !== session.user.id) {
    return new NextResponse("Acesso negado", { status: 403 });
  }

  const resolvedPath = path.resolve(certificate.filePath);
  let file: Buffer;
  try {
    file = await fs.readFile(resolvedPath);
  } catch {
    return new NextResponse("Arquivo não encontrado", { status: 404 });
  }
  const fileName = `${certificate.module.title.replace(/\s+/g, "-")}.pdf`;

  return new NextResponse(file as any, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
