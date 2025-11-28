import connectMongoDB from "@/lib/connection";
import Sensor from "@/models/Sensor";
import mongoose from "mongoose";

export async function GET(req: Request, { params }: { params: Promise<{ raceId, swimmerId }> }) {
  const { raceId, swimmerId } = await params;

  const rId = new mongoose.Types.ObjectId(raceId);
  const sId = new mongoose.Types.ObjectId(swimmerId);

  await connectMongoDB();

  const next = await Sensor.find({
    raceId: rId,
    swimmerId: sId,
  })
    // .sort({ dataNumber: 1 })
    .lean();

  return Response.json(next || {});
}
