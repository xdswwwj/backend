/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[loginId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[kakaoProviderId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[kakaoEmail]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[googleProviderId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[googleEmail]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `loginId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_providerId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "provider",
DROP COLUMN "providerId",
ADD COLUMN     "googleEmail" TEXT,
ADD COLUMN     "googleProviderId" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "kakaoEmail" TEXT,
ADD COLUMN     "kakaoProviderId" TEXT,
ADD COLUMN     "loginId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_loginId_key" ON "User"("loginId");

-- CreateIndex
CREATE UNIQUE INDEX "User_kakaoProviderId_key" ON "User"("kakaoProviderId");

-- CreateIndex
CREATE UNIQUE INDEX "User_kakaoEmail_key" ON "User"("kakaoEmail");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleProviderId_key" ON "User"("googleProviderId");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleEmail_key" ON "User"("googleEmail");
