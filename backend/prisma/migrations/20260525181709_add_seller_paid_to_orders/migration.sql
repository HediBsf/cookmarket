-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_dishId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "sellerPaid" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE SET NULL ON UPDATE CASCADE;
