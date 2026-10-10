"use client";

import { useState } from "react";
import { CreditCard, Smartphone, Building2, ShieldCheck } from "lucide-react";

type Props = {
  price: number;
  onPay: (paymentData?: { method: string; advancePaid: number; dueAtVenue: number }) => void;
};

export default function PaymentCard({ price, onPay }: Props) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "venue">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [venuePaymentType, setVenuePaymentType] = useState<"upi" | "card">("upi");
  const [venueUpiId, setVenueUpiId] = useState("");
  const [upiError, setUpiError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // 20% Advance Reservation Token Deposit (Minimum ₹50)
  const advancePrice = Math.max(50, Math.round(price * 0.2));
  const remainingPrice = Math.max(0, price - advancePrice);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === "card") {
      if (!cardNumber || !expiry || !cvv || !name) {
        alert("Please fill in all credit/debit card details.");
        return;
      }
    } else if (paymentMethod === "upi") {
      if (!upiId) {
        setUpiError("UPI ID is required.");
        return;
      }
      if (!upiId.includes("@")) {
        setUpiError("Please enter a valid UPI ID (e.g. name@bank).");
        return;
      }
    } else if (paymentMethod === "venue") {
      if (venuePaymentType === "upi") {
        if (!venueUpiId || !venueUpiId.includes("@")) {
          setUpiError("Please enter a valid UPI ID to pay the token deposit.");
          return;
        }
      } else if (venuePaymentType === "card") {
        if (!cardNumber || !name) {
          alert("Please enter card details for the reservation deposit.");
          return;
        }
      }
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPay({
        method: paymentMethod,
        advancePaid: paymentMethod === "venue" ? advancePrice : price,
        dueAtVenue: paymentMethod === "venue" ? remainingPrice : 0,
      });
    }, 1800);
  };

  return (
    <div className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-zinc-900">
        <div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">
            Select Payment Mode
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5 font-medium">
            Choose your preferred arena pass checkout option
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[10px] text-red-400 font-black uppercase tracking-widest bg-red-950/50 px-3 py-1.5 rounded-full border border-red-500/20">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          SSL Encrypted
        </span>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-black rounded-2xl border border-zinc-800">
        <button
          type="button"
          onClick={() => setPaymentMethod("card")}
          className={`flex items-center justify-center gap-2 py-3 px-2 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer ${
            paymentMethod === "card"
              ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Card</span>
        </button>
        <button
          type="button"
          onClick={() => setPaymentMethod("upi")}
          className={`flex items-center justify-center gap-2 py-3 px-2 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer ${
            paymentMethod === "upi"
              ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>UPI</span>
        </button>
        <button
          type="button"
          onClick={() => setPaymentMethod("venue")}
          className={`flex items-center justify-center gap-2 py-3 px-2 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer ${
            paymentMethod === "venue"
              ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Pay at Venue</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Card Payment Form */}
        {paymentMethod === "card" && (
          <div className="space-y-5">
            {/* Credit Card Mock Visual */}
            <div className="w-full aspect-[1.7/1] max-w-sm mx-auto bg-gradient-to-tr from-red-600 via-rose-700 to-zinc-950 rounded-2xl p-6 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden select-none border border-red-500/30">
              <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex justify-between items-start">
                <span className="text-[10px] tracking-widest font-black text-red-100 uppercase">ATHLETIC PASS</span>
                <CreditCard className="w-6 h-6 text-white" />
              </div>

              <div className="relative z-10 space-y-4">
                <p className="text-lg md:text-xl font-black tracking-[0.2em] font-mono text-white drop-shadow">
                  {cardNumber || "•••• •••• •••• ••••"}
                </p>
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[9px] text-red-200 block uppercase font-black tracking-wider">Cardholder</span>
                    <span className="text-xs font-black truncate max-w-[150px] inline-block uppercase text-white drop-shadow">
                      {name || "DEMO ATHLETE"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-red-200 block uppercase font-black tracking-wider">Expires</span>
                    <span className="text-xs font-black font-mono text-white drop-shadow">
                      {expiry || "MM/YY"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-300 font-black uppercase tracking-wider block">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value.toUpperCase())}
                  placeholder="DEMO ATHLETE"
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:border-red-500 outline-none text-white transition-all font-bold uppercase"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-300 font-black uppercase tracking-wider block">
                  Card Number
                </label>
                <input
                  type="text"
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    const formatted = val.match(/.{1,4}/g)?.join(" ") || "";
                    setCardNumber(formatted);
                  }}
                  placeholder="4111 2222 3333 4444"
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:border-red-500 outline-none text-white transition-all font-mono font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-300 font-black uppercase tracking-wider block">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    maxLength={5}
                    value={expiry}
                    placeholder="MM/YY"
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, "");
                      if (val.length > 2) val = val.substring(0, 2) + "/" + val.substring(2);
                      setExpiry(val);
                    }}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:border-red-500 outline-none text-white transition-all font-mono font-bold"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-300 font-black uppercase tracking-wider block">
                    CVV Code
                  </label>
                  <input
                    type="password"
                    maxLength={3}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                    placeholder="•••"
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:border-red-500 outline-none text-white transition-all font-mono font-bold"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full UPI Payment Form */}
        {paymentMethod === "upi" && (
          <div className="space-y-5">
            <div className="bg-black border border-zinc-800 rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-red-950/40 text-red-500 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <Smartphone className="w-6 h-6" />
            </div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight">
                Instant Online UPI Payment
              </h4>
              <p className="text-xs font-semibold text-zinc-400 leading-relaxed max-w-sm mx-auto">
                Pay instantly using Google Pay, PhonePe, Paytm, or any UPI banking app.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-300 font-black uppercase tracking-wider block">
                UPI ID (Virtual Address)
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => {
                  setUpiId(e.target.value);
                  setUpiError("");
                }}
                placeholder="e.g. athlete@upi or 9876543210@paytm"
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:border-red-500 outline-none text-white transition-all font-mono font-bold"
                required
              />
              {upiError && (
                <p className="text-xs text-red-500 font-black mt-1">{upiError}</p>
              )}
            </div>
          </div>
        )}

        {/* Pay at Venue (Advance Token Deposit required) */}
        {paymentMethod === "venue" && (
          <div className="space-y-5">
            <div className="bg-red-950/30 border border-red-500/30 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-red-400">
                <Building2 className="w-5 h-5 shrink-0 text-red-500" />
                <h4 className="text-sm font-black uppercase tracking-tight">
                  Pay at Venue (Slot Reservation)
                </h4>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                To lock your court slot, a small <span className="font-black text-red-400">20% advance token deposit</span> is required. The remaining balance is paid directly at the venue reception.
              </p>

              <div className="bg-black rounded-xl p-4 border border-zinc-800 space-y-2.5 text-xs font-bold">
                <div className="flex justify-between items-center text-zinc-300">
                  <span>Advance Token Deposit (Pay Now)</span>
                  <span className="font-black text-red-400 text-sm">₹{advancePrice}</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400 border-t border-zinc-900 pt-2">
                  <span>Remaining Balance (Pay at Reception)</span>
                  <span className="font-extrabold text-white">₹{remainingPrice}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs text-zinc-300 font-black uppercase tracking-wider block">
                Pay Token Deposit (₹{advancePrice}) via
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setVenuePaymentType("upi")}
                  className={`py-2.5 px-4 rounded-xl text-xs font-black uppercase border transition flex items-center justify-center gap-2 cursor-pointer ${
                    venuePaymentType === "upi"
                      ? "bg-red-600 text-white border-red-500"
                      : "bg-black border-zinc-800 text-zinc-400"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>UPI ID</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVenuePaymentType("card")}
                  className={`py-2.5 px-4 rounded-xl text-xs font-black uppercase border transition flex items-center justify-center gap-2 cursor-pointer ${
                    venuePaymentType === "card"
                      ? "bg-red-600 text-white border-red-500"
                      : "bg-black border-zinc-800 text-zinc-400"
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Card</span>
                </button>
              </div>

              {venuePaymentType === "upi" ? (
                <div className="space-y-1.5 pt-1">
                  <input
                    type="text"
                    value={venueUpiId}
                    onChange={(e) => {
                      setVenueUpiId(e.target.value);
                      setUpiError("");
                    }}
                    placeholder="Enter UPI ID for ₹50 deposit"
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:border-red-500 outline-none text-white font-mono font-bold"
                    required
                  />
                  {upiError && <p className="text-xs text-red-500 font-black">{upiError}</p>}
                </div>
              ) : (
                <div className="space-y-3 pt-1">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value.toUpperCase())}
                    placeholder="Cardholder Name"
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:border-red-500 outline-none text-white font-bold uppercase"
                    required
                  />
                  <input
                    type="text"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      const formatted = val.match(/.{1,4}/g)?.join(" ") || "";
                      setCardNumber(formatted);
                    }}
                    placeholder="4111 2222 3333 4444"
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:border-red-500 outline-none text-white font-mono font-bold"
                    required
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isProcessing}
          className={`w-full py-4 rounded-2xl font-black text-white text-center shadow-lg transition-all duration-300 uppercase tracking-widest text-xs cursor-pointer ${
            isProcessing
              ? "bg-red-900 cursor-wait opacity-80"
              : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-red-600/30 active:scale-[0.98]"
          }`}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {paymentMethod === "venue"
                ? `Reserving Slot & Paying ₹${advancePrice} Deposit...`
                : "Processing Payment..."}
            </span>
          ) : paymentMethod === "venue" ? (
            `Pay ₹${advancePrice} Token & Reserve (Pay ₹${remainingPrice} at Venue)`
          ) : (
            `Confirm Booking (Pay ₹${price})`
          )}
        </button>
      </form>
    </div>
  );
}
