/*
  Warnings:

  - The primary key for the `Match` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `player1` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `player1Goals` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `player2` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `player2Goals` on the `Match` table. All the data in the column will be lost.
  - Added the required column `rivalGoals` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rivalId` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userGoals` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" DROP CONSTRAINT "Match_pkey",
DROP COLUMN "player1",
DROP COLUMN "player1Goals",
DROP COLUMN "player2",
DROP COLUMN "player2Goals",
ADD COLUMN     "rivalGoals" INTEGER NOT NULL,
ADD COLUMN     "rivalId" TEXT NOT NULL,
ADD COLUMN     "userGoals" INTEGER NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Match_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Match_id_seq";

-- CreateTable
CREATE TABLE "Rival" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "team" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rival_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Rival" ADD CONSTRAINT "Rival_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_rivalId_fkey" FOREIGN KEY ("rivalId") REFERENCES "Rival"("id") ON DELETE CASCADE ON UPDATE CASCADE;
