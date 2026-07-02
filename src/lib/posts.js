import clientPromise from "./mongodb";

/**
 * Get all posts from MongoDB, sorted by date descending
 */
export async function getAllPosts() {
  try {
    const client = await clientPromise;
    const db = client.db("kamida-blog");
    const posts = await db
      .collection("posts")
      .find({}, { projection: { content: 0 } })
      .sort({ date: -1 })
      .toArray();

    return posts.map((post) => ({
      ...post,
      _id: post._id.toString(),
    }));
  } catch (error) {
    console.warn("Failed to fetch posts from MongoDB:", error.message);
    return [];
  }
}

/**
 * Get a single post by slug (includes content)
 */
export async function getPostBySlug(slug) {
  try {
    const client = await clientPromise;
    const db = client.db("kamida-blog");
    const post = await db.collection("posts").findOne({ slug });

    if (!post) return null;

    return {
      ...post,
      _id: post._id.toString(),
    };
  } catch (error) {
    console.warn("Failed to fetch post from MongoDB:", error.message);
    return null;
  }
}
