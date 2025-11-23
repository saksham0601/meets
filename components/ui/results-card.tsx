"use client"

import Race from "@/models/Race"
import mongoose from "mongoose"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table"
import { useEffect, useState } from "react"
import { DialogTitle } from "./dialog"

interface Props {
  swimmerNames: string[]
  swimmerIds: string[]
  raceId: string
  heatIndex: number
}

export default function ResultCard({ swimmerNames, swimmerIds, raceId, heatIndex }: Props) {

  const [race, setRace] = useState<Race | null>(null);
  const [shouldFetch, setShouldFetch] = useState(true)

  useEffect(() => {
    if (!shouldFetch) return
    let isMounted = true;

    const fetchRace = async () => {
      try {
        const res = await fetch(`/api/races/${raceId}`);
        if (!res.ok) throw new Error("Failed to fetch race");
        const data = await res.json();
        if (isMounted) {
          setRace(data)

          const heat = data?.heats[heatIndex]
          if (heat && heat.results.length == heat.laneAssignment.length) {
            setShouldFetch(false)
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchRace(); // initial fetch
    const interval = setInterval(fetchRace, 10000); // repeat every second

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [raceId, shouldFetch, heatIndex]);

  const swimmerIndex = (id: string) => swimmerIds.indexOf(id)

  return (
    <>
      <DialogTitle>{race?.event.distance}m {race?.event.stroke} {race?.event.gender === "male" ? "Mens" : "Womens"} {race?.event.category} Heat {race?.heats[heatIndex].heatNumber}</DialogTitle>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-5 w-[20vw]">Position</TableHead>
            <TableHead className="w-[20vw]">Swimmer</TableHead>
            <TableHead className="w-[20vw]">Time</TableHead>
            <TableHead className="w-[20vw]">Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {race?.heats[heatIndex].results?.map((r) => {
            if (r.status === "dnf") {
              return (
                <TableRow key={r.swimmerId}>
                  <TableCell className="pl-5">DNF</TableCell>
                  <TableCell>{swimmerNames[swimmerIndex(r.swimmerId)]}</TableCell>
                  <TableCell>N/A</TableCell>
                  <TableCell>0</TableCell>
                </TableRow >
              )
            } else if (r.status === "dns") {
              return (
                <TableRow key={r.swimmerId}>
                  <TableCell className="pl-5">DNS</TableCell>
                  <TableCell>{swimmerNames[swimmerIndex(r.swimmerId)]}</TableCell>
                  <TableCell>N/A</TableCell>
                  <TableCell>0</TableCell>
                </TableRow>
              )
            } else {
              return (
                <TableRow key={r.swimmerId}>
                  <TableCell className="pl-5">{r.place}</TableCell>
                  <TableCell>{swimmerNames[swimmerIndex(r.swimmerId.toString())]}</TableCell>
                  <TableCell>{r.time}s</TableCell>
                  <TableCell>{r.points}</TableCell>
                </TableRow>
              )
            }
          })}
        </TableBody>
      </Table>
    </>
  )
}
