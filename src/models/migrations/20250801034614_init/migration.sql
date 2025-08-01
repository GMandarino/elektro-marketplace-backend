-- CreateTable
CREATE TABLE "user" (
    "userId" SERIAL NOT NULL,
    "userName" TEXT,
    "cpf" VARCHAR(70) NOT NULL,
    "email" VARCHAR(70) NOT NULL,
    "telefone" CHAR(11) NOT NULL,
    "password" VARCHAR(70) NOT NULL,
    "rating" DECIMAL(3,2) NOT NULL DEFAULT 0,

    CONSTRAINT "user_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Product" (
    "productId" SERIAL NOT NULL,
    "productName" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "amount" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("productId")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_cpf_key" ON "user"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_telefone_key" ON "user"("telefone");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
