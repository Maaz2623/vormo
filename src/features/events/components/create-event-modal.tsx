"use client";
import React, { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { GoogleMap, Marker } from "@react-google-maps/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import {
  BlocksIcon,
  CalendarIcon,
  IndianRupeeIcon,
  MapPinHouse,
  MapPinIcon,
  MapPinnedIcon,
  PenIcon,
  PlusCircleIcon,
  PlusIcon,
  TerminalIcon,
  Trash2Icon,
} from "lucide-react";
import { useCreateEventModalStore } from "../store/use-create-event-modal-store";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import usePlacesAutocomplete, {
  ClearSuggestions,
  getGeocode,
  getLatLng,
  SetValue,
  Status,
} from "use-places-autocomplete";

import { ScrollArea } from "@/components/ui/scroll-area";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Block } from "@/db/schema";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

declare global {
  interface Window {
    initGoogleMaps: () => void;
  }
}

interface CreateEventMapModalProps {
  mapOpen: boolean;
  setMapOpen: (mapOpen: boolean) => void;
  mapSelected: {
    lat: number;
    lng: number;
  } | null;
  setValue: SetValue;
  value: string;
  ready: boolean;
  status: Status;
  data: google.maps.places.AutocompletePrediction[];
  clearSuggestions: ClearSuggestions;
  setMapSelected: React.Dispatch<
    React.SetStateAction<{
      lat: number;
      lng: number;
    } | null>
  >;
  setPlaceName: React.Dispatch<React.SetStateAction<string | null>>;
}

