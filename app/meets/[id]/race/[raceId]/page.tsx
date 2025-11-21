import Race from "@/models/Race"
import connectMongoDB from "@/lib/connection"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import FrostedGlass from "@/components/frosted-glass";
import mongoose from "mongoose";

export default async function RacePage(props: { params: Promise<{ raceId: string }> }) {
  const { raceId } = await props.params;

  await connectMongoDB()
  const race = await Race.findById(raceId).lean()
  console.log(raceId)
  const swimmers = await Race.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(raceId) } },

    { $unwind: "$heats" },
    { $unwind: "$heats.laneAssignment" },
    {
      $addFields: {
        "heats.laneAssignment.swimmerId": {
          $toObjectId: "$heats.laneAssignment.swimmerId"
        }
      }
    },
    {
      $lookup: {
        from: "swimmers",
        localField: "heats.laneAssignment.swimmerId",
        foreignField: "_id",
        as: "swimmer"
      }
    },
    { $unwind: "$swimmer" },
    {
      $lookup: {
        from: "teams",
        localField: "swimmer.teamId",
        foreignField: "_id",
        as: "team"
      }
    },
    { $unwind: { path: "$team", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 0,
        raceId: "$_id",
        heatNumber: "$heats.heatNumber",
        lane: "$heats.laneAssignment.lane",
        swimmer: {
          _id: "$swimmer._id",
          name: "$swimmer.name",
        },
        team: {
          _id: "$team._id",
          name: "$team.name",
        }
      },
    }, { $sort: { heatNumber: 1, lane: 1 } }
  ])

  console.log(swimmers)

  if (!race) return (<h1>Race not found</h1>)

  return (
    <div>
      <p className="lg:text-5xl sm:text-4xl xl:text-8xl pl-10">Race: {race.event.stroke} {race.event.distance} Meters</p>
      <p className="lg:text-3xl sm:text-2xl xl:text-6xl pl-10">Category: {race.event.gender === "male" ? "Male" : "Female"} {race.event.category}</p>

      <div>
        <p className="lg:text-3xl sm:text-2xl xl:text-6xl pl-10 pt-10 -mb-5">Heats</p>
        {race.heats?.map((heat, index) => (
          <div key={heat.heatNumber}>
            <FrostedGlass>
              <div className="flex gap-5">
                <p className="pl-5 pt-3 text-xl">Heat: {heat.heatNumber}</p>
                <p className="pl-2 pt-3 text-xl">Start Time: {heat.startTime.toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}</p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-50 pl-5">Lane</TableHead>
                    <TableHead className="w-50">Swimmer</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {swimmers.map((s) => {
                    if (s.heatNumber == index + 1) {
                      return (
                        < TableRow key={`${s.heatNumber}-${s.lane}`} >
                          <TableCell className="pl-5">{s.lane}</TableCell>
                          <TableCell>{s.swimmer.name}</TableCell>
                        </TableRow>
                      )
                    }
                  })}
                </TableBody>
              </Table>
            </FrostedGlass>
          </div>
        ))}
      </div>
    </div >
  )
}
