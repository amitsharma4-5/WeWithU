import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  planId: {
    type: String,
  },

  amount: {
    type: Number,
  },

  credits: {
    type: Number,
  },

  razorpayOrderId: {
    type: String,
  },

  razorpayPaymentId: {
    type: String,
  },

  status: {
    type: String,
    enum: ["created", "paid", "failed"],
    default: "created",
  },
},
{
  timestamps: true
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;