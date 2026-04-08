/*
  Warnings:

  - You are about to alter the column `created_by` on the `accounts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - You are about to alter the column `updated_by` on the `accounts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - You are about to alter the column `created_by` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - You are about to alter the column `updated_by` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - You are about to alter the column `created_by` on the `assets` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - You are about to alter the column `updated_by` on the `assets` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - You are about to alter the column `created_by` on the `chats` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - You are about to alter the column `updated_by` on the `chats` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - You are about to alter the column `post_id` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - You are about to alter the column `profile_id` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - You are about to alter the column `parent_comment_id` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - You are about to alter the column `created_by` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - You are about to alter the column `updated_by` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - You are about to alter the column `chat_id` on the `messages` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - You are about to alter the column `profile_id` on the `messages` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - You are about to alter the column `created_by` on the `messages` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - You are about to alter the column `updated_by` on the `messages` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - You are about to alter the column `profile_id` on the `posts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - You are about to alter the column `created_by` on the `posts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - You are about to alter the column `updated_by` on the `posts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - You are about to alter the column `user_id` on the `profiles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - You are about to alter the column `created_by` on the `profiles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - You are about to alter the column `updated_by` on the `profiles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - You are about to alter the column `created_by` on the `notifications` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - You are about to alter the column `updated_by` on the `notifications` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.

*/
-- CreateEnum
CREATE TYPE "main"."ChatRole" AS ENUM ('ADMIN', 'MEMBER');

-- DropForeignKey
ALTER TABLE "auth"."accounts" DROP CONSTRAINT "accounts_created_by_fkey";

-- DropForeignKey
ALTER TABLE "auth"."accounts" DROP CONSTRAINT "accounts_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "auth"."users" DROP CONSTRAINT "users_created_by_fkey";

-- DropForeignKey
ALTER TABLE "auth"."users" DROP CONSTRAINT "users_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "main"."assets" DROP CONSTRAINT "assets_created_by_fkey";

-- DropForeignKey
ALTER TABLE "main"."assets" DROP CONSTRAINT "assets_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "main"."chats" DROP CONSTRAINT "chats_created_by_fkey";

-- DropForeignKey
ALTER TABLE "main"."chats" DROP CONSTRAINT "chats_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "main"."comments" DROP CONSTRAINT "comments_created_by_fkey";

-- DropForeignKey
ALTER TABLE "main"."comments" DROP CONSTRAINT "comments_parent_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "main"."comments" DROP CONSTRAINT "comments_post_id_fkey";

-- DropForeignKey
ALTER TABLE "main"."comments" DROP CONSTRAINT "comments_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "main"."comments" DROP CONSTRAINT "comments_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "main"."messages" DROP CONSTRAINT "messages_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "main"."messages" DROP CONSTRAINT "messages_created_by_fkey";

-- DropForeignKey
ALTER TABLE "main"."messages" DROP CONSTRAINT "messages_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "main"."messages" DROP CONSTRAINT "messages_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "main"."posts" DROP CONSTRAINT "posts_created_by_fkey";

-- DropForeignKey
ALTER TABLE "main"."posts" DROP CONSTRAINT "posts_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "main"."posts" DROP CONSTRAINT "posts_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "main"."profiles" DROP CONSTRAINT "profiles_created_by_fkey";

-- DropForeignKey
ALTER TABLE "main"."profiles" DROP CONSTRAINT "profiles_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "main"."profiles" DROP CONSTRAINT "profiles_user_id_fkey";

-- DropForeignKey
ALTER TABLE "notification"."notifications" DROP CONSTRAINT "notifications_created_by_fkey";

-- DropForeignKey
ALTER TABLE "notification"."notifications" DROP CONSTRAINT "notifications_updated_by_fkey";

-- AlterTable
ALTER TABLE "auth"."accounts" ALTER COLUMN "created_by" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "updated_by" DROP NOT NULL,
ALTER COLUMN "updated_by" SET DATA TYPE VARCHAR(36);

-- AlterTable
ALTER TABLE "auth"."users" ALTER COLUMN "created_by" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "updated_by" SET DATA TYPE VARCHAR(36);

-- AlterTable
ALTER TABLE "main"."assets" ALTER COLUMN "created_by" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "updated_by" DROP NOT NULL,
ALTER COLUMN "updated_by" SET DATA TYPE VARCHAR(36);

