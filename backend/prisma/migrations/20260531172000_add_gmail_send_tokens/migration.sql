ALTER TABLE "User"
ADD COLUMN "gmailSendEmail" TEXT,
ADD COLUMN "gmailAccessToken" TEXT,
ADD COLUMN "gmailRefreshToken" TEXT,
ADD COLUMN "gmailTokenExpiresAt" TIMESTAMP(3);
