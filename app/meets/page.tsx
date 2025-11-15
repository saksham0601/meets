import connectMongoDB from "@/lib/connection.ts"
import Meet from "@/models/Meet"
import Card from "@/components/ui/card.tsx"
import NewMeet from "@/components/ui/new-meet.tsx"
import { Button } from "@/components/ui/button"
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

export const dynamic = "force-dynamic"

export default async function Meets() {
    await connectMongoDB();
    const meets = await Meet.find().lean();

    return (
        <div>
            <ul className="relative top-5 space-y-4">
                {meets.map((meet) => (
                    <Dialog key={meet._id}>
                        <DialogTrigger asChild>
                            <li className="p-4 border rounded-lg shadow-sm bg-card text-card-foreground">
                                <h2 className="text-xl font-semibold">{meet.name}</h2>
                                <p className="text-sm text-muted-foreground">
                                📅 Start Date: {new Date(meet.date.start).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                📅 End Date: {new Date(meet.date.end).toLocaleDateString()}
                                </p>
                                {meet.location?.name && (
                                <p className="text-sm">📍 {meet.location.name}</p>
                                )}
                            </li>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>{meet.name}</DialogTitle>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                📅 Start Date: {new Date(meet.date.start).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                📅 End Date: {new Date(meet.date.end).toLocaleDateString()}
                                </p>
                                <p>{meet.location.name}</p>
                                <p>{meet.status}</p>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Role</TableHead>
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
                                <hr className="my-6" />
                                <div className="justify-center text-center">Teams Leaderboard</div>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Rank</TableHead>
                                            <TableHead>Team</TableHead>
                                            <TableHead>Points</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {meet.teamStandings?.map((standings, index) => (
                                            <TableRow key={standings.teamId}>
                                                <TableCell>{index+1}</TableCell>
                                                <TableCell><Card teamId={standings.teamId}/></TableCell>
                                                <TableCell>{standings.points}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </DialogContent>
                    </Dialog>
                ))}
            </ul>
            <NewMeet />
        </div>
    );
}
