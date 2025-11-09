import { NextResponse } from "next/server"
import Meet from "@/models/Meet"
import connectMongoDB from "connection.ts"

export async function GET () {
    await connectMongoDB();

    try {
        const meets = await Meet.find().sort({ "date.start": 1 })
        return NextResponse.json(meets);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to fetch meets" }, { status: 500});
    }
}

export async function POST(req: Request) {
  await connectDB();

  try {
    const data = await req.json();
    const newMeet = new Meet(data);
    await newMeet.save();
    return NextResponse.json(newMeet, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create meet" }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  await connectDB();

  try {
    const { id, ...updates } = await req.json();
    const updatedMeet = await Meet.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedMeet)
      return NextResponse.json({ error: "Meet not found" }, { status: 404 });
    return NextResponse.json(updatedMeet);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update meet" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  await connectDB();

  try {
    const { id } = await req.json();
    const deleted = await Meet.findByIdAndDelete(id);
    if (!deleted)
        return NextResponse.json({ error: "Meet not found" }, { status: 404 });
    return NextResponse.json({ meesage: "Meet deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete meet" }, { status: 400 });
  }
}
