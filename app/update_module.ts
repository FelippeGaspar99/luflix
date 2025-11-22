import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const moduleId = "cmhzezh7a000312fs826bj0mx";
    const updated = await prisma.module.update({
        where: { id: moduleId },
        data: { isMembersVisible: true },
    });

    console.log("Module updated:", updated);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