-- AlterTable
ALTER TABLE "main"."chats" ALTER COLUMN "created_by" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "updated_by" DROP NOT NULL,
ALTER COLUMN "updated_by" SET DATA TYPE VARCHAR(36);

-- AlterTable
ALTER TABLE "main"."comments" ALTER COLUMN "post_id" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "profile_id" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "parent_comment_id" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "created_by" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "updated_by" DROP NOT NULL,
ALTER COLUMN "updated_by" SET DATA TYPE VARCHAR(36);

-- AlterTable
ALTER TABLE "main"."messages" ALTER COLUMN "chat_id" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "profile_id" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "created_by" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "updated_by" DROP NOT NULL,
ALTER COLUMN "updated_by" SET DATA TYPE VARCHAR(36);

-- AlterTable
ALTER TABLE "main"."posts" ALTER COLUMN "profile_id" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "created_by" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "updated_by" DROP NOT NULL,
ALTER COLUMN "updated_by" SET DATA TYPE VARCHAR(36);

-- AlterTable
ALTER TABLE "main"."profiles" ALTER COLUMN "user_id" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "created_by" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "updated_by" SET DATA TYPE VARCHAR(36);

-- AlterTable
ALTER TABLE "notification"."notifications" ALTER COLUMN "created_by" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "updated_by" DROP NOT NULL,
ALTER COLUMN "updated_by" SET DATA TYPE VARCHAR(36);

