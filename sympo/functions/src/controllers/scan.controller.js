import {db} from '../config/firebase.js';

export const validateQR = async (req, res) => {
    try {
        const { qrToken } = req.body;

        if(!qrToken) {
          return res.status(400).json({message: "QR token missing"});
        }

        const snapshot = await db
            .collection("orders")
            .where("qrToken", "==", qrToken)
            .where("status", "==", "PAID")
            .limit(1)
            .get();

        if(snapshot.empty){
            return res.status(404).json({message: "Invalid QR Code"});
        }

        const doc = snapshot.docs[0];
        const orderData = doc.data();

        return res.status(200).json({
          success: true,
          orderId: doc.id,
          email: orderData.email,
          events: orderData.events,
        });
    } catch (err) {
        return res.status(500).json({message: "QR Validation failed"});
    }
};

export const confirmEntry = async (req, res) => {
  try {
    const { qrToken, eventId } = req.body;
    if (!qrToken || !eventId) return res.status(400).json({ message: "Missing info" });

    await db.runTransaction(async (t) => {
      const snapshot = await t.get(
        db.collection("orders").where("qrToken", "==", qrToken).limit(1)
      );

      if (snapshot.empty) throw new Error("INVALID_QR");

      const doc = snapshot.docs[0];
      const data = doc.data();

      let itemFound = false;
      
      const updatedItems = data.items.map(item => {
        if (String(item.eventId) === String(eventId)) {
          if (item.used) throw new Error("ALREADY_USED");
          itemFound = true;
          return { ...item, used: true, usedAt: new Date() };
        }
        return item;
      });

      if (!itemFound) throw new Error("EVENT_NOT_PURCHASED");

      t.update(doc.ref, { items: updatedItems });
    });

    return res.status(200).json({ success: true, message: "Entry verified" });

  } catch (error) {
    console.error("Scan Error:", error.message);
    if (error.message === "ALREADY_USED") return res.status(400).json({ message: "Ticket already used" });
    if (error.message === "EVENT_NOT_PURCHASED") return res.status(403).json({ message: "Event not in this ticket" });
    return res.status(500).json({ message: "Scan failed" });
  }
};