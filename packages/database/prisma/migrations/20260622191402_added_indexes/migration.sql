/*
  Warnings:

  - Added the required column `recipient_id` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "notification"."NotificationType" ADD VALUE 'MENTION';

-- AlterTable
ALTER TABLE "notification"."notifications" ADD COLUMN     "recipient_id" VARCHAR(36) NOT NULL;

-- CreateTable
CREATE TABLE "main"."post_mentions" (
    "id" VARCHAR(36) NOT NULL,
    "post_id" VARCHAR(36) NOT NULL,
    "profile_id" VARCHAR(36) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(36),

    CONSTRAINT "post_mentions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "main"."comment_mentions" (
    "id" VARCHAR(36) NOT NULL,
    "comment_id" VARCHAR(36) NOT NULL,
    "profile_id" VARCHAR(36) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(36),

    CONSTRAINT "comment_mentions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "post_mentions_post_id_profile_id_key" ON "main"."post_mentions"("post_id", "profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "comment_mentions_comment_id_profile_id_key" ON "main"."comment_mentions"("comment_id", "profile_id");

-- CreateIndex
CREATE INDEX "comments_post_id_idx" ON "main"."comments"("post_id");

-- CreateIndex
CREATE INDEX "comments_profile_id_idx" ON "main"."comments"("profile_id");

-- CreateIndex
CREATE INDEX "posts_profile_id_created_at_idx" ON "main"."posts"("profile_id", "created_at");

-- CreateIndex
CREATE INDEX "posts_is_archived_idx" ON "main"."posts"("is_archived");

-- CreateIndex
CREATE INDEX "profiles_follows_following_profile_id_idx" ON "main"."profiles_follows"("following_profile_id");

-- CreateIndex
CREATE INDEX "notifications_recipient_id_idx" ON "notification"."notifications"("recipient_id");

-- AddForeignKey
ALTER TABLE "notification"."notifications" ADD CONSTRAINT "notifications_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "main"."profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."post_mentions" ADD CONSTRAINT "post_mentions_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "main"."posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."post_mentions" ADD CONSTRAINT "post_mentions_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "main"."profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."post_mentions" ADD CONSTRAINT "post_mentions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."post_mentions" ADD CONSTRAINT "post_mentions_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."comment_mentions" ADD CONSTRAINT "comment_mentions_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "main"."comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."comment_mentions" ADD CONSTRAINT "comment_mentions_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "main"."profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."comment_mentions" ADD CONSTRAINT "comment_mentions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."comment_mentions" ADD CONSTRAINT "comment_mentions_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
