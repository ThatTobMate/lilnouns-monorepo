// node prisma/scripts/addTagTypes.ts
const { PrismaClient, TagType } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  for (const type of [
    TagType.REQUEST,
    TagType.OTHER,
    TagType.SUGGESTION,
    TagType.GOVERNANCE,
    TagType.COMMUNITY,
  ]) {
    await prisma.tag.create({
      data: {
        type,
      },
    });
  }
}

seed();
