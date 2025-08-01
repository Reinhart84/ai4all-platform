// functions/getImages.js
const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

exports.getImages = onRequest({ region: "us-central1" }, async (req, res) => {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const snapshot = await db
      .collection("images")
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();

    const images = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return res.status(200).json({ images });
  } catch (err) {
    console.error("Firestore read error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});
