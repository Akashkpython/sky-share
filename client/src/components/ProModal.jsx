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
  Crown,
  Flame,
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
          color: '#F59E0B', // Premium Amber Gold
          backdrop_color: 'rgba(0, 0, 0, 0.88)',
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
      <div className="relative space-y-6 text-sm text-[#bbbbbb] overflow-hidden">
        {/* Ambient Glowing Spotlights */}
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-gradient-to-br from-amber-500/25 via-yellow-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-gradient-to-tl from-[#22C55E]/20 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-purple-500/10 via-amber-500/10 to-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Success View */}
        {success ? (
          <div className="py-10 px-4 text-center space-y-5 animate-scale-in relative z-10">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-[#22C55E]/20 to-emerald-500/10 border-2 border-[#22C55E]/40 flex items-center justify-center text-[#22C55E] shadow-2xl shadow-[#22C55E]/20 animate-bounce">
              <Check className="w-10 h-10" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-3xl font-extrabold text-white tracking-tight">Payment Verified!</h3>
              <p className="text-base font-semibold bg-gradient-to-r from-[#22C55E] to-emerald-300 bg-clip-text text-transparent">
                Welcome to Sky Share Pro 🚀
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#111111]/90 backdrop-blur-md border border-[#2a2a2a] max-w-sm mx-auto text-left space-y-2 text-xs text-[#888] shadow-xl">
              <div className="flex justify-between items-center pb-2 border-b border-[#222]">
                <span>Transaction Ref:</span>
                <span className="font-mono text-white select-all bg-[#1a1a1a] px-2 py-0.5 rounded border border-[#333]">
                  {success.paymentId}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Activated Plan:</span>
                <span className="text-amber-400 font-bold">PRO (1 GB · 24h Expiry)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Account Status:</span>
                <span className="text-[#22C55E] font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" /> Active
                </span>
              </div>
            </div>

            <button
              onClick={resetState}
              className="w-full max-w-sm py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#22C55E] to-emerald-400 hover:from-emerald-400 hover:to-[#22C55E] text-black font-extrabold text-sm transition-all shadow-lg shadow-[#22C55E]/20 cursor-pointer"
            >
              Start Sharing Large Files
            </button>
          </div>
        ) : (
          <div className="relative z-10 space-y-6">
            {/* Header Hero */}
            <div className="text-center space-y-2.5">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/25 to-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-widest shadow-lg shadow-amber-500/10">
                <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-300/30" />
                <span>Premium Membership</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Supercharge Your{' '}
                <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                  Sky Share
                </span>
              </h3>

              <p className="text-xs text-[#999999] max-w-md mx-auto leading-relaxed">
                Built for creators, students, and power users who need high-capacity cloud sharing with lightning speeds.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/35 flex items-start gap-2.5 text-xs text-red-200 animate-slide-up">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-red-100">Checkout Alert</p>
                  <p className="text-red-300/90 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {/* Side-by-Side Comparison Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Free Tier */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0d0d0d]/90 backdrop-blur-sm border border-[#222222] space-y-3.5 flex flex-col justify-between">
                <div>
                  <div className="border-b border-[#222] pb-3">
                    <span className="text-[11px] uppercase text-[#777] font-bold tracking-widest">
                      Standard
                    </span>
                    <div className="text-2xl font-black text-white mt-1">₹0</div>
                    <p className="text-[11px] text-[#666]">Free forever for quick transfers</p>
                  </div>

                  <ul className="space-y-2.5 text-xs text-[#888] pt-3">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#555] shrink-0" /> Max 50 MB per file
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#555] shrink-0" /> 15-minute auto-expiry
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#555] shrink-0" /> 5 files per transfer
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#555] shrink-0" /> Standard 4-digit code
                    </li>
                  </ul>
                </div>
                <div className="text-[11px] text-[#555] italic">Current default plan</div>
              </div>

              {/* Pro Tier (Color-Full Ultra Premium Card) */}
              <div className="relative p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#181408] via-[#101010] to-[#0c120c] border-2 border-amber-400/60 shadow-2xl shadow-amber-500/20 space-y-3.5 overflow-hidden">
                {/* Glowing Top Pill */}
                <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[10px] font-black uppercase tracking-wider rounded-bl-xl shadow-md flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-current" />
                  <span>Popular</span>
                </div>

                <div className="border-b border-amber-500/30 pb-3">
                  <span className="text-[11px] uppercase text-amber-400 font-extrabold tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> PRO TIER
                  </span>
                  <div className="text-2xl font-black text-white mt-1 flex items-baseline gap-1.5">
                    <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                      ₹49
                    </span>
                    <span className="text-xs font-normal text-[#888]">/ month</span>
                  </div>
                  <p className="text-[11px] text-amber-200/80 font-medium">
                    Unlimited speed & extended cloud life
                  </p>
                </div>

                {/* Rich Colorful Pro Perks */}
                <ul className="space-y-2.5 text-xs">
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0">
                      <HardDrive className="w-3 h-3 text-purple-400" />
                    </div>
                    <span className="text-white font-semibold">1 GB per transfer</span>
                    <span className="text-[10px] text-purple-400 bg-purple-500/10 px-1.5 py-0.2 rounded font-mono ml-auto">
                      20x More
                    </span>
                  </li>

                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                      <Clock className="w-3 h-3 text-amber-400" />
                    </div>
                    <span className="text-white font-semibold">24 hours file life</span>
                    <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded font-mono ml-auto">
                      All Day
                    </span>
                  </li>

                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <Zap className="w-3 h-3 text-emerald-400" />
                    </div>
                    <span className="text-white font-semibold">20 files at once</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded font-mono ml-auto">
                      Batch
                    </span>
                  </li>

                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0">
                      <Lock className="w-3 h-3 text-rose-400" />
                    </div>
                    <span className="text-white font-medium">PIN & Password Shield</span>
                  </li>

                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-3 h-3 text-cyan-400" />
                    </div>
                    <span className="text-white font-medium">Turbo Cloud Bandwidth</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Glowing Golden Checkout Action Button */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:via-yellow-200 hover:to-amber-400 active:scale-[0.99] text-black font-extrabold text-sm sm:text-base transition-all shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-black" />
                  <span>Connecting to Razorpay...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 text-black group-hover:rotate-6 transition-transform" />
                  <span>Upgrade to Pro for ₹49</span>
                  <ArrowRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Supported Payment Badges & Trust Footer */}
            <div className="flex flex-col items-center gap-2 pt-1">
              <div className="flex items-center gap-2 text-[11px] text-[#777]">
                <span className="flex items-center gap-1 text-[#22C55E]">
                  <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit Bank Grade Encryption
                </span>
                <span>·</span>
                <span>Instant Auto-Activation</span>
              </div>
              <p className="text-[10px] text-[#555]">
                Supports Google Pay, PhonePe, Paytm, All Debit/Credit Cards & Netbanking
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
