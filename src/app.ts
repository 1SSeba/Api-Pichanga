import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import { db } from './config/database';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(compression());
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await db.connect();
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor iniciado en el puerto ${PORT}`);
      console.log(`🌐 Entorno: ${process.env.NODE_ENV}`);
      
      if (process.env.DEBUG_MODE === 'true') {
        console.log('🔧 Modo DEBUG activado:');
        console.log('   - Redis: Simulado en memoria');
        if (process.env.SKIP_CSRF === 'true') {
          console.log('   - CSRF: Protección desactivada');
        }
        console.log('   - MongoDB: Conectado a', process.env.MONGODB_URI);
      }
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();

// Manejar el cierre graceful
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await db.disconnect();
  process.exit(0);
});