import { NextResponse } from "next/server";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const post = await getPostBySlug(slug);
      if (!post) {
        return NextResponse.json(
          { success: false, error: "Post not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: post });
    }

    const posts = await getAllPosts();
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error("API Error /api/posts:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
