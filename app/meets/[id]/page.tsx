import connectMongoDB from "@/lib/connection";
import Meet from "@/models/Meet";
import Race from "@/models/Race"
import Leaderboard from "@/components/ui/leaderboard";
import Link from "next/link"
import {
  Table,
  TableBody,
  // TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function MeetPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  await connectMongoDB();
  const meet = await Meet.findById(id).lean();
  const races = await Race.find({ meetId: id })

  if (!meet) { return (<h1>Meet Not Found</h1>) };

  return (
    <div>
      <p className="pt-5 pl-10 pr-10 text-5xl">{meet.name}</p>
      <p className="pl-10 pr-10 text-3xl">{meet.location.venueName}</p>
      <p className="pl-10 pr-10 text-xl">{meet.location.city}, {meet.location.country}</p>
      <p className="pl-10 pr-10 text-xl">{meet.date.start.toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })} - {meet.date.end.toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })}</p>
      <div className="mt-10 ml-10 mr-10 bg-cyan-200 rounded-2xl">
        <Leaderboard id={id} count={10} />
      </div>
      <div className="mt-10 ml-10 mr-10 bg-cyan-200 rounded-2xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Race</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-100">Start Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {races.map((race) => (
              <TableRow key={race._id}>
                <Link href={`/meets/${id}/race/${race._id.toString()}`}>
                  <TableCell>{race.event.stroke} {race.event.distance}m</TableCell>
                </Link>
                <TableCell>{race.event.category}</TableCell>
                <TableCell>{race.status}</TableCell>
                <TableCell className="">{race.heats[0].startTime.toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

