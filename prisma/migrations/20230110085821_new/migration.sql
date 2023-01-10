/*
  Warnings:

  - You are about to drop the column `aliases` on the `Artist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Artist` DROP COLUMN `aliases`;

-- CreateTable
CREATE TABLE `Alias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `artistId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Alias` ADD CONSTRAINT `Alias_artistId_fkey` FOREIGN KEY (`artistId`) REFERENCES `Artist`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
