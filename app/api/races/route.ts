import { NextResponse } from "next/server"
import Race from "@/models/Race"
import connectMongoDB from "@/lib/connection.ts"

export async function GET() {
  await connectMongoDB();

  try {
    const races = await Race.find().sort({ "date.start": 1 })
    return NextResponse.json(races);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch races" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectMongoDB();

    const data = await req.json();
    const newRace = await Race.create(data);
    return NextResponse.json(newRace, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create race" }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  await connectMongoDB();

  try {
    const { id, ...updates } = await req.json();
    const updatedRace = await Race.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedRace)
      return NextResponse.json({ error: "Race not found" }, { status: 404 });
    return NextResponse.json(updatedRace);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update race" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  await connectMongoDB();

  try {
    const { id } = await req.json();
    const deleted = await Race.findByIdAndDelete(id);
    if (!deleted)
      return NextResponse.json({ error: "Race not found" }, { status: 404 });
    return NextResponse.json({ meesage: "Race deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete race" }, { status: 400 });
  }
}
