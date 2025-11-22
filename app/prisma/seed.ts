import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const employeePassword = await bcrypt.hash("colaborador123", 10);

  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin@luflix.com",
      name: "Admin LUFLIX",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  const employee = await prisma.user.upsert({
    where: { username: "funcionario" },
    update: {},
    create: {
      username: "funcionario",
      email: "funcionario@luflix.com",
      name: "Funcionário Teste",
      passwordHash: employeePassword,
      role: "EMPLOYEE",
    },
  });

  let onboardingModule = await prisma.module.findFirst({
    where: { title: "Boas-vindas" },
  });

  if (!onboardingModule) {
    onboardingModule = await prisma.module.create({
      data: {
        title: "Boas-vindas",
        description: "Conheça a cultura, valores e ferramentas da empresa.",
        coverUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
        createdById: admin.id,
      },
    });
  }

  await prisma.moduleAccess.upsert({
    where: { moduleId_userId: { moduleId: onboardingModule.id, userId: employee.id } },
    update: {},
    create: { moduleId: onboardingModule.id, userId: employee.id },
  });

  const existingVideos = await prisma.video.findMany({ where: { moduleId: onboardingModule.id } });
  if (existingVideos.length === 0) {
    await prisma.video.createMany({
      data: [
        {
          moduleId: onboardingModule.id,
          title: "Cultura LUFLIX",
          description: "Apresentação geral da empresa",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          sortOrder: 0,
        },
        {
          moduleId: onboardingModule.id,
          title: "Ferramentas essenciais",
          description: "Como acessar e configurar os sistemas",
          videoUrl: "https://www.youtube.com/watch?v=oHg5SJYRHA0",
          sortOrder: 1,
        },
      ],
    });
  }

  console.log("Seed executada com sucesso");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
