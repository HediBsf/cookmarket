ALTER TABLE "User"
ADD COLUMN "sellerSubscriptionStatus" TEXT NOT NULL DEFAULT 'INACTIVE',
ADD COLUMN "sellerSubscriptionExpiresAt" TIMESTAMP(3),
ADD COLUMN "sellerSubscriptionReference" TEXT,
ADD COLUMN "sellerSubscriptionProof" TEXT;

UPDATE "User"
SET "sellerSubscriptionStatus" = 'ACTIVE',
    "sellerSubscriptionExpiresAt" = NOW() + INTERVAL '1 year'
WHERE "role" = 'SELLER';
