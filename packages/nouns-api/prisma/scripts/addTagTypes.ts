// node prisma/scripts/addTagTypes.ts
const { PrismaClient, TagType } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  for (const type of [TagType.REQUEST]) {
    await prisma.tag.create({
      data: {
        type,
      },
    });
  }
}

seed();
