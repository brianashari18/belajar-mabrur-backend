/*
  Warnings:

  - Added the required column `category` to the `contents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `contents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `contents` ADD COLUMN `category` VARCHAR(50) NOT NULL,
    ADD COLUMN `description` TEXT NOT NULL;
