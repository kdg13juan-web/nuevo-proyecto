import express from 'express';
import {port} from './config.js';
import userRoutes from './routes/users.routes.js';
import authorsRouter from './routes/authors.routes.js';

const app = express();
app.use(express.json());

app.use(authorsRouter);
app.use(userRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});