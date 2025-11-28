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
      console.log(data)

      if (data[count]?.distances) {
        setDistance(data[count].distances[data[count].distances.length - 1]);
        setCount(count + 1)

        if (count > data.length) {
          setStop(true);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [stop, count, raceId, swimmerId]);

  function raceSim(distance: number) {
    const lane = "--------------------------------------------------";
    const pos = Math.floor(distance % 50);
    const back = Math.floor(distance / 50) % 2 === 1;

    let index = pos;

    if (back) {
      index = 49 - pos;
    }

    index = Math.max(0, Math.min(49, index));

    return (
      lane.substring(0, index) +
      "◦" +
      lane.substring(index + 1)
    );
  }

  return (
    <div>
      <div className="text-center bg-white/10 dark:bg-gray-900/10 border border-white/20 w-110 text-lg" >{raceSim(distance)}</div >
    </div>
  );
}

