-- CreateTable
CREATE TABLE "Formation" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "duration" TEXT,
    "level" TEXT,
    "imageUrl" TEXT,
    "availability" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sellerId" INTEGER NOT NULL,

    CONSTRAINT "Formation_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Order" ADD COLUMN "customerFirstName" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Order" ADD COLUMN "customerLastName" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Order" ADD COLUMN "customerEmail" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Order" ADD COLUMN "customerPhone" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Order" ADD COLUMN "deliveryCity" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Order" ADD COLUMN "deliveryFee" DOUBLE PRECISION NOT NULL DEFAULT 7;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN "formationId" INTEGER;
ALTER TABLE "OrderItem" ALTER COLUMN "dishId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Formation" ADD CONSTRAINT "Formation_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "Formation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
