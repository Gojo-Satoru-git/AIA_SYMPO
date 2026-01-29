import { db } from "../config/firebase.js";
import { error, success } from "../utils/response.js";

export const getAvailability = async (req, res, next) => {

    const ids = [10,11,12,13];

    try {
        const results = [];

        const refs = ids.map(id => db.collection("events").doc(String(id)));

        const snaps = await db.getAll(...refs); 

        snaps.forEach((snap, i) => {
            if (!snap.exists) {
            results.push({ id: ids[i], aval: false  });
            } else {
            const data = snap.data();
            const available = data.capacity - data.booked;
            results.push({ id: ids[i], aval: available > 0 });
            }
        });

        

        return success(res, { availability: results } );

    }
    catch (err) {
        console.error("Get Events Error:", err);
        return error(res, err.message || "Failed to fetch events");
    }
};
