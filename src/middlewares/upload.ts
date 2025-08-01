import multer from 'multer';
import path from 'path'; 

// Configuração do Armazenamento 
const storage = multer.diskStorage({
    
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

// Filtro de Arquivos
const fileFilter = (req: any, file: any, cb: any) => {
  
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);

    } else {
        cb(new Error('Tipo de arquivo não suportado! Apenas JPEG e PNG são permitidos.'), false);
    }
};

// Criação da instância do Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 
    }
});

export default upload;