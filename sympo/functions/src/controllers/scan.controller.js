import { db } from '../config/firebase.js';
import admin from 'firebase-admin';

export const validateQR = async (req, res) => {
  try {
    const { qrToken } = req.body;

    if (!qrToken) {
      return res.status(400).json({ message: "QR token missing" });
    }

    // 1. Fetch the Order
    const snapshot = await db
      .collection("orders")
      .where("qrToken", "==", qrToken)
      .where("status", "==", "PAID")
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "Invalid QR Code" });
    }

    const doc = snapshot.docs[0];
    const orderData = doc.data();

    let userName = "Guest";
    let userEmail = orderData.email || "N/A";

    const userId = orderData.userId || orderData.uid || orderData.user;

    if (userId) {
      try {
        const userDoc = await db.collection("users").doc(userId).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          userName = userData.name || userName;
          userEmail = userData.email || userEmail;
        }
      } catch (userErr) {
        console.warn("Could not fetch user details:", userErr);
      }
    }

    let currentItems = orderData.items || [];
    let itemsChanged = false;
    let finalItems = [];

    // 2. EXPANSION LOGIC: Check for "Passes" and expand them into Events
    // We iterate through items. If we find a Pass, we fetch its contents.
    for (const item of currentItems) {
      try {
        // Check the 'events' collection to see if this item has 'includes' (meaning it's a pass)
        const eventDoc = await db.collection("events").doc(item.eventId).get();
        const eventData = eventDoc.exists ? eventDoc.data() : null;

        if (eventData && Array.isArray(eventData.includes) && eventData.includes.length > 0) {
          // IT IS A PASS! Expand it.
          console.log(`Expanding Pass: ${item.title}`);
          itemsChanged = true;

          // Fetch details for all included events
          const subEvents = await Promise.all(eventData.includes.map(async (subEventId) => {
            const subDoc = await db.collection("events").doc(subEventId).get();
            const subData = subDoc.exists ? subDoc.data() : {};
            
            return {
              eventId: subEventId,
              title: subData.title || `Event ${subEventId}`, // Fallback title
              // If the main Pass was already used, mark sub-events as used. 
              // Otherwise, they start as unused.
              used: item.used || false, 
              usedAt: item.used ? item.usedAt : null
            };
          }));

          finalItems.push(...subEvents);
        } else {
          // Not a pass (or just a regular event), keep it as is
          finalItems.push(item);
        }
      } catch (err) {
        console.error(`Error expanding item ${item.eventId}:`, err);
        finalItems.push(item); // Safety fallback
      }
    }

    // 3. Update the Database if we expanded anything
    // This ensures next time we scan, it's already fixed in the DB.
    if (itemsChanged) {
      await doc.ref.update({ items: finalItems });
    }

    // 4. Return the expanded list to the Frontend
    return res.status(200).json({
      success: true,
      orderId: doc.id,
      email: userEmail,
      userName: userName,
      items: finalItems, 
    });

  } catch (err) {
    console.error("QR Validation Error:", err);
    return res.status(500).json({ message: "QR Validation failed" });
  }
};

export const confirmEntry = async (req, res) => {
  try {
    const { qrToken, eventId } = req.body;
    if (!qrToken || !eventId) return res.status(400).json({ message: "Missing info" });

    const snapshot = await db.collection("orders")
      .where("qrToken", "==", qrToken)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "Invalid QR Code" });
    }

    const doc = snapshot.docs[0];

    await db.runTransaction(async (t) => {
      const data = await t.get(doc.ref);

      if (!data.exists) throw new Error("ORDER_DISAPPEARED");

      const orderData = data.data();

      // Ensure items exist
      if (!orderData.items || !Array.isArray(orderData.items)) {
        throw new Error("NO_ITEMS_FOUND");
      }

      let itemFound = false;

      const updatedItems = orderData.items.map(item => {
        // Compare as strings to be safe
        if (String(item.eventId) === String(eventId)) {
          if (item.used) throw new Error("ALREADY_USED");
          itemFound = true;
          return { ...item, used: true, usedAt: admin.firestore.Timestamp.now() };
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
    if (error.message === "NO_ITEMS_FOUND") return res.status(404).json({ message: "No items found in this order" });
    return res.status(500).json({ message: "Scan failed" });
  }
};