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
    coach: {
      type: String,
      required: true
    },
    swimmers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Swimmer"
      }
    ],
    seasonRank: [
      {
        season: { type: String, required: true },
        rank: { type: Number, required: true }
      }
    ],
    eventPoints: [
      {
        meedId: { type: mongoose.Schema.Types.ObjectId, required: true },
        points: { type: Number, required: true, default: 0 }
      }
    ]
  }
)

const Team = mongoose.models.Team || mongoose.model("Team", TeamSchema)
export default Team

