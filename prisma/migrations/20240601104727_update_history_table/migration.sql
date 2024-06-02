/*
  Warnings:

  - Added the required column `field` to the `History` table without a default value. This is not possible if the table is not empty.
  - Added the required column `newValue` to the `History` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oldValue` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "History" 
ADD COLUMN     "field" TEXT NOT NULL,
ADD COLUMN     "newValue" TEXT NOT NULL,
ADD COLUMN     "oldValue" TEXT NOT NULL;


