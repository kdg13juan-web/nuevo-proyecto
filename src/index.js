import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import yaml from 'yaml';

import authorsRouter from './routes/authors.routes.js';
import postsRouter   from './routes/posts.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const swaggerDocument = yaml.parse(
  readFileSync(join(__dirname, '../docs/openapi.yaml'), 'utf8')
);

const app  = express();
const port = process.env.PORT || 4000;

app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/api-docs/swagger.json', (req, res) => res.json(swaggerDocument));

// Routers — posts primero para que /authors/posts no colisione con /authors/:id
app.use(postsRouter);
app.use(authorsRouter);

// Middleware global de errores (siempre al final)
app.use(errorHandler);

export { app };

app.listen(port, () => {
  console.log(`Server corriendo en http://localhost:${port}`);
  console.log(`Docs en http://localhost:${port}/api-docs`);
});
