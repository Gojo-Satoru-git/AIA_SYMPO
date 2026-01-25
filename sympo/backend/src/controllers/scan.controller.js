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

        if(orderData.isUsed) {
          return res.status(400).json({
            message: "QR already used",
          })
        }

        return res.status(200).json({
          success: true,
          orderId: doc.id,
          email: orderData.email,
          events: orderData.events,
          amount: orderData.amount,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "QR Validation failed"});
    }
};

export const confirmEntry = async (req, res) => {
  try {
    const { qrToken, eventId } = req.body;

    if (!qrToken || !eventId ) {
      return res.status(400).json({ message: "Missing QR Code" });
    }

    const snapshot = await db.collection("orders")
                            .where("qrToken", "==", qrToken)
                            .where("status", "==", "PAID")
                            .limit(1)
                            .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "Invalid QR Code" });
    }

    const doc = snapshot.docs[0];
    const orderData = doc.data();

    const updatedEvents = orderData.events.map(event => {
      if (event.id === String(eventId)) {
        if (event.used) {
          throw new Error("Event already verified");
        }
        return { ...event, used: true };
      }
      return event;
    });

    await doc.ref.update({
      events: updatedEvents,
    })

    return res.status(200).json({
      success: true,
      message: "Event verified successfully",
      events: updatedEvents,
    });

  } catch (error) {
    console.error("Confirm entry error:", error);
    return res.status(500).json({ message: "Failed to confirm entry" });
  }
};
