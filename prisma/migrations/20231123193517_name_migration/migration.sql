-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);
