import {createRazorpayOrder, verifyRazorpayPayment} from '../service/razorpay.service.js';
import { db } from "../config/firebase.js";

export const createOrder = async (req, res) => {
    try {
        const {amount, cart} = req.body;

        const userId = req.user.uid; 
        const userEmail = req.user.email;

        if(!amount || !userId) return res.status(400).json({message: "Amount and UserId is required"});

        // Create order with Razorpay
        const order = await createRazorpayOrder(amount);

        // Save "Pending" order to Firebase
        await db.collection("orders").doc(order.id).set({
            userId,
            email: userEmail,
            amount,
            items: cart,
            status: "PENDING",
            createdAt: new Date().toISOString(),
            razorpay_order_id: order.id
        });

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({message: "Server error", error});
    }
};

export const verifyOrder = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const isValid = verifyRazorpayPayment( razorpay_order_id, razorpay_payment_id, razorpay_signature);

        if(isValid){
            // TODO: Here we can save the successful order to your Firebase Database
            await db.collection('orders').doc(razorpay_order_id).update({
                status: "PAID",
                paymentId: razorpay_payment_id,
                paidAt: new Date().toISOString(),
            });

            res.status(200).json({ message: "Payment verified successfully", success: true });
        }
        else{
            res.status(400).json({ message: "Invalid signature", success: false });
        }
    } catch (error) {
        res.status(500).json({ message: "Verification failed", error });
    }
}