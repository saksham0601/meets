import mongoose from "mongoose"

const TeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    headCoach: {
      type: String,
      required: true
    },
    assistantHeadCoach: {
      type: String,
    },
    foundedYear: {
      type: Number,
      required: true
    },
    description: {
      type: String,
    },
    eventPoints: [
      {
        meetId: { type: mongoose.Schema.Types.ObjectId, ref: "Meet", required: true },
        rank: { type: Number },
        points: { type: Number, required: true, default: 0 }
      }
    ]
  }
)

const Team = mongoose.models.Team || mongoose.model("Team", TeamSchema)
export default Team

