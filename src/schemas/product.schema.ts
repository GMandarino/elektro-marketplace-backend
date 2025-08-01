import { z } from 'zod';

export const createProductSchema = z.object({
    body: z.object({
        productName: z.string( 'Nome do produto é obrigatório').min(1),
        price: z.number('Preço é obrigatório').positive(),
        amount: z.number( 'Quantidade é obrigatória').int().positive(),
        description: z.string('Descrição é obrigatória' ).min(1),
        image: z.string().url('URL da imagem inválida').nullable().optional(),
        userId: z.number( 'ID do usuário é obrigatório').int(),
    })
});

export const updateProductSchema = z.object({

    body: z.object({
        productName: z.string().min(1).optional(),
        price: z.number().positive().optional(),
        amount: z.number().int().positive().optional(),
        description: z.string().min(1).optional(),

    }),

    params: z.object({
        productId: z.string().refine((val) => !isNaN(parseInt(val, 10)), {
            message: "O ID do produto deve ser um número válido.",
        }),
    }),
});

export const deleteProductSchema = z.object({
    params: z.object({
        productId: z.string().refine((val) => !isNaN(parseInt(val, 10)), {
            message: "O ID do produto deve ser um número válido.",
        }),
    }),
});

export const getProductSchema = z.object({
    params: z.object({
        productId: z.string().refine((val) => !isNaN(parseInt(val, 10)), { message: "ID do produto deve ser um número" })
    })
});