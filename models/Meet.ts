import mongoose from "mongoose";

const MeetSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        location:{
            type: { type: String, enum: ["Point"], required: true },
            coordinates: { type: [Number], required: true },
            name: {
                type: String,
                required: true
            }
        },
        date:{
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
        teamStandings: {
            type: [
                {
                    teamId: { type: String, ref: "Team" },
                    points: { type: Number, default: 0 },
                }
            ],
            default: []
        },
        officials: [
            {
                name: { type: String, required: true },
                role: { type: String, required: true },
            }
        ],
    },
    {
        timestamps: true
    }
)

const Meet = mongoose.models.Meet || mongoose.model("Meet", MeetSchema)
export default Meet