const CreateEventModal = () => {
  const [mapSelected, setMapSelected] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [completed, setCompleted] = useState(25);
  const [open, setOpen] = useCreateEventModalStore();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);

  const [placeName, setPlaceName] = useState<string | null>(null);

  const [blocksContainer, setBlocksContainer] = useState(false);
  const [blocksList, setBlocksList] = useState<Block[]>([]);
  const [createBlockOpen, setCreateBlockOpen] = useState(false);
  const [editBlockOpen, setEditBlockOpen] = useState(false);

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    callbackName: "initMap",
    debounce: 300,
  });

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  });

  const [block, setBlock] = useState<Block>({
    title: "",
    paragraph: "",
  });

  console.log(completed);

  return (
    <>
      <CreateEventMapModal
        mapOpen={mapOpen}
        setMapOpen={setMapOpen}
        setMapSelected={setMapSelected}
        setPlaceName={setPlaceName}
        mapSelected={mapSelected}
        setValue={setValue}
        value={value}
        ready={ready}
        status={status}
        data={data}
        clearSuggestions={clearSuggestions}
      />
      <AlertDialog open={editBlockOpen} onOpenChange={setEditBlockOpen}>
        <AlertDialogContent>
          <VisuallyHidden>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </VisuallyHidden>
          <div className="flex flex-col gap-y-3">
            <Input
              className="font-semibold"
              placeholder="Title"
              onChange={(e) =>
                setBlock({
                  ...block,
                  title: e.target.value,
                })
              }
            />
            <Textarea
              onChange={(e) =>
                setBlock({
                  ...block,
                  paragraph: e.target.value,
                })
              }
              className="bg-neutral-200 h-40 focus-visible:ring-2 resize-none"
              placeholder="Write something here..."
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setBlocksList((prevBlocks) => [...prevBlocks, block]);
              }}
            >
              Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={createBlockOpen} onOpenChange={setCreateBlockOpen}>
        <AlertDialogContent>
          <VisuallyHidden>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </VisuallyHidden>
          <div className="flex flex-col gap-y-3">
            <Input
              className="font-semibold"
              placeholder="Title"
              onChange={(e) =>
                setBlock({
                  ...block,
                  title: e.target.value,
                })
              }
            />
            <Textarea
              onChange={(e) =>
                setBlock({
                  ...block,
                  paragraph: e.target.value,
                })
              }
              className="bg-neutral-200 h-40 focus-visible:ring-2 resize-none"
              placeholder="Write something here..."
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setBlocksList((prevBlocks) => [...prevBlocks, block]);
              }}
            >
              Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={blocksContainer} onOpenChange={setBlocksContainer}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Details Blocks</DialogTitle>
            <DialogDescription>
              Create blocks to brief about your event to the audience
            </DialogDescription>
          </DialogHeader>
          <div className="w-full flex justify-end items-center">
            <Button
              variant={`outline`}
              size={`sm`}
              onClick={() => setCreateBlockOpen(true)}
            >
              <PlusCircleIcon />
              <p>Add block</p>
            </Button>
          </div>
          {blocksList.length > 0 ? (
            <ScrollArea className="flex flex-col h-64 px-2 shadow-inner border shadow-neutral-400 py-2 rounded-lg">
              {blocksList.map((block, index) => (
                <AnimatePresence initial={false} key={index}>
                  <motion.div
                    key={index}
                    initial={{
                      y: 100,
                    }}
                    animate={{
                      y: 0,
                    }}
                    exit={{
                      x: 100,
                    }}
                  >
                    <Alert
                      className="shadow-md w-[440px] mb-3 transition-all duration-200"
                      key={index}
                    >
                      <TerminalIcon className="h-4 w-4" />{" "}
                      <div className="flex justify-between items-center">
                        <div className="w-full">
                          <AlertTitle>{block.title}</AlertTitle>
                          <AlertDescription className="w-full">
                            <p className="w-[90%] truncate">
                              {block.paragraph}
                            </p>
                          </AlertDescription>
                        </div>
                        <Button
                          variant={`ghost`}
                          size={`icon`}
                          className="hover:bg-rose-600/20"
                          onClick={() => {
                            setBlocksList((prevBlocks) => {
                              // Create a new array excluding the item at the given index
                              const updatedBlocks = [...prevBlocks];
                              updatedBlocks.splice(index, 1); // Remove the block at the specific index
                              return updatedBlocks;
                            });
                          }}
                        >
                          <Trash2Icon className="size-6 text-rose-600" />
                        </Button>
                      </div>
                    </Alert>
                  </motion.div>
                </AnimatePresence>
              ))}
            </ScrollArea>
          ) : (
            <div className="h-40 flex justify-center items-center">
              <p className="text-neutral-600">No blocks added</p>
            </div>
          )}
          <DialogFooter>
            <Button
              className="shadow-md"
              onClick={() => setBlocksContainer(false)}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Other components and content */}

      <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
        <DialogContent className="p-0 w-fit">
          <Calendar
            className=""
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </DialogContent>
      </Dialog>

      <Button variant={`outline`} size={`icon`} onClick={() => setOpen(true)}>
        <PlusIcon />
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="w-[550px] h-[500px] max-w-[1000px]">
          <AlertDialogHeader className="w-full flex justify-center items-center">
            <AlertDialogTitle className="text-2xl font-semibold">
              Create Event
            </AlertDialogTitle>
            <AlertDialogDescription className="">
              Fill in the details of your latest event
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="w-full h-8 justify-center items-center flex flex-col">
            <div className="flex justify-center items-center relative w-2/3">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "border font-semibold text-sm absolute transition-all duration-300 bg-white -left-2 rounded-lg z-20 px-2 py-1",
                  completed >= 0 && "bg-green-600 text-white rotate-180"
                )}
              >
                1
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "border font-semibold text-sm absolute transition-all duration-300 bg-white -left-50 rounded-lg px-2 z-20 py-1",
                  completed >= 50 && "bg-green-600 text-white"
                )}
              >
                2
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "border font-semibold transition-all duration-300 text-sm absolute bg-white -right-2 rounded-lg px-2 py-1 z-20",
                  completed === 100 && "bg-green-600 text-white"
                )}
              >
                3
              </motion.div>
              <Progress value={completed} className="w-full z-10" />
            </div>
          </div>

          <div className="border -mt-16 h-34 flex justify-center items-center">
            {completed === 0 && (
              <motion.div
                className="flex gap-x-4 w-full border h-20 items-center justify-between"
                initial={{
                  y: 100,
                }}
                animate={{
                  y: 0,
                }}
                exit={{
                  x: -100,
                }}
              >
                <div className="w-full flex flex-col gap-y-2">
                  <Label>Event Name</Label>
                  <div className="relative">
                    <PenIcon className="absolute left-3 top-2.5 size-4" />

                    <Separator
                      orientation="vertical"
                      className="absolute left-9 bg-black/50 h-4 top-2.5"
                    />
                    <Input placeholder={`e.g. Memento, `} className="pl-11" />
                  </div>
                </div>

                <div className="w-full flex flex-col gap-y-2">
                  <Label>Date time</Label>
                  <Button
                    variant={`outline`}
                    className="text-start"
                    onClick={() => setCalendarOpen(true)}
                  >
                    <CalendarIcon className="size-4" />
                    <Separator orientation="vertical" className="bg-black/50" />
                    <p className="w-full text-start">Select Date</p>
                  </Button>
                </div>
              </motion.div>
            )}{" "}
            {completed === 25 && (
              <motion.div
                className="flex gap-x-4 w-full h-full items-center justify-between"
                initial={{
                  x: 50,
                  opacity: 0,
                }}
                animate={{
                  x: 0,
                  opacity: 100,
                }}
                exit={{
                  x: -100,
                }}
              >
                <div className="w-full flex flex-col gap-y-2">
                  <Label>Venue Location</Label>
                  <Button
                    variant={`outline`}
                    className="text-start justify-start"
                    onClick={() => setMapOpen(true)}
                  >
                    <MapPinnedIcon className="size-4" />
                    <Separator orientation="vertical" className="bg-black/50" />
                    <p className="truncate w-40 text-start">
                      {mapSelected ? placeName : "Select on map"}
                    </p>
                  </Button>
                </div>{" "}
                <div className="w-full flex flex-col gap-y-2">
                  <Label>Venue tag</Label>
                  <div className="relative">
                    <MapPinHouse className="absolute left-3 top-2.5 size-4" />

                    <Separator
                      orientation="vertical"
                      className="absolute left-9 bg-black/50 h-4 top-2.5"
                    />
                    <Input
                      placeholder={`e.g. 1st floor, Nishat building`}
                      className="pl-11"
                    />
                  </div>
                </div>
              </motion.div>
            )}{" "}
            {completed === 50 && (
              <motion.div
                className="flex gap-x-4 w-full py-2 border items-center justify-between"
                initial={{
                  x: 50,
                  opacity: 0,
                }}
                animate={{
                  x: 0,
                  opacity: 100,
                }}
                exit={{
                  x: -100,
                }}
              >
                {" "}
                <div className="w-full flex flex-col gap-y-2">
                  <Label>Ticket Pricing</Label>
                  <div className="relative">
                    <IndianRupeeIcon className="absolute left-3 top-2.5 size-4" />

                    <Separator
                      orientation="vertical"
                      className="absolute left-9 bg-black/50 h-4 top-2.5"
                    />
                    <Input
                      placeholder={`e.g. 200, 250, `}
                      type="number"
                      className="pl-11"
                    />
                  </div>
                </div>
                <div className="w-full flex flex-col gap-y-2">
                  <Label>Details Blocks</Label>
                  <Button
                    variant={`outline`}
                    className="text-start justify-start"
                    onClick={() => setBlocksContainer(true)}
                  >
                    <BlocksIcon className="size-4" />
                    <Separator orientation="vertical" className="bg-black/50" />
                    <p className="truncate w-40 text-start">
                      {mapSelected ? placeName : "Select on map"}
                    </p>
                  </Button>
                </div>{" "}
              </motion.div>
            )}
          </div>

          <div className="w-full flex justify-center items-center -mt-4">
            {completed !== 100 && (
              <div className="flex border gap-x-3">
                {completed !== 0 && (
                  <motion.div
                    initial={{
                      scale: 0,
                      y: 50,
                    }}
                    animate={{
                      scale: 1,
                      y: 0,
                    }}
                  >
                    <Button
                      variant={`outline`}
                      className="text-sm hover:scale-105 font-semibold w-[100px] transition-all duration-300 transform"
                      onClick={() => setCompleted(completed - 25)}
                    >
                      Previous
                    </Button>
                  </motion.div>
                )}
                <motion.div
                  initial={{
                    scale: 0,
                    y: 50,
                  }}
                  animate={{
                    scale: 1,
                    y: 0,
                  }}
                >
                  <Button
                    className="text-sm hover:scale-105 font-semibold w-[100px] transition-all duration-300  transform"
                    onClick={() => setCompleted(completed + 25)}
                  >
                    Next
                  </Button>
                </motion.div>
              </div>
            )}
            {completed === 100 && (
              <div className="flex border gap-x-3">
                <motion.div
                  initial={{
                    scale: 0,
                    y: 50,
                  }}
                  animate={{
                    scale: 1,
                    y: 0,
                  }}
                >
                  <Button
                    variant={`outline`}
                    className="text-sm hover:scale-105 font-semibold w-[100px]"
                    onClick={() => setCompleted(completed - 25)}
                  >
                    Previous
                  </Button>
                </motion.div>
                <motion.div
                  initial={{
                    scale: 0,
                    y: 50,
                  }}
                  animate={{
                    scale: 1,
                    y: 0,
                  }}
                >
                  <Button className="text-sm hover:scale-105 font-semibold w-[100px]">
                    Finish
                  </Button>
                </motion.div>
              </div>
            )}
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CreateEventModal;

