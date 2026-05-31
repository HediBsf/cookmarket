CREATE TABLE "SupportTicket" (
  "id" SERIAL NOT NULL,
  "subject" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "reply" TEXT,
  "status" TEXT NOT NULL DEFAULT 'OPEN',
  "readByAdmin" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "repliedAt" TIMESTAMP(3),
  "userId" INTEGER NOT NULL,
  "repliedById" INTEGER,

  CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "SupportTicket"
ADD CONSTRAINT "SupportTicket_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "SupportTicket"
ADD CONSTRAINT "SupportTicket_repliedById_fkey"
FOREIGN KEY ("repliedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
