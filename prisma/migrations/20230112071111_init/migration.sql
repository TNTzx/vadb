-- CreateEnum
CREATE TYPE "Availability" AS ENUM ('ALLOWED', 'DISALLOWED', 'VARIES', 'UNKNOWN');

-- CreateTable
CREATE TABLE "Artist" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "availability" "Availability" NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtistMetadata" (
    "id" SERIAL NOT NULL,
    "artistId" INTEGER NOT NULL,
    "artistAliases" TEXT[],
    "description" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "genre" TEXT NOT NULL,

    CONSTRAINT "ArtistMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Song" (
    "id" SERIAL NOT NULL,
    "artistId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "romanizedTitle" TEXT NOT NULL,
    "audioPath" TEXT NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Social" (
    "id" SERIAL NOT NULL,
    "artistId" INTEGER NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "Social_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Right" (
    "id" SERIAL NOT NULL,
    "artistId" INTEGER NOT NULL,
    "identifier" TEXT NOT NULL,
    "isAllowed" BOOLEAN NOT NULL,

    CONSTRAINT "Right_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArtistMetadata_artistId_key" ON "ArtistMetadata"("artistId");

-- AddForeignKey
ALTER TABLE "ArtistMetadata" ADD CONSTRAINT "ArtistMetadata_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "ArtistMetadata"("artistId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Social" ADD CONSTRAINT "Social_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "ArtistMetadata"("artistId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Right" ADD CONSTRAINT "Right_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
