import mongoose from "mongoose"

const RecordSchema = new mongoose.Schema(
  {
    recordType: {
      type: String,
      enum: ["PB", "WR", "PR", "MR"],
      required: true
    },

    swimmerId: {
      type: mongoose.Types.ObjectId,
      ref: "Swimmer",
      required: true
    },

    event: {
      stroke: { type: String, enum: ["Free", "Back", "Breast", "Fly", "IM"], required: true },
      distance: { type: Number, enum: [25, 50, 100, 150, 200, 400, 800, 1500, 1650], required: true },
      gender: { type: String, enum: ["male", "female"], required: true },
      category: {
        type: String,
        enum: ["6&U", "7–8", "8&U", "9–10", "10&U", "11–12", "13-14", "14&U", "15-17", "15-18", "18&U", "Open"],
        required: true
      }
    },

    time: { type: Number, required: true },

    achievedAt: { type: Date, required: true },
    meetId: { type: mongoose.Types.ObjectId, ref: "Meet" },
    raceId: { type: mongoose.Types.ObjectId, ref: "Race" },
  }
)

const Record = mongoose.models.Record || mongoose.model("Record", RecordSchema)
export default Record
