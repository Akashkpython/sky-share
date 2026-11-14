import crypto from 'crypto';
import { getRazorpay } from '../config/razorpay.js';
import env from '../config/env.js';

/**
 * POST /api/create-order (and /api/payment/create-order)
 * Request body: { amount: number (in paise), currency?: string, receipt?: string }
 */
export async function createOrder(req, res) {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || typeof amount !== 'number' || amount < 100) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_AMOUNT',
          message: 'Amount is required and must be at least 100 paise (₹1).',
        },
      });
    }

    const razorpay = getRazorpay();

    const options = {
      amount: Math.round(amount),
      currency: currency.toUpperCase(),
      receipt: receipt || `receipt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      order_id: order.id,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      key_id: env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    if (error.statusCode === 401 || error.error?.code === 'BAD_REQUEST_ERROR') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTH_FAILED',
          message: error.description || 'Razorpay authentication failed.',
        },
      });
    }
    return res.status(500).json({
      success: false,
      error: {
        code: 'ORDER_CREATION_FAILED',
        message: error.message || 'Failed to create Razorpay order.',
      },
    });
  }
}

/**
 * POST /api/verify-payment (and /api/payment/verify)
 * Request body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
export async function verifyPayment(req, res) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'razorpay_order_id, razorpay_payment_id, and razorpay_signature are required.',
        },
      });
    }

    if (!env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_CONFIG_ERROR',
          message: 'Razorpay secret key is not configured on server.',
        },
      });
    }

    // Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    // Validate signature length before timing-safe comparison
    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
    const receivedBuffer = Buffer.from(razorpay_signature, 'utf8');

    const isAuthentic =
      expectedBuffer.length === receivedBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

    if (!isAuthentic) {
      console.warn('Payment verification failed: Signature mismatch', {
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
      });
      return res.status(400).json({
        success: false,
        error: {
          code: 'SIGNATURE_MISMATCH',
          message: 'Payment verification failed. Invalid signature.',
        },
      });
    }

    console.log('Payment verified successfully!', {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    });

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully.',
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
    });
  } catch (error) {
    console.error('Razorpay Verify Payment Error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'VERIFICATION_ERROR',
        message: error.message || 'Payment verification failed.',
      },
    });
  }
}
