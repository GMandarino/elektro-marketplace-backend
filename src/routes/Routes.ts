import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { ProductController } from '../controllers/ProductController';
import { validate } from '../middlewares/validateRequest';
import { createUserSchema, updateUserSchema } from '../schemas/user.schema';
import { createProductSchema, updateProductSchema } from '../schemas/product.schema';
import upload from '../middlewares/upload';
import passport from 'passport'; 



const router = Router();

// Rotas do Usuário
router.post("/user", validate(createUserSchema), UserController.createUser);
router.put("/user/:userId", validate(updateUserSchema), UserController.UpdateUser);
router.post("/login", UserController.loginUser);
router.get("/user",UserController.acessUser);

// Rotas que não recebem dados no body não precisam de validação. Rescrito após recomendações na internet
router.get("/user/:userId", UserController.readUser);
router.get("/users", UserController.readAllUsers);
router.delete("/user/:userId", UserController.deleteUser);


// Rotas de Produto
router.post("/product", validate(createProductSchema), ProductController.createProduct);
router.put("/product/:productId", validate(updateProductSchema), ProductController.updateProduct);
router.post("/product", upload.single('image'), ProductController.createProduct);
router.get("/users/:userId/products", ProductController.getProductsByUser);

// Rotas sem validação de "body"
router.get("/products", ProductController.getAllProducts);
router.get("/product/:productId", ProductController.getProductById);
router.delete("/product/:productId", ProductController.deleteProduct);




export default router;