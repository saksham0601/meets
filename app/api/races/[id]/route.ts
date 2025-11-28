import Race from "@/models/Race";
import connectMongoDB from "@/lib/connection";
import { NextResponse } from "next/server";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  await connectMongoDB();
  const race = await Race.findById(id).lean();
  if (!race) return NextResponse.json({ error: "Race not found" }, { status: 404 });
  return NextResponse.json(race);
}