const CreateEventMapModal = ({
  mapOpen,
  setMapOpen,
  setMapSelected,
  setPlaceName,
  mapSelected,
  setValue,
  value,
  ready,
  status,
  data,
  clearSuggestions,
}: CreateEventMapModalProps) => {
  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const defaultCenter = useMemo(
    () => ({
      lat: 43.45,
      lng: -80.49,
    }),
    []
  );

  const mapRef = useRef<google.maps.Map | null>(null);

  const focusOnMarker = (lat: number, lng: number) => {
    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(14);
    }
  };

  const handleLocationSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const result = await getGeocode({ address });
      const { lat, lng } = getLatLng(result[0]);
      setMapSelected({ lat, lng });
      setPlaceName(result[0].formatted_address);
      focusOnMarker(lat, lng);
    } catch (error) {
      console.error("Error selecting location:", error);
    }
  };

  return (
    <Dialog open={mapOpen} onOpenChange={setMapOpen}>
      <DialogContent className="rounded-lg p-1 w-[600px] max-w-[1000px]">
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
        </VisuallyHidden>
        <GoogleMap
          zoom={16}
          center={mapSelected || defaultCenter}
          mapContainerStyle={containerStyle}
          options={{
            zoomControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          }}
        >
          {mapSelected && <Marker position={mapSelected} />}
        </GoogleMap>
        <div className="absolute left-0 top-8 flex flex-col justify-center items-center w-full">
          <div className="w-1/2">
            <Input
              onChange={(e) => setValue(e.target.value)}
              value={value}
              placeholder="Search address"
              className="bg-white shadow-2xl font-medium border"
              disabled={!ready}
            />
          </div>
          {status === "OK" && data.length > 0 && (
            <motion.div
              className="w-full flex justify-center"
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              exit={{ y: -100 }}
            >
              <ScrollArea className="w-[90%] rounded-lg h-64 border bg-white/90 mt-3 flex flex-col gap-y-3">
                {data.map((item) => (
                  <div
                    key={item.place_id}
                    onClick={() => handleLocationSelect(item.description)}
                    className="flex items-center mb-1 px-4 py-2 space-x-2 cursor-pointer hover:bg-gray-100 rounded-md"
                  >
                    <MapPinIcon className="size-5 text-gray-600" />
                    <div className="flex-1">
                      <p className="truncate font-medium text-sm text-gray-800 text-wrap">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
