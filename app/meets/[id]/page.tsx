import connectMongoDB from "@/lib/connection";
import Meet from "@/models/Meet";
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
import Leaderboard from "@/components/ui/leaderboard";

export default async function MeetPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  await connectMongoDB();
  const meet = await Meet.findById(id).lean();
  const races = await Race.find({ meetId: id })

  if (!meet) { return (<h1>Meet Not Found</h1>) };

  return (
    <div>
      <h1 className="flex justify-center items-center mt-5 text-xl">{meet.name}</h1>
      <div className="p-10">
        <Leaderboard id={id} count={10} />
      </div>
      <div className="p-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Race</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {races.map((race) => (
              <TableRow key={race._id}>
                <TableCell>{race.event.stroke} {race.event.distance}m</TableCell>
                <TableCell>{race.event.category}</TableCell>
                <TableCell>{race.status}</TableCell>
                <TableCell>{race.heats[0].startTime.toLocaleString('en-US', {
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

