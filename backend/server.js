// server.js
import express from 'express';
import { connectDB } from './config/connectDB.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRouter.js';
import accoRouter from './routes/accommodationRouter.js';
import bookingRouter from './routes/bookingRouter.js';
import './cron-job.js';

const app = express();
const PORT = process.env.PORT;
connectDB();

// Middleware
const allowedOrigins = ['http://localhost:5173']; // add more origins (e.g. deployment URL)
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Origin is allowed
    } else {
      callback(new Error('Not allowed by CORS')); // Origin is not allowed
    }
  },
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // send cookies
};
app.use(cors(corsOptions));
app.use(cookieParser({ credentials: true }));
app.use(express.json());

// Routes
app.use('/user', userRouter);
app.use('/accommodations', accoRouter);
app.use('/bookings', bookingRouter);

app.listen(PORT, () => {
  console.log(`Server is haunting on port: ${PORT}`);
});
