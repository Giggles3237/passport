import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import registerRouter from './routes/register.js';
import userRouter from './routes/user.js';
import stampRouter from './routes/stamp.js';
import locationRouter from './routes/location.js';

dotenv.config();

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : '(not set)');
console.log('DB_HOST:', process.env.DB_HOST);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'BMW Digital Passport backend running' });
});

app.use('/api/register', registerRouter);
app.use('/api/user', userRouter);
app.use('/api/stamp', stampRouter);
app.use('/api/location', locationRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 