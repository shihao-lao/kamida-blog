import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const RATE_LIMIT_SECONDS = 60;

/**
 * GET /api/comments?slug=xxx — Get comments for an article
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Missing slug parameter" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("kamida-blog");

    const comments = await db
      .collection("comments")
      .find({ slug })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: comments.map((c) => ({
        _id: c._id.toString(),
        nickname: c.nickname,
        content: c.content,
        createdAt: c.createdAt,
      })),
    });
  } catch (error) {
    console.error("API Error GET /api/comments:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/comments — Submit a comment
 * Body: { slug, nickname, content }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { slug, nickname, content } = body;

    // Validation
    if (!slug || !content?.trim()) {
      return NextResponse.json(
        { success: false, error: "slug 和 content 不能为空" },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { success: false, error: "评论内容不能超过 1000 字" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("kamida-blog");

    // Rate limiting: check if same IP commented on same article recently
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const recentComment = await db.collection("comments").findOne({
      slug,
      ip,
      createdAt: { $gt: new Date(Date.now() - RATE_LIMIT_SECONDS * 1000) },
    });

    if (recentComment) {
      return NextResponse.json(
        { success: false, error: "操作太频繁，请稍后再试" },
        { status: 429 }
      );
    }

    // Insert comment
    const comment = {
      slug,
      nickname: (nickname?.trim() || "匿名游客").slice(0, 20),
      content: content.trim(),
      ip,
      createdAt: new Date(),
    };

    const result = await db.collection("comments").insertOne(comment);

    return NextResponse.json({
      success: true,
      data: {
        _id: result.insertedId.toString(),
        nickname: comment.nickname,
        content: comment.content,
        createdAt: comment.createdAt,
      },
    });
  } catch (error) {
    console.error("API Error POST /api/comments:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
