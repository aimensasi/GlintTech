/*
  Warnings:

  - You are about to drop the column `openingHours` on the `restaurants` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `restaurants` DROP COLUMN `openingHours`;

-- CreateTable
CREATE TABLE `openingHours` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `restaurantId` INTEGER NOT NULL,
    `day` VARCHAR(191) NOT NULL,
    `fromTime` VARCHAR(191) NOT NULL,
    `toTime` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `openingHours` ADD CONSTRAINT `openingHours_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
