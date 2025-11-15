"use client"

import { useState } from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Field,
  // FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
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
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function NewMeet() {
    const [name, setName] = useState("")
    const [startOpen, setStartOpen] = useState(false)
    const [endOpen, setEndOpen] = useState(false)
    const [startDate, setStartDate] = useState<Date | undefined>(undefined)
    const [endDate, setEndDate] = useState<Date | undefined>(undefined)
    const [facility, setFacility] = useState("")
    const [lon, setLon] = useState("")
    const [lat, setLat] = useState("")

    async function submit(e: React.FormEvent) {
        e.preventDefault()

        await fetch("/api/meets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                date: {
                start: startDate?.toISOString(),
                end: endDate?.toISOString()
                },
                location: {
                type: "Point",
                coordinates: [parseFloat(lat), parseFloat(lon)],
                name: facility
                },
                status: "planned",
                teamStandings: [],
                officials: []
            })
        });

        alert("Meet created!");
    }

    return(
        <Dialog>
            <DialogTrigger variant="default" size="icon" className="absolute bottom-5 right-5 text-xl border bg-white text-black">
                +
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>New Meet</DialogTitle>
                <form>
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Name</FieldLabel>
                            <Input value={name} onChange={e => setName(e.target.value)} />
                        </Field>
                        <FieldSeparator />
                        <FieldSet>
                            <FieldLegend>Date</FieldLegend>
                            <Field>
                                <FieldLabel>Start Date</FieldLabel>
                                <Popover open={startOpen} onOpenChange={setStartOpen}>
                                    <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        id="date"
                                        className="w-48 justify-between font-normal"
                                    >
                                        {startDate ? startDate.toLocaleDateString() : "Select date"}
                                        <ChevronDownIcon />
                                    </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={startDate}
                                        captionLayout="dropdown"
                                        onSelect={(date) => {
                                        setStartDate(date)
                                        setStartOpen(false)
                                        }}
                                    />
                                    </PopoverContent>
                                </Popover>
                            </Field>
                            <Field>
                                <FieldLabel>End Date</FieldLabel>
                                <Popover open={endOpen} onOpenChange={setEndOpen}>
                                    <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        id="date"
                                        className="w-48 justify-between font-normal"
                                    >
                                        {endDate ? endDate.toLocaleDateString() : "Select date"}
                                        <ChevronDownIcon />
                                    </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={endDate}
                                        captionLayout="dropdown"
                                        onSelect={(date) => {
                                        setEndDate(date)
                                        setEndOpen(false)
                                        }}
                                    />
                                    </PopoverContent>
                                </Popover>
                            </Field>
                        </FieldSet>
                        <FieldSeparator />
                        <FieldSet>
                            <FieldLegend>Location</FieldLegend>
                                <Field>
                                    <FieldLabel>Facility Name</FieldLabel>
                                    <Input value={facility} onChange={e => setFacility(e.target.value)}/>
                                </Field>
                                <div className="grid grid-cols-2 gap-2">
                                    <Field>
                                        <FieldLabel>Longitude</FieldLabel>
                                        <Input value={lon} onChange={e => setLon(e.target.value)}/>
                                    </Field>
                                    <Field>
                                        <FieldLabel>Latitude</FieldLabel>
                                        <Input value={lat} onChange={e => setLat(e.target.value)}/>
                                    </Field>
                                </div>
                        </FieldSet>
                        <Field orientation="horizontal">
                            <Button type="submit" onClick={submit}>Submit</Button>
                            <Button type="button" variant="outline">Cancel</Button>
                        </Field>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    )
}

