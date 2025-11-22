import { prisma } from "@/lib/prisma";
import { generateCertificateFile } from "@/certificates/generator";

export async function ensureCertificate(userId: string, moduleId: string) {
  const existing = await prisma.certificate.findUnique({
    where: { userId_moduleId: { userId, moduleId } },
  });

  if (existing) {
    return existing;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const trainingModule = await prisma.module.findUnique({ where: { id: moduleId } });

  if (!user || !trainingModule) {
    throw new Error("Dados insuficientes para gerar certificado");
  }

  const created = await prisma.certificate.create({
    data: {
      userId,
      moduleId,
      filePath: "",
    },
  });

  const filePath = await generateCertificateFile({
    certificateId: created.id,
    employeeName: user.name,
    moduleTitle: trainingModule.title,
    issuedAt: new Date(),
  });

  return prisma.certificate.update({
    where: { id: created.id },
    data: { filePath },
  });
}

export async function getCertificatesForUser(userId: string) {
  return prisma.certificate.findMany({
    where: { userId },
    include: { module: true },
    orderBy: { issuedAt: "desc" },
  });
}
