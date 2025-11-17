import { NextResponse } from "next/server"
import Swimmer from "@/models/Swimmer"
import connectMongoDB from "@/lib/connection.ts"

export async function GET() {
  await connectMongoDB();

  try {
    const swimmers = await Swimmer.find().sort({ "date.start": 1 })
    return NextResponse.json(swimmers);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch swimmers" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectMongoDB();

    const data = await req.json();
    const newSwimmer = await Swimmer.create(data);
    return NextResponse.json(newSwimmer, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create Swimmer" }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  await connectMongoDB();

  try {
    const { id, ...updates } = await req.json();
    const updatedSwimmer = await Swimmer.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedSwimmer)
      return NextResponse.json({ error: "Swimmer not found" }, { status: 404 });
    return NextResponse.json(updatedSwimmer);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update swimmer" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  await connectMongoDB();

  try {
    const { id } = await req.json();
    const deleted = await Swimmer.findByIdAndDelete(id);
    if (!deleted)
      return NextResponse.json({ error: "Swimmer not found" }, { status: 404 });
    return NextResponse.json({ meesage: "Swimmer deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete swimmer" }, { status: 400 });
  }
}
