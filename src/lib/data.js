import clientPromise from "./mongodb";

/**
 * Get profile data from MongoDB
 */
export async function getProfile() {
  try {
    const client = await clientPromise;
    const db = client.db("kamida-blog");
    const profile = await db.collection("profiles").findOne({});

    if (!profile) return null;

    return {
      ...profile,
      _id: profile._id.toString(),
    };
  } catch (error) {
    console.warn("Failed to fetch profile from MongoDB:", error.message);
    return null;
  }
}
