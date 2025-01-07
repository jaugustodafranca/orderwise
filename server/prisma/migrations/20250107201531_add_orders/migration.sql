-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('IN_PROGRESS', 'DONE', 'CANCELLED', 'REFOUND');

-- CreateEnum
CREATE TYPE "ItemCategory" AS ENUM ('MEALS', 'DRINKS', 'SIDES', 'DESSERTS');

-- CreateTable
CREATE TABLE "Orders" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "status" "StatusType" NOT NULL,
    "totalCents" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" UUID NOT NULL,
    "orderId" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "ItemCategory" "ItemCategory" NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
