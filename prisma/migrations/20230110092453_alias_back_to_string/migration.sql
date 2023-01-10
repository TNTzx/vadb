/*
  Warnings:

  - You are about to drop the `Alias` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Alias` DROP FOREIGN KEY `Alias_artistId_fkey`;

-- AlterTable
ALTER TABLE `Artist` ADD COLUMN `aliases` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `Alias`;
