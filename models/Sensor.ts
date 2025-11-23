import mongoose from "mongoose";

const SensorSchema = new mongoose.Schema(
  {
    raceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Race",
      required: true
    },
    swimmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Swimmer",
      required: true
    },
    distance: {
      type: Number,
      required: true
    }
  }
)

const Sensor = mongoose.models.Sensor || mongoose.model("Sensor", SensorSchema)
export default Sensor
