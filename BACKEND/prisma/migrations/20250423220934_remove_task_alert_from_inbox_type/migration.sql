/*
  Warnings:

  - The values [task_alert] on the enum `InboxType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InboxType_new" AS ENUM ('workspace_invite', 'workspace_role_updated', 'removed_from_workspace', 'workspace_deleted', 'task_assigned', 'task_updated', 'task_status_changed', 'task_due_soon', 'task_overdue', 'task_comment_added', 'admin_announcement', 'generic');
ALTER TABLE "Inbox" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Inbox" ALTER COLUMN "type" TYPE "InboxType_new" USING ("type"::text::"InboxType_new");
ALTER TYPE "InboxType" RENAME TO "InboxType_old";
ALTER TYPE "InboxType_new" RENAME TO "InboxType";
DROP TYPE "InboxType_old";
ALTER TABLE "Inbox" ALTER COLUMN "type" SET DEFAULT 'generic';
COMMIT;


