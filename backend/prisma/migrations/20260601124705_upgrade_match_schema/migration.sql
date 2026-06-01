-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "player1" TEXT NOT NULL,
    "player2" TEXT NOT NULL,
    "player1Goals" INTEGER NOT NULL,
    "player2Goals" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);
