/*
  Warnings:

  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hash` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pasword` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salt` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "user_telefone_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "password",
ADD COLUMN     "hash" TEXT NOT NULL,
ADD COLUMN     "pasword" TEXT NOT NULL,
ADD COLUMN     "salt" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_userId_key" ON "user"("userId");
