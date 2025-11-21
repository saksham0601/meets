import connectMongoDB from "@/lib/connection";
import Team from "@/models/Team";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("q")?.trim() || "";

    await connectMongoDB();

    if (!q) {
      return NextResponse.json({ teams: [] });
    }

    const teams = await Team.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(10);

    return NextResponse.json({ teams });
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json({ teams: [], error: err.message }, { status: 500 });
  }
}

