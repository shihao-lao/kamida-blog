import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

/**
 * GET /api/views — Get total visit count
 * POST /api/views — Increment total visit count
 */

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("kamida-blog");
    const doc = await db.collection("visitors").findOne({ _id: "global" });

    return NextResponse.json({
      success: true,
      data: { totalViews: doc?.totalViews || 0 },
    });
  } catch (error) {
    console.error("API Error GET /api/views:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db("kamida-blog");

    const result = await db.collection("visitors").findOneAndUpdate(
      { _id: "global" },
      {
        $inc: { totalViews: 1 },
        $setOnInsert: { createdAt: new Date() },
        $set: { updatedAt: new Date() },
      },
      { upsert: true, returnDocument: "after" }
    );

    return NextResponse.json({
      success: true,
      data: { totalViews: result?.totalViews || 1 },
    });
  } catch (error) {
    console.error("API Error POST /api/views:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
