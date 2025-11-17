import connectMongoDB from "@/lib/connection.ts"
import mongoose from "mongoose"
import Team from "@/models/Team"

interface Props {
  teamId: mongoose.Schema.Type.ObjectId[]
}

async function Card({ teamId }: Props) {
  await connectMongoDB()
  const team = await Team.findById(teamId)

  return (
    <p>{team.name}</p>
  )
}

export default Card
