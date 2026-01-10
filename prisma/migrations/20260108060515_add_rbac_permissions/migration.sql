/*
  Warnings:

  - You are about to drop the column `roles` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('VIEWER', 'CLIENT', 'MANAGER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('MANAGE_USERS', 'MANAGE_CLIENTS', 'MANAGE_LEADS', 'MANAGE_INQUIRIES', 'MANAGE_SALES', 'MANAGE_PROJECTS', 'MANAGE_SERVICES', 'VIEW_ANALYTICS', 'VIEW_OWN_DATA');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "roles",
ADD COLUMN     "permissions" "Permission"[] DEFAULT ARRAY['VIEW_OWN_DATA']::"Permission"[],
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'VIEWER';

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");
