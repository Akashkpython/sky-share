import express from 'express';
import { setupSecurity } from './middleware/security.js';
import healthRoutes from './routes/healthRoutes.js';
import transferRoutes from './routes/transferRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security middleware
setupSecurity(app);

// Routes
app.use('/api', healthRoutes);
app.use('/api', transferRoutes);
app.use('/api', paymentRoutes);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
