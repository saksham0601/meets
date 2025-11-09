import { NextResponse } from "next/server"
import Team from "@/models/Team"
import connectMongoDB from "connection.ts"

export async function GET () {
    await connectMongoDB();

    try {
        const meets = await Team.find().sort({ "date.start": 1 })
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
    const newTeam = new Team(data);
    await newTeam.save();
    return NextResponse.json(newTeam, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create meet" }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  await connectDB();

  try {
    const { id, ...updates } = await req.json();
    const updatedTeam = await Team.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedTeam)
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    return NextResponse.json(updatedTeam);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update meet" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  await connectDB();

  try {
    const { id } = await req.json();
    const deleted = await Team.findByIdAndDelete(id);
    if (!deleted)
        return NextResponse.json({ error: "Team not found" }, { status: 404 });
    return NextResponse.json({ meesage: "Team deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete meet" }, { status: 400 });
  }
}
