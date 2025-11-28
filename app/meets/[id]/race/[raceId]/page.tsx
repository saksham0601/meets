import Race from "@/models/Race"
import connectMongoDB from "@/lib/connection"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import FrostedGlass from "@/components/frosted-glass";
import mongoose from "mongoose";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ResultCard from "@/components/ui/results-card";
import Record from "@/models/Record";
import RaceSim from "@/components/ui/race-sim";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default async function RacePage(props: { params: Promise<{ raceId: string }> }) {
  const { raceId } = await props.params;

  await connectMongoDB()
  const race = await Race.findById(raceId).lean()
  const record = await Record.findOne({ "recordType": "WR", "event.stroke": race.event.stroke, "event.distance": race.event.distance, "event.gender": race.event.gender, "achievedOn": { $lte: new Date() } }).lean()
  const swimmers = await Race.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(raceId) } },

    { $unwind: "$heats" },
    { $unwind: "$heats.laneAssignment" },
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
        swimmerId: "$swimmer._id",
        swimmerName: "$swimmer.name",
        team: {
          _id: "$team._id",
          name: "$team.name",
        }
      },
    }, { $sort: { heatNumber: 1, lane: 1 } }
  ])

  const swimmerNames = swimmers.map((s) => {
    return s.swimmerName
  })

  const swimmerIds = swimmers.map((s) => {
    return s.swimmerId.toString()
  })

  if (!race) return (<h1>Race not found</h1>)

  return (
    <div>
      <p className="lg:text-5xl sm:text-4xl xl:text-8xl pl-10">{race.event.distance} Meters {race.event.stroke}</p>
      <p className="lg:text-3xl sm:text-2xl xl:text-6xl pl-10">{race.event.gender === "male" ? "Mens" : "Womens"} {race.event.category}</p>
      <p className="lg:text-3xl sm:text-2xl xl:text-6xl pl-10">World Record Time: {record?.time}s</p>

      <div>
        <p className="lg:text-5xl sm:text-3xl xl:text-6xl pl-10 pt-10 -mb-5">Heats</p>
        {race.heats?.map((heat, index) => (
          <div key={heat.heatNumber}>
            <Dialog>
              <DialogTrigger asChild>
                <FrostedGlass>
                  <div className="grid grid-cols-3 pt-3 text-xl">
                    <p className="pl-5">Heat: {heat.heatNumber}</p>
                    <p className="pl-2">Start Time: {heat.startTime.toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}</p>
                    <div>
                      <p className="pl-2">{new Date(heat.startTime) < new Date() && !heat.results[0] ? "Status: Ongoing" : ""}</p>
                      <p className="pl-2">{new Date(heat.startTime) < new Date() && heat.results[0] ? "Status: Finished" : ""}</p>
                      <p>{new Date(heat.startTime) > new Date() ? "Status: Upcoming" : ""}</p>
                    </div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="pl-5 w-[30vw]">Lane</TableHead>
                        <TableHead className="w-[30vw]">Swimmer</TableHead>
                        <TableHead className="w-[30vw]">Team</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {swimmers.map((s) => {
                        if (s.heatNumber == index + 1) {
                          return (
                            < TableRow key={`${s.heatNumber}-${s.lane}`} >
                              <TableCell className="pl-5">{s.lane}</TableCell>
                              <TableCell>{s.swimmerName}</TableCell>
                              <TableCell>{s.team.name}</TableCell>
                            </TableRow>
                          )
                        }
                      })}
                    </TableBody>
                  </Table>
                </FrostedGlass>
              </DialogTrigger>
              {new Date(heat.startTime) < new Date() ?
                <DialogContent className="dark:bg-black/0 bg-cyan-100/40 backdrop-blur-3xl">
                  <ResultCard heatIndex={index} raceId={raceId} swimmerNames={swimmerNames} swimmerIds={swimmerIds} />
                  <Collapsible>
                    <CollapsibleTrigger className="border b-white/20 bg-gray-900/10 hover:bg-white/20 px-3 py-1 mb-1 rounded-2xl">{heat.results[0] ? "Replay" : "Watch Live"}</CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="grid grid-cols-1 gap-1">
                        {heat.laneAssignment.map((l) => (
                          <div key={l.swimmerId} className="flex gap-1">
                            <div className="w-3 text-center">{l.lane}</div>
                            <RaceSim raceId={raceId} swimmerId={l.swimmerId.toString()} />
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </DialogContent>
                : <div></div>
              }
            </Dialog>
          </div>
        ))}
      </div>
    </div >
  )
}
