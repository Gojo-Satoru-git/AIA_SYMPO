import admin from "firebase-admin";

const db = admin.firestore();

export const searchCollege = async (req, res) => {
    try {
        const search = (req.query.search || "").toLowerCase().trim();

        if(search.length <= 3){
            return res.json([]);
        }

        const snapShot = await db.collection('colleges')
            .orderBy("name_lower")
            .where("name_lower", ">=", search)
            .where("name_lower", "<=", search + "\uf8ff")
            .limit(8)
            .get();

        const results = snapShot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
            state: doc.data().state,
            city: doc.data().city
        }));

        return res.status(200).json(results);
    }
    catch(Error) {
        console.error("College search error: ", Error);
        return res.status(500).json({Error: "Internal Server Error"});
    }
};