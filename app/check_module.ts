import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const moduleId = "cmhzezh7a000312fs826bj0mx";
    const module = await prisma.module.findUnique({
        where: { id: moduleId },
    });

    console.log("Module found:", module);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
