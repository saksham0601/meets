import { NextResponse } from "next/server"
import Record from "@/models/Record"
import connectMongoDB from "@/lib/connection.ts"

export async function GET() {
  await connectMongoDB();

  try {
    const records = await Record.find()
    return NextResponse.json(records);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch records" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectMongoDB();

    const data = await req.json();
    const newRecord = await Record.create(data);
    return NextResponse.json(newRecord, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create records" }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  await connectMongoDB();

  try {
    const { id, ...updates } = await req.json();
    const updatedRecord = await Record.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedRecord)
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    return NextResponse.json(updatedRecord);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update records" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  await connectMongoDB();

  try {
    const { id } = await req.json();
    const deleted = await Record.findByIdAndDelete(id);
    if (!deleted)
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    return NextResponse.json({ meesage: "Record deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete records" }, { status: 400 });
  }
}
