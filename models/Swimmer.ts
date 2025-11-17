import mongoose from "mongoose"

const SwimmerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    eventsEntered: {
      meetId: { type: mongoose.Schema.Types.ObjectId, ref: "Meet" },
      raceId: { type: mongoose.Schema.Types.ObjectId, ref: "Race" },
    },
    personalBests: [
      {
        stroke: { type: String, enum: ["Free", "Back", "Breast", "Fly", "IM"], required: true },
        distance: { type: Number, enum: [25, 50, 100, 150, 200, 400, 800, 1500, 1650], required: true },
        time: { type: Number, required: true },
        achievedAt: { type: mongoose.Schema.Types.ObjectId, ref: "Meet" },
        raceId: { type: mongoose.Schema.Types.ObjectId, ref: "Race" }
      }
    ]
  }
)

const Swimmer = mongoose.models.Swimmer || mongoose.model("Swimmer", SwimmerSchema)
export default Swimmer
