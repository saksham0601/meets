import connectMongoDB from "@/lib/connection";
import Team from "@/models/Team";

export default async function TeamPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params

  connectMongoDB()
  console.log(id)
  const team = await Team.findById(id).lean()

  return (
    <div>
      <h1>{team.name}</h1>
    </div>
  )
}
