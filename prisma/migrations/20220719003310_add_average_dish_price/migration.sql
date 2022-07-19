/*
  Warnings:

  - Added the required column `averageDishPrice` to the `restaurants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `restaurants` ADD COLUMN `averageDishPrice` DECIMAL(65, 30) NOT NULL;
