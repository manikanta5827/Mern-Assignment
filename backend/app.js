import express from 'express';
import dotenv from 'dotenv';
import employeeRoutes from './routes/employeeRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler } from './utils/errorHandler.js';
import connectDB from './config/db.js';
import morgan from 'morgan';
import cors from 'cors';


dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/employees', employeeRoutes);
app.use('/api', authRoutes);

// Error handling middleware
app.use(errorHandler);
app.use(morgan('dev'));
app.get('/', (req, res) => {
  res.send('Hello, World!');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
