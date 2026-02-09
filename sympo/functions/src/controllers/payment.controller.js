import admin, { db } from "../config/firebase.js";
import crypto from "crypto";
import { createOrderRecord } from "../service/order.service.js";
import { createCashfreeOrder, fetchCashfreeOrder } from "../service/cashfree.service.js";

export const createOrder = async (req, res) => {
  try {
    const { items , promoCode } = req.body;

    const { totalAmount, totalOldAmount ,  orderId } = await createOrderRecord(req.user.uid, items , promoCode );

    const cashfreeOrder = await createCashfreeOrder({
      orderId,
      amount: totalAmount,
      customer: {
        uid: req.user.uid,
        email: req.user.email,
        phone: req.user.phone,
      },
    });

    await db.collection("orders").doc(orderId).update({
      cashfree_order_id: cashfreeOrder.order_id,
    });

    res.json({
      orderId: cashfreeOrder.order_id,
      paymentSessionId: cashfreeOrder.payment_session_id,
      totalOldAmount,
    });
  } catch (err) {
    res.status(400).json({ message: err.message, eventId: err.eventId });
  }
};


export const verifyOrder = async (req, res) => {
  try {
    const { orderId, teams } = req.body;

    const cashfreeOrder = await fetchCashfreeOrder(orderId);

    if (cashfreeOrder.order_status !== "PAID") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const orderRef = db.collection("orders").doc(orderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderSnap.data();
    if (order.status === "PAID") {
      return res.json({ success: true, qrToken: order.qrToken });
    }

    const qrToken = crypto.randomBytes(32).toString("hex");

    await orderRef.update({
      status: "PAID",
      cashfree_payment_id: cashfreeOrder.cf_order_id,
      qrToken,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    if (teams?.length) {
      for (const team of teams) {
        await db.collection("teams").add({
          teamData: JSON.parse(team.teamData),
          eventId: team.id,
          uid: req.user.uid,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    }

    res.json({ success: true, qrToken });
  } catch (err) {
    res.status(500).json({ message: "Verification failed" });
  }
};