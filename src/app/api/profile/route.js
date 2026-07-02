import { NextResponse } from "next/server";
import { getProfile } from "@/lib/data";

export async function GET() {
  try {
    const profile = await getProfile();
    if (!profile) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error("API Error /api/profile:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
