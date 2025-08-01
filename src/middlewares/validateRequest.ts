import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';


/* 
Essa forma de fazer eu achei no Stackoverflow. Diferente do quê foi feito nas auals mas achei mais compacta.
Pelo que entendi, essa forma segue o código DRY (Don't Repeat Yourself), criando um único Middleware
*/


export const validate = (schema: ZodObject) => 
    async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Aqui, nós tentamos validar os dados da requisição (body, query e params)
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        
        // Se a validação for bem-sucedida, chamamos o próximo middleware ou rota.
        return next();

    } catch (error) {
        // Se ocorrer um erro de validação, verificamos se é uma instância de ZodError.
        if (error instanceof ZodError) {
            // Retornamos um status 400 com uma mensagem de erro e os detalhes dos erros de validação.
            return res.status(400).json({
                message: 'Erro de validação nos dados de entrada.',
                errors: error.flatten().fieldErrors,
            });
        }
        
        // Se o erro não for de validação, retornamos um status 500 com uma mensagem genérica.
        console.error('Erro interno:', error);
        return res.status(500).json({ message: 'Erro interno do servidor durante a validação.' });
    }
};
