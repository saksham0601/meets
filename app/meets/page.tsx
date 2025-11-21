import connectMongoDB from "@/lib/connection.ts"
import Meet from "@/models/Meet"
import NewMeet from "@/components/ui/new-meet.tsx"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Leaderboard from "@/components/ui/leaderboard"

export const dynamic = "force-dynamic"

export default async function Meets() {
  await connectMongoDB();
  const meets = await Meet.find().lean();

  return (
    <div>
      <ul className="relative top-5 space-y-4 p-5">
        {meets.map((meet) => (
          <Dialog key={meet._id}>
            <DialogTrigger asChild>
              <li className="p-4 backdrop-blur-lg bg-white/10 dark:bg-gray-900/20 border border-white/20 rounded-lg shadow-sm text-card-foreground">
                <h2 className="text-xl font-semibold">{meet.name}</h2>
                <p className="text-sm text-foreground">
                  📅 Start Date: {new Date(meet.date.start).toLocaleString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm text-foreground">
                  📅 End Date: {new Date(meet.date.end).toLocaleString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </p>
                {meet.location?.name && (
                  <p className="text-sm">📍 {meet.location.name}</p>
                )}
              </li>
            </DialogTrigger>
            <DialogContent className="dark:bg-black/0 bg-cyan-100/40 backdrop-blur-3xl">
              <Link href={`/meets/${meet._id.toString()}`}>
                <DialogTitle className="text-2xl font-bold">{meet.name}</DialogTitle>
              </Link>
              <div>
                <p className="text-sm">
                  📅 Start Date: {new Date(meet.date.start).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm">
                  📅 End Date: {new Date(meet.date.end).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </p>
                <p>{meet.location.venueName}</p>
                {meet.status === "planned" ? <p className="text-blue-400">Planned</p> : <div></div>}
                {meet.status === "ongoing" ? <p className="text-green-400">Active</p> : <div></div>}
                {meet.status === "completed" ? <p className="dark:text-gray-400 text-gray-700">Completed</p> : <div></div>}
                {meet.status === "cancelled" ? <p className="text-red-400">Cancelled</p> : <div></div>}
                <div className="my-6 border-b"></div>
                <div className="justify-center text-center text-2xl font-bold">Officials</div>
                <Table className="">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Name</TableHead>
                      <TableHead className="w-20">Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {meet.officials?.map((official) => (
                      <TableRow key={official.name}>
                        <TableCell>{official.name}</TableCell>
                        <TableCell>{official.role}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="my-6 border-b"></div>
                <div className="justify-center text-center text-2xl font-bold">Teams Leaderboard</div>
                <Leaderboard id={meet._id.toString()} count={3} />
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </ul>
      <NewMeet />
    </div>
  );
}
