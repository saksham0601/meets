import connectMongoDB from "@/lib/connection";
import Race from "@/models/Race"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import mongoose from "mongoose";

interface Props {
  id: string
  count: number
  type: string
}

export default async function Leaderboard({ id, count, type }: Props) {
  count = count ? count : 10

  await connectMongoDB();
  const points = type === "swimmer" ?
    await Race.aggregate([
      { $match: { meetId: new mongoose.Types.ObjectId(id) } },

      { $unwind: "$heats" },
      { $unwind: "$heats.results" },

      {
        $group: {
          _id: "$heats.results.swimmerId",
          totalPoints: { $sum: "$heats.results.points" }
        }
      },

      {
        $lookup: {
          from: "swimmers",
          localField: "_id",
          foreignField: "_id",
          as: "swimmer"
        }
      },

      { $unwind: "$swimmer" },
      {
        $project: {
          _id: 0,
          swimmerName: "$swimmer.name",
          totalPoints: 1
        }
      },

      { $sort: { totalPoints: -1, swimmerName: 1 } }
    ]).limit(count) :
    await Race.aggregate([
      { $match: { meetId: new mongoose.Types.ObjectId(id) } },

      { $unwind: "$heats" },
      { $unwind: "$heats.results" },

      {
        $lookup: {
          from: "swimmers",
          localField: "heats.results.swimmerId",
          foreignField: "_id",
          as: "swimmer"
        }
      },

      { $unwind: "$swimmer" },

      {
        $group: {
          _id: "$swimmer.teamId",
          totalPoints: { $sum: "$heats.results.points" }
        }
      },

      {
        $lookup: {
          from: "teams",
          localField: "_id",
          foreignField: "_id",
          as: "team"
        }
      },
      { $unwind: "$team" },

      {
        $project: {
          _id: 0,
          teamId: "$_id",
          teamName: "$team.name",
          totalPoints: 1
        }
      },

      { $sort: { totalPoints: -1, teamName: 1 } }
    ]).limit(count)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[30vw] pl-5">Position</TableHead>
          <TableHead className="w-[30vw]">{type === "swimmer" ? "Swimmer" : "Team"}</TableHead>
          <TableHead className="w-[30vw]">Points</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {points.map((point, index) => (
          <TableRow key={type === "swimmer" ? point.swimmerName : point.teamName}>
            <TableCell className="pl-5">{index + 1}</TableCell>
            <TableCell className="">{type === "swimmer" ? point.swimmerName : point.teamName}</TableCell>
            <TableCell className="">{point.totalPoints}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
