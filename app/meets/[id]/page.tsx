import connectMongoDB from "@/lib/connection";
import Meet from "@/models/Meet";
import Race from "@/models/Race"
import Leaderboard from "@/components/ui/leaderboard";
import Link from "next/link"
import Image from "next/image"
import {
  Table,
  TableBody,
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
      <div className="relative -mt-10 w-full">
        <Image src="/swimmer-banner.jpg" alt="as" height={0} width={2100} className="w-full h-auto brightness-50 -z-10" />
        <div className="absolute top-0 left-10 translate-y-1/2 text-white font-bold">
          <p className="lg:text-5xl sm:text-4xl xl:text-8xl">{meet.name}</p>
          <p className="lg:text-3xl sm:text-2xl xl:text-6xl">{meet.location.venueName}</p>
          <p className="lg:text-xl sm:text-lg xl:text-3xl">{meet.location.city}, {meet.location.country}</p>
          <p className="lg:text-xl sm:text-lg xl:text-3xl">{meet.date.start.toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })} - {meet.date.end.toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })}</p>
        </div>
      </div>
      <div className="backdrop-blur-lg bg-white/10 dark:bg-gray-900/10 border border-white/20 mt-10 ml-10 mr-10 rounded-2xl">
        <Leaderboard id={id} count={10} />
      </div>
      <div className="backdrop-blur-lg bg-white/10 dark:bg-gray-900/10 border border-white/20 mt-10 ml-10 m-10 rounded-2xl">
        <Table>
          <TableHeader>
            <TableRow className="hover: rounded-2xl">
              <TableHead className="pl-5 hover:rounded-2xl">Race</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="">Start Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {races.map((race) => (
              <TableRow key={race._id}>
                <Link href={`/meets/${id}/race/${race._id.toString()}`} className="contents">
                  <TableCell className="pl-5">{race.event.stroke} {race.event.distance}m</TableCell>
                  <TableCell className="">{race.event.category}</TableCell>
                  <TableCell className="">{race.status}</TableCell>
                  <TableCell className="">{race.heats[0].startTime.toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}</TableCell>
                </Link>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

