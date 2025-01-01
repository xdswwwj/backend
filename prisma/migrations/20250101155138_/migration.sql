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

-- CreateIndex
CREATE UNIQUE INDEX "Club_name_key" ON "Club"("name");

-- AddForeignKey
ALTER TABLE "Club" ADD CONSTRAINT "Club_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
