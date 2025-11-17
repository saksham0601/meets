import mongoose from "mongoose";

const RaceSchema = new mongoose.Schema(
  {
    meetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meet",
      required: true,
    },
    event: {
      gender: { type: String, enum: ["male", "female", "open"], required: true },
      stroke: { type: String, enum: ["Free", "Back", "Breast", "Fly", "IM"], required: true },
      distance: { type: Number, enum: [25, 50, 100, 150, 200, 400, 500, 800, 1000, 1500, 1650], required: true },
      category: { type: String, enum: ["6&U", "7–8", "8&U", "9–10", "10&U", "11–12", "13–14", "14&U", "15–17", "15–18", "18&U", "Open"], required: true },
    },
    heats: [
      {
        heatNumber: { type: Number, required: true, },
        startTime: { type: Date },
        laneAssignment: [
          {
            lane: { type: String, required: true },
            swimmerId: { type: mongoose.Schema.Types.ObjectId, required: true },
          }
        ],
        results: [
          {
            swimmerId: { type: mongoose.Schema.Types.ObjectId, required: true },
            time: { type: Number, required: true },
            place: { type: Number },
            status: { type: String, enum: ["valid", "dq", "dns", "dnf"], default: "valid" },
            points: { type: Number, default: 0 }
          }
        ],
      },
    ],
    status: {
      type: String,
      enum: ["planned", "ongoing", "completed", "cancelled"],
      default: "planned",
    },
  }
)

const Race = mongoose.models.Race || mongoose.model("Race", RaceSchema)
export default Race
