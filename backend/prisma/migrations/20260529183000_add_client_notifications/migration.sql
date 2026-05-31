CREATE TABLE "ClientNotification" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "orderId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" INTEGER NOT NULL,

    CONSTRAINT "ClientNotification_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "ClientNotification" ADD CONSTRAINT "ClientNotification_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
