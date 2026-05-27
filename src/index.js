import express from 'express';
import { port } from './config.js';
import userRoutes from './routes/users.routes.js';
import authorsRouter from './routes/authors.routes.js';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import yaml from 'yaml';

// Para leer la ruta del archivo correctamente en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Leer el archivo YAML y convertirlo a objeto JS
const swaggerDocument = yaml.parse(
  readFileSync(join(__dirname, '../docs/openapi.yaml'), 'utf8')
);

const app = express();
app.use(express.json());

// Ruta de documentación Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  swaggerOptions: {
    url: '/api-docs/swagger.json'
  }
}));

// Agregá esta ruta también — sirve el JSON directo
app.get('/api-docs/swagger.json', (req, res) => {
  res.json(swaggerDocument);
});
app.use(authorsRouter);
app.use(userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Documentación en http://localhost:${port}/api-docs`);
});