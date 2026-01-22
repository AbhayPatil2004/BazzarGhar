import razorpay from "./razorpay.js";
import crypto from "crypto";

export default async function createOrder(amount) {
  try {
    if (!amount || amount <= 0) {
      throw new Error("Invalid amount");
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, 
      currency: "INR",
      receipt: `rcpt_${Date.now()}`

    });

    return order;
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    throw new Error(
      error?.error?.description || "Error occurred while creating order"
    );
  }
}
