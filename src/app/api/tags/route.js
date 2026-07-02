import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kamida-blog");

    // Get all posts and extract unique tags
    const posts = await db
      .collection("posts")
      .find({}, { projection: { tag: 1, category: 1 } })
      .toArray();

    const tagSet = new Set();

    posts.forEach((post) => {
      // Handle tag field (string or array)
      if (post.tag) {
        if (Array.isArray(post.tag)) {
          post.tag.forEach((t) => tagSet.add(t));
        } else {
          tagSet.add(post.tag);
        }
      }
      // Also add category as a tag
      if (post.category) {
        tagSet.add(post.category);
      }
    });

    const tags = Array.from(tagSet).sort();
    return NextResponse.json({ success: true, data: tags });
  } catch (error) {
    console.error("API Error /api/tags:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
