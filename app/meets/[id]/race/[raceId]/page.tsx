import Race from "@/models/Race"
import connectMongoDB from "@/lib/connection"

export default async function RacePage(props: { params: Promise<{ raceId: string }> }) {
  const { raceId } = await props.params;

  await connectMongoDB()
  const race = await Race.findById(raceId).lean()

  if (!race) return (<h1>Race not found</h1>)

  return (
    <div>
      {console.log(race)}
      <h1>{race.event.stroke} {race.event.distance}m</h1>
    </div>
  )
}
