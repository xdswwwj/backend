/*
  Warnings:

  - You are about to drop the column `members` on the `Club` table. All the data in the column will be lost.
  - You are about to drop the `LinkedClub` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LinkedClub" DROP CONSTRAINT "LinkedClub_clubId_fkey";

-- DropForeignKey
ALTER TABLE "LinkedClub" DROP CONSTRAINT "LinkedClub_userId_fkey";

-- AlterTable
ALTER TABLE "Club" DROP COLUMN "members";

-- DropTable
DROP TABLE "LinkedClub";

-- CreateTable
CREATE TABLE "ClubMember" (
    "id" SERIAL NOT NULL,
    "clubId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ClubMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubBung" (
    "id" SERIAL NOT NULL,
    "clubMemberId" INTEGER NOT NULL,
    "createUserId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ClubBung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubBungParticipant" (
    "id" SERIAL NOT NULL,
    "bungId" INTEGER NOT NULL,
    "clubMemberId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT,

    CONSTRAINT "ClubBungParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClubMember_clubId_idx" ON "ClubMember"("clubId");

-- CreateIndex
CREATE INDEX "ClubMember_userId_idx" ON "ClubMember"("userId");

-- CreateIndex
CREATE INDEX "ClubMember_clubId_userId_idx" ON "ClubMember"("clubId", "userId");

-- CreateIndex
CREATE INDEX "ClubBungParticipant_bungId_idx" ON "ClubBungParticipant"("bungId");

-- CreateIndex
CREATE INDEX "ClubBungParticipant_clubMemberId_idx" ON "ClubBungParticipant"("clubMemberId");

-- AddForeignKey
ALTER TABLE "ClubMember" ADD CONSTRAINT "ClubMember_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubMember" ADD CONSTRAINT "ClubMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubBung" ADD CONSTRAINT "ClubBung_clubMemberId_fkey" FOREIGN KEY ("clubMemberId") REFERENCES "ClubMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubBung" ADD CONSTRAINT "ClubBung_createUserId_fkey" FOREIGN KEY ("createUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubBungParticipant" ADD CONSTRAINT "ClubBungParticipant_bungId_fkey" FOREIGN KEY ("bungId") REFERENCES "ClubBung"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubBungParticipant" ADD CONSTRAINT "fk_club_member_participant" FOREIGN KEY ("clubMemberId") REFERENCES "ClubMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubBungParticipant" ADD CONSTRAINT "fk_user_participant" FOREIGN KEY ("clubMemberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
