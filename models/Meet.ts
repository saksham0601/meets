import mongoose from "mongoose";

const MeetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
      venueName: {
        type: String,
        required: true
      },
      city: {
        type: String,
      },
      country: {
        type: String,
      },
    },
    date: {
      start: {
        type: Date,
        required: true
      },
      end: {
        type: Date,
        required: true
      }
    },
    status: {
      type: String,
      enum: ["planned", "ongoing", "completed", "cancelled"],
      default: "planned",
      index: true,
    },
    races: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Race",
      }
    ],
    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
      }
    ],
    officials: [
      {
        name: { type: String, required: true },
        role: { type: String, required: true },
      }
    ],
  }
)

const Meet = mongoose.models.Meet || mongoose.model("Meet", MeetSchema)
export default Meet
