import connectMongoDB from "@/lib/connection.ts"
import Meet from "@/models/Meet"
import Card from "@/components/ui/card.tsx"
import NewMeet from "@/components/ui/new-meet.tsx"
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
import {
  Dialog,
  // DialogClose,
  DialogContent,
  // DialogDescription,
  // DialogFooter,
  // DialogHeader,
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
              <li className="p-4 border rounded-lg shadow-sm bg-card text-card-foreground">
                <h2 className="text-xl font-semibold">{meet.name}</h2>
                <p className="text-sm text-muted-foreground">
                  📅 Start Date: {new Date(meet.date.start).toLocaleString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
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
            <DialogContent>
              <Link href={`/meets/${meet._id.toString()}`}>
                <DialogTitle>{meet.name}</DialogTitle>
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
                {meet.status === "planned" ? <p className="text-blue-600">Planned</p> : <div></div>}
                {meet.status === "ongoing" ? <p className="text-green-600">Ongoing</p> : <div></div>}
                {meet.status === "completed" ? <p className="text-gray-600">Completed</p> : <div></div>}
                {meet.status === "cancelled" ? <p className="text-red-600">Cancelled</p> : <div></div>}
                <Table className="mt-5">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="border-r border-r-black w-20">Name</TableHead>
                      <TableHead className="w-20">Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {meet.officials?.map((official) => (
                      <TableRow key={official.name}>
                        <TableCell className="border-r border-r-black">{official.name}</TableCell>
                        <TableCell>{official.role}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="my-6 border-b"></div>
                <div className="justify-center text-center">Teams Leaderboard</div>
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
