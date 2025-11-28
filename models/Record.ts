import mongoose from "mongoose"

const RecordSchema = new mongoose.Schema(
  {
    recordType: {
      type: String,
      enum: ["PB", "WR", "PR"],
      required: true
    },

    swimmerId: {
      type: mongoose.Types.ObjectId,
      ref: "Swimmer",
      required: true
    },

    swimmerName: {
      type: String,
      required: true
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

    time: { type: Number, required: true },

    achievedOn: { type: Date, required: true },
    meetId: { type: mongoose.Types.ObjectId, ref: "Meet" },
    raceId: { type: mongoose.Types.ObjectId, ref: "Race" },
  }
)

const Record = mongoose.models.Record || mongoose.model("Record", RecordSchema)
export default Record
