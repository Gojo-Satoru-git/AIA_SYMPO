import { success ,error } from "../utils/response.js";
import {db} from '../config/firebase.js';


export const getPurchases = async (req, res) => {
  try {
    
    const uid = req.user.uid;

    //const uid = req.body.uid;

    const ordersSnap = await db.collection("orders")
      .where("userId", "==", uid)
      .where("status", "==", "PAID")
      .orderBy("createdAt", "desc")
      .get();

    const purchases = [];

    ordersSnap.forEach((doc) => {
      const orderData = doc.data();
      purchases.push({
        orderId: doc.id,
        amount: orderData.amount,
        events: orderData.items.map(item => ({
          eventId: item.eventId,
          title: item.title
        })),
        qrToken: orderData.qrToken
      });
    });

    return success(res, { purchases });

  } catch (err) {
    console.error("Get purchases error: ", err);
    return error(res, err.message);
  }
};


