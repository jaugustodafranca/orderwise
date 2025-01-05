-- CreateTable
CREATE TABLE "Meals" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ingredients" TEXT NOT NULL,
    "priceInCents" INTEGER NOT NULL,
    "isLactoseFree" BOOLEAN NOT NULL,
    "isGlutenFree" BOOLEAN NOT NULL,
    "isVegetarian" BOOLEAN NOT NULL,
    "isVegan" BOOLEAN NOT NULL,
    "isSpicy" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Meals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Drinks" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priceInCents" INTEGER NOT NULL,
    "mililitros" INTEGER NOT NULL,
    "ingredients" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Drinks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sides" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ingredients" TEXT NOT NULL,
    "priceInCents" INTEGER NOT NULL,
    "isLactoseFree" BOOLEAN NOT NULL,
    "isGlutenFree" BOOLEAN NOT NULL,
    "isVegetarian" BOOLEAN NOT NULL,
    "isVegan" BOOLEAN NOT NULL,
    "isSpicy" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Desserts" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ingredients" TEXT NOT NULL,
    "priceInCents" INTEGER NOT NULL,
    "isLactoseFree" BOOLEAN NOT NULL,
    "isGlutenFree" BOOLEAN NOT NULL,
    "isVegetarian" BOOLEAN NOT NULL,
    "isVegan" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Desserts_pkey" PRIMARY KEY ("id")
);
