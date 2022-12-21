-- AlterTable
ALTER TABLE "Idea" ADD COLUMN     "parentId" INTEGER;

-- AddForeignKey
ALTER TABLE "Idea" ADD CONSTRAINT "Idea_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;
