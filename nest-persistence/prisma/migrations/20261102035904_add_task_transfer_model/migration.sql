-- CreateTable
CREATE TABLE "TaskTransfer" (
    "id" SERIAL NOT NULL,
    "fromUserId" INTEGER NOT NULL,
    "toUserId" INTEGER NOT NULL,
    "taskCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskTransfer_pkey" PRIMARY KEY ("id")
);
