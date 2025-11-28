import mongoose from "mongoose"

const SwimmerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      required: true,
      default: "active"
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    personalBests: [
      {
        _id: false,
        stroke: { type: String, enum: ["Free", "Back", "Breast", "Fly", "IM"], required: true },
        distance: { type: Number, enum: [25, 50, 100, 150, 200, 400, 800, 1500, 1650], required: true },
        ageCategory: {
          type: String,
          enum: ["10&U", "11-12", "13-14", "15-16", "17-19", "20&O"]
        },
        time: { type: Number, required: true },
        achievedOn: { type: Date, required: true },
        recordId: { type: mongoose.Schema.Types.ObjectId, ref: "Record" }
      }
    ]
  }
)

const Swimmer = mongoose.models.Swimmer || mongoose.model("Swimmer", SwimmerSchema)
export default Swimmer
