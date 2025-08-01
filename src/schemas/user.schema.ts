//import {Request, Response} from 'express';
import { z } from 'zod';

export const createUserSchema = z.object({
    body: z.object({
        userName: z
            .string('userName é obrigatório.')
            .min(2)
            .default(''),
        cpf: z
            .string( 'CPF é obrigatório.' )
            .length(11),
        email: z
            .email('Email é obrigatório.' ),
        telefone: z
            .string('Telefone é obrigatório.' )
            .length(11),
        password: z
            .string( 'Senha é obrigatória.' )
            .min(6)
            .default(''),
       /* hash: z
            .string( 'Hash é obrigatório.' )
            .default(''),
        salt: z
            .string('Salt é obrigatório.' )
            .default(''),*/
        rating: z
            .number()
            .optional()
            
    })
});

export const updateUserSchema = z.object({
    body: z.object({
        userName: z
            .string()
            .min(2).optional(),
        email:z.email()
            .optional(),
        cpf: z.string()
            .length(11)
            .optional(),
        telefone: z
            .string()
            .length(11)
            .optional(),
        password: z
            .string()
            .min(6)
            .optional(),
       /* hash: z
            .string()
            .optional(),
        salt: z
            .string()
            .optional(),*/
        rating: z
            .number()
            .optional(),
    }),
    params: z.object({
         userId: z.string().refine((val) => !isNaN(parseInt(val, 10)), { message: "ID do usuário deve ser um número" })
    })
});