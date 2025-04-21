-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" INTEGER,
    "username" TEXT,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);
