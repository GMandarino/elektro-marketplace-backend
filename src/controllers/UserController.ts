import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma'; 
import { sendWelcomeEmail } from '../utils/emailService';
import auth  from '../config/auth';


const prisma = new PrismaClient();


export class UserController {

    
    
    //Cria um novo usuário.
    public static async createUser(request: Request, response: Response) {
        try {
       
            const userData = request.body;

            const createdUser = await prisma.user.create({
                data:userData
            });

            const { hash, salt } = auth.generatePassword(userData.password);

            sendWelcomeEmail(createdUser.email, createdUser.userName || 'Usuário');

            return response.status(201).json(createdUser);

        } catch (error: any) {
            console.error('Erro ao criar usuário:', error);
            return response.status(500).json({ message: 'Erro interno do servidor ao criar usuário.' });
        }
    }

    // Faz login do usuário a partir do password e da id do usuário
    static async loginUser(request: Request, response: Response) {
        
        try{
                const {userId, password} = request.body;

                const user = await prisma.user.findUnique({
                    where: { userId: userId,}
                
                });

                if(!user)
                    return response.status(400).json({message:"Usuário não existe"})

                const {hash , salt} = user;

                if (!auth.checkPassword(password, hash, salt)){
                    return response.status(400).json({message:"Senha incorreta"})
                }
                const token = auth.generateJWT(user);

                return response.status(201).json({message:"Token enviado", token :token})
            }   catch (error) {
                return response.status(500).json({message: "Server Error"})

                }  
    }

    public static async acessUser(request: Request, response: Response){
        
        if  (request.user?)
        const { userId } = request.user;

        try {

             return response.status(200).json({message: "Acesso autorizado",usuario: userId})

        }  catch (error) {
            return response.status(500).json({message: "Server Error"})
        }  
    }

    
    //Busca um usuário específico pelo ID.
    public static async readUser(request: Request, response: Response) {
        try {
            
            const { userId } = request.params;
            const parsedUserId = parseInt(userId);

            const foundUser = await prisma.user.findUnique({
                where: { userId: parsedUserId },
                include: { products: true }
            });

            if (!foundUser) {
                return response.status(404).json({ message: 'Usuário não encontrado.' });
            }

            return response.status(200).json(foundUser);
        } catch (error: any) {
            console.error('Erro ao ler usuário:', error);
            return response.status(500).json({ message: 'Erro interno do servidor ao ler usuário.' });
        }
    }

    
     //Lista todos os usuários cadastrados. 
    public static async readAllUsers(request: Request, response: Response) {
        try {
            const users = await prisma.user.findMany();
            
            return response.status(200).json(users);

        } catch (error: any) {
            console.error('Erro ao ler todos os usuários:', error);
            return response.status(500).json({ message: 'Erro interno do servidor ao ler todos os usuários.' });
        }
    }

     //Atualiza os dados de um usuário existente.
    public static async UpdateUser(request: Request, response: Response) {
        try {
            const { userId } = request.params;
            const parsedUserId = parseInt(userId);
            const updateData = request.body;

            const updatedUser = await prisma.user.update({
                where: { userId: parsedUserId },
                data: updateData,
            });

            return response.status(200).json(updatedUser);

        } catch (error: any) {
            if (error.code === 'P2025') { 
                return response.status(404).json({ message: 'Usuário não encontrado para atualização.' });
            }
            if (error.code === 'P2002' && error.meta?.target) {
                return response.status(409).json({ message: `Conflito: O campo '${error.meta.target}' já está em uso por outro usuário.` });
            }
            console.error('Erro ao atualizar usuário:', error);
            return response.status(500).json({ message: 'Erro interno do servidor ao atualizar usuário.' });
        }
    }
    
        
    //Deleta um usuário existente.
    public static async deleteUser(request: Request, response: Response) {
        try {
            const { userId } = request.params;
            const parsedUserId = parseInt(userId);

            await prisma.user.delete({ 
                where: { userId: parsedUserId },
            });
            
            return response.status(204).send();

        } catch (error: any) {
            if (error.code === 'P2025') {
                return response.status(404).json({ message: 'Usuário não encontrado para exclusão.' });
            }
            if (error.code === 'P2003') { 
                return response.status(409).json({ message: 'Conflito: Não é possível deletar este usuário pois ele possui produtos associados.' });
            }
            console.error('Erro ao deletar usuário:', error);
            return response.status(500).json({ message: 'Erro interno do servidor ao deletar usuário.' });
        }
    }
}

export default UserController;