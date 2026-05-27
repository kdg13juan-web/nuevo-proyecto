import express from 'express';
const app = express();
import { port } from './config.js';
import userRoutes from './routes/users.routes.js';

app.use(express.json());

app.use(userRoutes);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
}) ;