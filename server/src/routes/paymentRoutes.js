import { Router } from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';

const router = Router();

// Standard Razorpay Endpoints
router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);

// Namespaced aliases
router.post('/payment/create-order', createOrder);
router.post('/payment/verify', verifyPayment);

export default router;
