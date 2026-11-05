-- CreateTable
CREATE TABLE "ConsumedRefreshToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsumedRefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConsumedRefreshToken_tokenHash_key" ON "ConsumedRefreshToken"("tokenHash");

-- CreateIndex
CREATE INDEX "ConsumedRefreshToken_sessionId_idx" ON "ConsumedRefreshToken"("sessionId");

-- AddForeignKey
ALTER TABLE "ConsumedRefreshToken" ADD CONSTRAINT "ConsumedRefreshToken_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