-- CreateTable
CREATE TABLE "main"."profile_configurations" (
    "id" VARCHAR(36) NOT NULL,
    "config_key" VARCHAR(100) NOT NULL,
    "is_admin_accessible_only" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(36),

    CONSTRAINT "profile_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "main"."posts_assets" (
    "id" VARCHAR(36) NOT NULL,
    "post_id" VARCHAR(36) NOT NULL,
    "asset_id" VARCHAR(36) NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(36),

    CONSTRAINT "posts_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "main"."profiles_follows" (
    "id" VARCHAR(36) NOT NULL,
    "follower_profile_id" VARCHAR(36) NOT NULL,
    "following_profile_id" VARCHAR(36) NOT NULL,
    "accepted" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(36) NOT NULL,

    CONSTRAINT "profiles_follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "main"."chat_participants" (
    "id" VARCHAR(36) NOT NULL,
    "profile_id" VARCHAR(36) NOT NULL,
    "chat_id" VARCHAR(36) NOT NULL,
    "role" "main"."ChatRole" NOT NULL DEFAULT 'MEMBER',
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "left_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" VARCHAR(36) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" VARCHAR(36),

    CONSTRAINT "chat_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "main"."message_assets" (
    "id" VARCHAR(36) NOT NULL,
    "message_id" VARCHAR(36) NOT NULL,
    "asset_id" VARCHAR(36) NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(36),

    CONSTRAINT "message_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "main"."post_likes" (
    "id" VARCHAR(36) NOT NULL,
    "post_id" VARCHAR(36) NOT NULL,
    "profile_id" VARCHAR(36) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(36),

    CONSTRAINT "post_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "main"."comment_likes" (
    "id" VARCHAR(36) NOT NULL,
    "profile_id" VARCHAR(36) NOT NULL,
    "comment_id" VARCHAR(36) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(36),

    CONSTRAINT "comment_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "main"."profile_to_profile_configurations" (
    "id" VARCHAR(36) NOT NULL,
    "profile_id" VARCHAR(36) NOT NULL,
    "configuration_id" VARCHAR(36) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(36) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(36),

    CONSTRAINT "profile_to_profile_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "posts_assets_post_id_asset_id_key" ON "main"."posts_assets"("post_id", "asset_id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_follows_follower_profile_id_following_profile_id_key" ON "main"."profiles_follows"("follower_profile_id", "following_profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_participants_profile_id_chat_id_key" ON "main"."chat_participants"("profile_id", "chat_id");

-- CreateIndex
CREATE UNIQUE INDEX "message_assets_message_id_asset_id_key" ON "main"."message_assets"("message_id", "asset_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_likes_post_id_profile_id_key" ON "main"."post_likes"("post_id", "profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "comment_likes_comment_id_profile_id_key" ON "main"."comment_likes"("comment_id", "profile_id");

-- AddForeignKey
ALTER TABLE "auth"."users" ADD CONSTRAINT "users_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."users" ADD CONSTRAINT "users_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."accounts" ADD CONSTRAINT "accounts_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."accounts" ADD CONSTRAINT "accounts_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."profiles" ADD CONSTRAINT "profiles_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."profiles" ADD CONSTRAINT "profiles_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."posts" ADD CONSTRAINT "posts_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "main"."profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."posts" ADD CONSTRAINT "posts_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."posts" ADD CONSTRAINT "posts_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "main"."posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."comments" ADD CONSTRAINT "comments_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "main"."profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."comments" ADD CONSTRAINT "comments_parent_comment_id_fkey" FOREIGN KEY ("parent_comment_id") REFERENCES "main"."comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."comments" ADD CONSTRAINT "comments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."comments" ADD CONSTRAINT "comments_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."assets" ADD CONSTRAINT "assets_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."assets" ADD CONSTRAINT "assets_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."chats" ADD CONSTRAINT "chats_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."chats" ADD CONSTRAINT "chats_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."messages" ADD CONSTRAINT "messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "main"."chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."messages" ADD CONSTRAINT "messages_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "main"."profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."messages" ADD CONSTRAINT "messages_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."messages" ADD CONSTRAINT "messages_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification"."notifications" ADD CONSTRAINT "notifications_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification"."notifications" ADD CONSTRAINT "notifications_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."profile_configurations" ADD CONSTRAINT "profile_configurations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."profile_configurations" ADD CONSTRAINT "profile_configurations_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."posts_assets" ADD CONSTRAINT "posts_assets_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "main"."posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."posts_assets" ADD CONSTRAINT "posts_assets_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "main"."assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."posts_assets" ADD CONSTRAINT "posts_assets_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."posts_assets" ADD CONSTRAINT "posts_assets_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."profiles_follows" ADD CONSTRAINT "profiles_follows_follower_profile_id_fkey" FOREIGN KEY ("follower_profile_id") REFERENCES "main"."profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."profiles_follows" ADD CONSTRAINT "profiles_follows_following_profile_id_fkey" FOREIGN KEY ("following_profile_id") REFERENCES "main"."profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."profiles_follows" ADD CONSTRAINT "profiles_follows_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."profiles_follows" ADD CONSTRAINT "profiles_follows_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."chat_participants" ADD CONSTRAINT "chat_participants_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "main"."profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."chat_participants" ADD CONSTRAINT "chat_participants_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "main"."chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."chat_participants" ADD CONSTRAINT "chat_participants_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."chat_participants" ADD CONSTRAINT "chat_participants_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."message_assets" ADD CONSTRAINT "message_assets_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "main"."messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."message_assets" ADD CONSTRAINT "message_assets_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "main"."assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."message_assets" ADD CONSTRAINT "message_assets_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."message_assets" ADD CONSTRAINT "message_assets_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."post_likes" ADD CONSTRAINT "post_likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "main"."posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."post_likes" ADD CONSTRAINT "post_likes_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "main"."profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."post_likes" ADD CONSTRAINT "post_likes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."post_likes" ADD CONSTRAINT "post_likes_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."comment_likes" ADD CONSTRAINT "comment_likes_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "main"."profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."comment_likes" ADD CONSTRAINT "comment_likes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "main"."comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."comment_likes" ADD CONSTRAINT "comment_likes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."comment_likes" ADD CONSTRAINT "comment_likes_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."profile_to_profile_configurations" ADD CONSTRAINT "profile_to_profile_configurations_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "main"."profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."profile_to_profile_configurations" ADD CONSTRAINT "profile_to_profile_configurations_configuration_id_fkey" FOREIGN KEY ("configuration_id") REFERENCES "main"."profile_configurations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."profile_to_profile_configurations" ADD CONSTRAINT "profile_to_profile_configurations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main"."profile_to_profile_configurations" ADD CONSTRAINT "profile_to_profile_configurations_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddCheckConstraint
ALTER TABLE "main"."profiles_follows" ADD CONSTRAINT "prevent_self_follow" CHECK (follower_profile_id != following_profile_id);