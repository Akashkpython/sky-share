import { useState } from 'react';
import {
  Sparkles,
  Check,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  HardDrive,
  Lock,
  Loader2,
  AlertCircle,
  CreditCard,
} from 'lucide-react';
import Modal from './Modal';
import { createPaymentOrder, verifyPayment } from '../services/api';

export default function ProModal({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if Razorpay SDK is loaded
      if (typeof window.Razorpay === 'undefined') {
        throw new Error('Razorpay SDK failed to load. Please refresh and check your internet connection.');
      }

      // Step 1: Create Order on Backend (4900 paise = ₹49)
      const order = await createPaymentOrder(4900, 'INR', `pro_sub_${Date.now()}`);

      if (!order || !order.order_id) {
        throw new Error(order?.error?.message || 'Failed to create payment order. Please try again.');
      }

      const keyId =
        order.key_id ||
        import.meta.env.VITE_RAZORPAY_KEY_ID ||
        'rzp_test_U059FW6ytRCH8J';

      // Absolute image URL required by Razorpay iframe
      const logoUrl = `${window.location.origin}/logo-icon.png`;

      // Step 2: Open Razorpay Checkout Modal
      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'Sky Share',
        description: 'Sky Share Pro Upgrade (1 Month)',
        image: logoUrl,
        order_id: order.order_id,
        handler: async function (response) {
          try {
            setLoading(true);
            // Step 3: Verify Payment Signature on Backend
            const verification = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verification.success) {
              setSuccess({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
              });
            } else {
              setError(verification.error?.message || 'Payment verification failed.');
            }
          } catch (verifyErr) {
            console.error('Verification error:', verifyErr);
            setError(
              verifyErr.response?.data?.error?.message ||
                verifyErr.message ||
                'Payment verification failed.'
            );
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: 'Akash K',
          email: 'akashkkotari@gmail.com',
          contact: '8792284825',
        },
        notes: {
          plan: 'Sky Share Pro (Monthly)',
        },
        theme: {
          color: '#22C55E', // Sky Share Green
          backdrop_color: 'rgba(0, 0, 0, 0.85)',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);

      // Handle payment failure event
      razorpayInstance.on('payment.failed', function (response) {
        console.error('Payment failed event:', response.error);
        setError(response.error?.description || response.error?.reason || 'Payment failed.');
        setLoading(false);
      });

      razorpayInstance.open();
    } catch (err) {
      console.error('Checkout initialization error:', err);
      setError(
        err.response?.data?.error?.message ||
          err.message ||
          'Could not start checkout. Please try again.'
      );
      setLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setSuccess(null);
    setLoading(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={resetState} title="Sky Share Pro" maxWidth="sm:max-w-xl">
      <div className="space-y-6 text-sm text-[#bbbbbb]">
        {/* Success View */}
        {success ? (
          <div className="py-8 px-4 text-center space-y-4 animate-scale-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E] shadow-xl shadow-[#22C55E]/10">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-white">Payment Successful!</h3>
              <p className="text-sm text-[#22C55E] font-medium">Welcome to Sky Share Pro 🚀</p>
            </div>

            <div className="p-4 rounded-xl bg-[#111] border border-[#222] max-w-sm mx-auto text-left space-y-1.5 text-xs text-[#888]">
              <div className="flex justify-between">
                <span>Payment ID:</span>
                <span className="font-mono text-white select-all">{success.paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span>Plan:</span>
                <span className="text-[#22C55E] font-medium">Pro (1 GB · 24h Expiry)</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-white font-medium">Active</span>
              </div>
            </div>

            <button
              onClick={resetState}
              className="w-full max-w-sm py-3 px-4 rounded-xl bg-[#22C55E] hover:bg-[#16a34a] text-black font-semibold text-sm transition-all shadow-md cursor-pointer"
            >
              Start Sharing Larger Files
            </button>
          </div>
        ) : (
          <>
            {/* Header Hero */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 via-yellow-500/20 to-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Premium Tier
              </div>
              <h3 className="text-white text-xl font-bold">Transfer Without Limits</h3>
              <p className="text-xs text-[#888888] max-w-sm mx-auto">
                Designed for students, power users, and creators who need larger files and longer storage.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-red-200">Payment Error</p>
                  <p className="text-red-300/80 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Free Tier */}
              <div className="p-4 rounded-2xl bg-[#0e0e0e] border border-[#222222] space-y-3">
                <div className="border-b border-[#222] pb-3">
                  <span className="text-xs uppercase text-[#888] font-semibold tracking-wider">Free</span>
                  <div className="text-xl font-bold text-white mt-1">₹0</div>
                  <p className="text-[11px] text-[#666]">Standard sharing</p>
                </div>
                <ul className="space-y-2 text-xs text-[#888]">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#666] shrink-0" /> Max 50 MB / file
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#666] shrink-0" /> 15-minute auto-expiry
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#666] shrink-0" /> 5 files per transfer
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#666] shrink-0" /> 4-digit code access
                  </li>
                </ul>
              </div>

              {/* Pro Tier */}
              <div className="relative p-4 rounded-2xl bg-[#141410] border border-amber-500/40 shadow-lg shadow-amber-500/5 space-y-3">
                <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-bold uppercase tracking-wider">
                  Recommended
                </div>
                <div className="border-b border-amber-500/20 pb-3">
                  <span className="text-xs uppercase text-amber-400 font-semibold tracking-wider">Pro</span>
                  <div className="text-xl font-bold text-white mt-1">
                    ₹49 <span className="text-xs font-normal text-[#888]">/ month</span>
                  </div>
                  <p className="text-[11px] text-amber-200/70">Less than a cup of tea</p>
                </div>
                <ul className="space-y-2 text-xs text-[#ddd]">
                  <li className="flex items-center gap-2">
                    <HardDrive className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="font-medium text-white">Up to 1 GB</span> per transfer
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="font-medium text-white">24 hours</span> file expiration
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="font-medium text-white">20 files</span> at once
                  </li>
                  <li className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    Password & PIN protection
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    Priority cloud speed
                  </li>
                </ul>
              </div>
            </div>

            {/* Standard Razorpay Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold text-sm transition-all shadow-md hover:shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting to Razorpay...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Pay ₹49 with Razorpay (Cards, UPI, Netbanking)</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>

            {/* Security Badges */}
            <div className="flex items-center justify-center gap-4 text-[11px] text-[#666] pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" /> 256-bit SSL Secure
              </span>
              <span>·</span>
              <span>Powered by Razorpay</span>
              <span>·</span>
              <span>Instant Activation</span>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
