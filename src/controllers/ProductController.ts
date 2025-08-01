import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export class ProductController {

    //Cria um novo produto, incluindo o upload de uma imagem.
    public static async createProduct(request: Request, response: Response) {
        try {
            const { productName, price, amount, description, userId } = request.body;
            
            if (!request.file) {
                return response.status(400).json({ message: 'A imagem do produto é obrigatória.' });
            }

            const imagePath = request.file.path;

            const parsedPrice = parseFloat(price);
            const parsedAmount = parseInt(amount, 10);
            const parsedUserId = parseInt(userId, 10);

            // Validação simples para garantir que a conversão funcionou.
            if (isNaN(parsedPrice) || isNaN(parsedAmount) || isNaN(parsedUserId)) {
                return response.status(400).json({ message: 'Os campos price, amount e userId devem ser números válidos.' });
            }
            
            const userExists = await prisma.user.findUnique({
                where: { userId: parsedUserId },
            });

            if (!userExists) {
                return response.status(404).json({ message: 'Usuário associado a este produto não foi encontrado.' });
            }

            //Criar o produto no banco, salvando o caminho da imagem.
            const newProduct = await prisma.product.create({
                data: {
                    productName: productName,
                    price: parsedPrice,
                    amount: parsedAmount,
                    description: description,
                    image: imagePath,
                    userId: parsedUserId,
                },
            });

            return response.status(201).json(newProduct);

        } catch (error: any) {
            console.error('Erro ao criar produto:', error);
            return response.status(500).json({ message: 'Erro interno do servidor ao criar produto.' });
        }
    }

    // Lista todos os produtos cadastrados.
    public static async getAllProducts(request: Request, response: Response) {
        try {
            const products = await prisma.product.findMany({
                include: { userName: true },
            });
            return response.status(200).json(products);
        } catch (error: any) {
            console.error('Erro ao buscar produtos:', error);
            return response.status(500).json({ message: 'Erro interno do servidor ao buscar produtos.' });
        }
    }

    // Busca um produto específico pelo seu ID.
    public static async getProductById(request: Request, response: Response) {
        try {
            const { productId } = request.params;
            const parsedProductId = parseInt(productId);
            if (isNaN(parsedProductId)) {
                return response.status(400).json({ message: 'ID de produto inválido.' });
            }
            
            const product = await prisma.product.findUnique({
                where: { productId: parsedProductId },
                include: { userName: true },
            });

            if (!product) {
                return response.status(404).json({ message: 'Produto não encontrado.' });
            }

            return response.status(200).json(product);
        } catch (error: any) {
            console.error('Erro ao buscar produto por ID:', error);
            return response.status(500).json({ message: 'Erro interno do servidor ao buscar produto por ID.' });
        }
    }
    
    // Procura os produtos do usuário
    public static async getProductsByUser(request: Request, response: Response) {
        try {
            const { userId } = request.params;
            const parsedUserId = parseInt(userId);
            if (isNaN(parsedUserId)) {
                return response.status(400).json({ message: 'ID de usuário inválido.' });
            }

            const products = await prisma.product.findMany({
                where: {
                    userId: parsedUserId, 
                },
                include: {
                    userName: true
                }
            });

            if (products.length === 0) {
    
                return response.status(200).json({ message: 'Este usuário não possui produtos cadastrados.', products: [] });
            }

            return response.status(200).json(products);

        } catch (error: any) {
            console.error('Erro ao buscar produtos por usuário:', error);
            return response.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }

    // Atualiza um produto existente.
    public static async updateProduct(request: Request, response: Response) {
        try {
            const { productId } = request.params;
            const parsedProductId = parseInt(productId);
            if (isNaN(parsedProductId)) {
                return response.status(400).json({ message: 'ID de produto inválido.' });
            }
            
            const updateData: any = {};
            const { productName, price, amount, description } = request.body;

            if (productName) updateData.productName = productName;
            if (description) updateData.description = description;
            if (price) updateData.price = parseFloat(price);
            if (amount) updateData.amount = parseInt(amount, 10);
            
            // Se uma nova imagem foi enviada no formulário, adiciona o novo caminho.
            if (request.file) {
                updateData.image = request.file.path;
            }

            const updatedProduct = await prisma.product.update({
                where: { productId: parsedProductId },
                data: updateData,
            });

            return response.status(200).json(updatedProduct);

        } catch (error: any) {
            if (error.code === 'P2025') {
                return response.status(404).json({ message: 'Produto não encontrado para atualização.' });
            }
            console.error('Erro ao atualizar produto:', error);
            return response.status(500).json({ message: 'Erro interno do servidor ao atualizar produto.' });
        }
    }

     // Deleta um produto existente.
    public static async deleteProduct(request: Request, response: Response) {
        try {
            const { productId } = request.params;
            const parsedProductId = parseInt(productId);
            if (isNaN(parsedProductId)) {
                return response.status(400).json({ message: 'ID de produto inválido.' });
            }

            await prisma.product.delete({
                where: { productId: parsedProductId },
            });

            return response.status(204).send();

        } catch (error: any) {
            if (error.code === 'P2025') {
                return response.status(404).json({ message: 'Produto não encontrado para exclusão.' });
            }
            console.error('Erro ao deletar produto:', error);
            return response.status(500).json({ message: 'Erro interno do servidor ao deletar produto.' });
        }
    }
}

export default ProductController;