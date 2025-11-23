"use client";
import { useEffect, useState } from "react";

interface Props {
  swimmerId: string
  raceId: string
}

export default function RaceSim({ swimmerId, raceId }: Props) {
  const [distance, setDistance] = useState(0);
  const [stop, setStop] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (stop) return;

    const interval = setInterval(async () => {
      const res = await fetch(
        `/api/sensors/${raceId.toString()}/${swimmerId.toString()}`
      );
      const data = await res.json();

      if (data[count]?.distance) {
        setDistance(data[count].distance);
        setCount(count + 1)

        if (data[count].distance >= 50) {
          setStop(true);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [stop, count, raceId, swimmerId]);

  function raceSim(distance: number) {
    const string = "--------------------------------------------------"
    return string.substring(0, distance) + "◦" + string.substring(distance + 1)
  }

  return (
    <div>
      <div className="text-center bg-white/10 dark:bg-gray-900/10 border border-white/20 w-[50vw] text-lg" >{raceSim(distance)}</div >
    </div>
  );
}

