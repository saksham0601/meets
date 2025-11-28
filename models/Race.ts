import mongoose from "mongoose";

const RaceSchema = new mongoose.Schema(
  {
    meetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meet",
      required: true,
    },
    event: {
      gender: { type: String, enum: ["male", "female"], required: true },
      stroke: { type: String, enum: ["Freestyle", "Backstroke", "Breaststroke", "Butterfly", "Medley"], required: true },
      distance: { type: Number, enum: [50, 100, 150, 200, 400, 500, 800, 1000, 1500, 1650], required: true },
      ageCategory: {
        type: String,
        enum: ["10&U", "11-12", "13-14", "15-16", "17-19", "20&O"]
      }
    },
    heats: [
      {
        _id: false,
        heatNumber: { type: Number, required: true, },
        isFinal: { type: Boolean, required: true, default: false },
        startTime: { type: Date },
        laneAssignment: [
          {
            lane: { type: Number, required: true },
            swimmerId: { type: mongoose.Schema.Types.ObjectId, ref: "Swimmer", required: true },
          }
        ],
        results: [
          {
            swimmerId: { type: mongoose.Schema.Types.ObjectId, ref: "Swimmer", required: true },
            time: { type: Number, required: true },
            place: { type: Number },
            status: { type: String, enum: ["valid", "dq", "dns", "dnf"], required: true, default: "valid" },
            points: { type: Number, default: 0 }
          }
        ],
      },
    ],
    status: {
      type: String,
      enum: ["planned", "ongoing", "completed", "cancelled"],
      required: true,
      default: "planned",
    },
  }
)

const Race = mongoose.models.Race || mongoose.model("Race", RaceSchema)
export default Race
