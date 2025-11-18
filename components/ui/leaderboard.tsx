import connectMongoDB from "@/lib/connection";
import Race from "@/models/Race"
import {
  Table,
  TableBody,
  // TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import mongoose from "mongoose";

interface Props {
  id: string
  count: number
}

export default async function Leaderboard({ id, count }: Props) {
  count = count ? count : 10

  await connectMongoDB();
  const points = await Race.aggregate([
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

    { $sort: { totalPoints: -1 } }
  ]).limit(count)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-50 pl-5">Position</TableHead>
          <TableHead className="w-50 pl-10">Team</TableHead>
          <TableHead className="w-50 pl-10">Points</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {points.map((point, index) => (
          <TableRow key={point.teamId}>
            <TableCell className="pl-5">{index + 1}</TableCell>
            <TableCell className="pl-10">{point.teamName}</TableCell>
            <TableCell className="pl-10">{point.totalPoints}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
