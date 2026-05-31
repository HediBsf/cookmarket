ALTER TABLE "User"
ADD COLUMN "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "emailVerificationToken" TEXT,
ADD COLUMN "emailVerificationExpires" TIMESTAMP(3);

CREATE UNIQUE INDEX "User_emailVerificationToken_key" ON "User"("emailVerificationToken");

UPDATE "User" SET "emailVerified" = true;
