-- AlterTable
ALTER TABLE "Club" ADD COLUMN     "members" JSONB;

-- CreateTable
CREATE TABLE "LinkedClub" (
    "id" SERIAL NOT NULL,
    "clubId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "LinkedClub_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LinkedClub_clubId_idx" ON "LinkedClub"("clubId");

-- CreateIndex
CREATE INDEX "LinkedClub_userId_idx" ON "LinkedClub"("userId");

-- CreateIndex
CREATE INDEX "LinkedClub_clubId_userId_idx" ON "LinkedClub"("clubId", "userId");

-- AddForeignKey
ALTER TABLE "LinkedClub" ADD CONSTRAINT "LinkedClub_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkedClub" ADD CONSTRAINT "LinkedClub_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
