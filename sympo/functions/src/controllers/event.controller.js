import { db } from "../config/firebase.js";
import { error, success } from "../utils/response.js";
import limitedSeatEvents from "../data/limitedSeatEvents.js";

export const getAvailability = async (req, res, next) => {

    try {
        const results = [];

        const refs = limitedSeatEvents.map(id => db.collection("events").doc(String(id)));

        const snaps = await db.getAll(...refs); 

        snaps.forEach((snap, i) => {
            if (!snap.exists) {
            results.push({ id: limitedSeatEvents[i], aval: false  });
            } else {
            const data = snap.data();
            const available = data.capacity - data.booked;
            results.push({ id: limitedSeatEvents[i], aval: available > 0 });
            }
        });

        

        return success(res, { availability: results } );

    }
    catch (err) {
        console.error("Get Events Error:", err);
        return error(res, err.message || "Failed to fetch events");
    }
};
