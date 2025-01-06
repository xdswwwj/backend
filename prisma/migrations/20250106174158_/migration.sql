-- CreateTable
CREATE TABLE "Club" (
    "id" SERIAL NOT NULL,
    "type" INTEGER NOT NULL,
    "leaderId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT,
    "nickname" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "sex" INTEGER DEFAULT 1,
    "image" TEXT,
    "provider" TEXT,
    "providerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Club_name_key" ON "Club"("name");

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

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_providerId_key" ON "User"("providerId");

-- AddForeignKey
ALTER TABLE "Club" ADD CONSTRAINT "Club_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
