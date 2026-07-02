import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

/**
 * GET /api/views/[slug] — Get article visit count
 * POST /api/views/[slug] — Increment article visit count
 */

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const client = await clientPromise;
    const db = client.db("kamida-blog");
    const post = await db.collection("posts").findOne(
      { slug },
      { projection: { views: 1 } }
    );

    return NextResponse.json({
      success: true,
      data: { views: post?.views || 0 },
    });
  } catch (error) {
    console.error("API Error GET /api/views/[slug]:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { slug } = await params;
    const client = await clientPromise;
    const db = client.db("kamida-blog");

    const result = await db.collection("posts").findOneAndUpdate(
      { slug },
      {
        $inc: { views: 1 },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { views: result.views || 1 },
    });
  } catch (error) {
    console.error("API Error POST /api/views/[slug]:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
