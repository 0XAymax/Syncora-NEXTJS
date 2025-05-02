-- AlterEnum
ALTER TYPE "TaskStatus" ADD VALUE 'not_determined';

-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "successorId" TEXT;

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_successorId_fkey" FOREIGN KEY ("successorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
