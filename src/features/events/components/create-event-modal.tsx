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
  CheckIcon,
  ImageIcon,
  IndianRupeeIcon,
  MapPinHouse,
  MapPinIcon,
  MapPinnedIcon,
  MinusIcon,
  PaperclipIcon,
  PenIcon,
  PlusCircleIcon,
  PlusIcon,
  TerminalIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useCreateEventModalStore } from "../store/use-create-event-modal-store";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { addDays } from "date-fns";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";
import { useCreateEvent } from "../api/use-create-event";
import { useParams } from "next/navigation";
import { DateRange } from "react-day-picker";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

export type Banner = {
  url: string;
  key: string;
};

export type Brochure = {
  url: string;
  filename: string;
};

const CreateEventModal = () => {
  const router = useRouter();
  const params = useParams();
  const [mapSelected, setMapSelected] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [blocksList, setBlocksList] = useState<Block[]>([]);
  const [eventType, setEventType] = useState<"public" | "private" | null>(null);

  const [completed, setCompleted] = useState(0);
  const [open, setOpen] = useCreateEventModalStore();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [venueTag, setVenueTag] = useState("");
  const [eventName, setEventName] = useState("");
  const [brochure, setBrochure] = useState<Brochure | null>(null);
  const [price, setPrice] = useState<string>("0");
  const [bannersList, setBannersList] = useState<Array<Banner>>([]);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 5),
  });

  const [placeName, setPlaceName] = useState<string | null>(null);

  const [blocksContainer, setBlocksContainer] = useState(false);
  const [createBlockOpen, setCreateBlockOpen] = useState(false);
  const [editBlockOpen, setEditBlockOpen] = useState(false);
  const [bannerDialog, setBannerDialog] = useState(false);
  const [uploadBannerDialog, setUploadBannerDialog] = useState(false);
  const [brochureDialog, setBrochureDialog] = useState(false);

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

  const [block, setBlock] = useState<Block>({
    title: "",
    paragraph: "",
  });

  const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const { mutate } = useCreateEvent();

  const slug = params.organizationSlug;

  const handleSubmit = async () => {
    if (
      !mapSelected ||
      !eventType ||
      !brochure ||
      !slug ||
      !date ||
      !date.from ||
      !date.to
    )
      return;
    const bannersListUrls = bannersList.map((banner) => banner.url);
    try {
      mutate(
        {
          eventName: eventName,
          eventType: eventType,
          venueTag: venueTag,
          organizationSlug: slug as string,
          price: price,
          dateFrom: date.from.toISOString() as string, // Convert to ISO string
          dateTo: date.to.toISOString() as string, // Convert to ISO string
          mapSelected: mapSelected,
          brochure: brochure.url,
          blocksList: blocksList,
          bannersList: bannersListUrls,
        },
        {
          onSuccess: (data) => {
            router.push(`/organization/${slug}/events/${data}`);
            setOpen(false);
            setEventName("");
            setVenueTag("");
            setPrice("");
            setDate({
              from: new Date(),
              to: addDays(new Date(), 5),
            });
            setCompleted(0);
            setMapSelected(null);
            setBrochure(null);
            setBlocksList([]);
            setBannersList([]);
          },
        }
      );
      toast.success("Event created. Redirecting...");
    } catch {
      toast.error("Something went wrong");
    }
  };

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

      <Dialog open={uploadBannerDialog} onOpenChange={setUploadBannerDialog}>
        <DialogContent className="w-[250px]">
          <VisuallyHidden>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
          </VisuallyHidden>
          <div className="flex justify-center items-center flex-col">
            <UploadButton
              disabled={bannersList.length >= 5}
              endpoint="imageUploader"
              onBeforeUploadBegin={(files) => {
                if (bannersList.length >= 5) {
                  // Display an error message and prevent upload by returning an empty array
                  alert("You can only upload up to 5 banners.");
                  return [];
                }
                return files; // Allow the upload
              }}
              onClientUploadComplete={(res) => {
                // Do something with the response
                const banners = res.map((banner: Banner) => ({
                  url: banner.url,
                  key: banner.key,
                }));
                setBannersList((prev) => [...prev, ...banners]);
                setUploadBannerDialog(false);
              }}
              onUploadError={(error: Error) => {
                // Do something with the error.
                alert(`ERROR! ${error.message}`);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={brochureDialog} onOpenChange={setBrochureDialog}>
        <DialogContent className="w-[350px]">
          <VisuallyHidden>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
          </VisuallyHidden>
          <div className="flex justify-center items-center flex-col">
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                const brochure: Brochure = {
                  url: res[0].url,
                  filename: res[0].name,
                };
                // Do something with the response
                setBrochure(brochure);
                setBrochureDialog(false);
              }}
              onUploadError={(error: Error) => {
                // Do something with the error.
                alert(`ERROR! ${error.message}`);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={bannerDialog} onOpenChange={setBannerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Upload Banners</DialogTitle>
            <DialogDescription>
              Upload banners to make your event attractive
            </DialogDescription>
          </DialogHeader>
          <div className="w-full flex justify-end items-center">
            <Button
              variant={`outline`}
              size={`sm`}
              disabled={bannersList.length >= 5}
              onClick={() => setUploadBannerDialog(true)}
            >
              <PlusCircleIcon />
              <p>Upload</p>
            </Button>
          </div>
          {bannersList.length > 0 ? (
            <ScrollArea className="flex px-2 shadow-inner border shadow-neutral-400 py-2 rounded-lg">
              <div className="flex flex-wrap gap-2 py-2 justify-center items-center">
                {bannersList.map((banner, index) => (
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
                      className="w-fit flex justify-center items-center rounded-lg relative"
                    >
                      <Image
                        src={banner.url}
                        alt="banner"
                        width={400}
                        height={400}
                        className="aspect-video w-[180px] rounded-lg h-[110px] "
                      />
                      <div
                        onClick={() => {
                          const updatedBanners = bannersList.filter(
                            (deletedBanner) => banner.url !== deletedBanner.url
                          );
                          setBannersList(updatedBanners);
                        }}
                        className="p-0.5 rounded-full absolute cursor-pointer -top-2 border bg-white -right-2"
                      >
                        <XIcon className="size-4 z-50" />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="h-40 flex justify-center items-center">
              <p className="text-neutral-600">No banners uploaded</p>
            </div>
          )}
          <DialogFooter>
            <Button
              className="shadow-md"
              onClick={() => setBannerDialog(false)}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Other components and content */}

      <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
        <DialogContent className="p-0 w-fit">
          <VisuallyHidden>
            <DialogHeader>
              <DialogTitle></DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
          </VisuallyHidden>
          <Calendar
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
        <AlertDialogContent className="md:w-[550px] gap-y-4 w-[90vw] rounded-lg max-w-[1000px]">
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

          <div className="mt-4 mb-4 flex justify-center w-full px-3 py-4 shadow-inner md:h-56 shadow-neutral-400 rounded-lg items-center">
            {completed === 0 && (
              <motion.div
                className="flex gap-y-6 flex-col w-full items-center justify-between"
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
                <div className="flex w-full gap-x-6 flex-col sm:flex-row gap-y-4">
                  <div className="w-full flex flex-col gap-y-2">
                    <div className="flex items-center">
                      <Label>Event Name</Label>
                      {eventName ? (
                        <CheckIcon
                          strokeWidth={2}
                          className="size-5 p-1 shadow-sm text-green-600 ml-2 bg-white border rounded-full"
                        />
                      ) : (
                        <MinusIcon
                          strokeWidth={3}
                          className="size-5 p-1 shadow-sm text-neural-600 ml-2 bg-white border rounded-full"
                        />
                      )}
                    </div>
                    <div className="relative">
                      <PenIcon className="absolute left-3 top-2.5 size-4" />

                      <Separator
                        orientation="vertical"
                        className="absolute left-9 bg-black/50 h-4 top-2.5"
                      />
                      <Input
                        onChange={(e) => setEventName(e.target.value)}
                        placeholder={`e.g. Memento, `}
                        className="pl-11 shadow-sm"
                        value={eventName}
                      />
                    </div>
                  </div>

                  <div className="w-full flex flex-col gap-y-2">
                    <div className="flex items-center">
                      <Label>Date</Label>
                      {date ? (
                        <CheckIcon
                          strokeWidth={3}
                          className="size-5 p-1 shadow-sm text-green-600 ml-2 bg-white border rounded-full"
                        />
                      ) : (
                        <MinusIcon
                          strokeWidth={3}
                          className="size-5 p-1 shadow-sm text-neural-600 ml-2 bg-white border rounded-full"
                        />
                      )}
                    </div>
                    <Button
                      variant={`outline`}
                      className="text-start shadow-sm bg-neutral-200"
                      onClick={() => setCalendarOpen(true)}
                    >
                      <CalendarIcon className="size-4" />
                      <Separator
                        orientation="vertical"
                        className="bg-black/50"
                      />
                      <p className="w-full text-start">
                        {`${
                          date?.from ? dateFormatter.format(date.from) : ""
                        } - ${date?.to ? dateFormatter.format(date.to) : ""}`}
                      </p>
                    </Button>
                  </div>
                </div>
                <div className="flex w-full gap-x-6 flex-col sm:flex-row gap-y-4">
                  <div className="w-full flex flex-col gap-y-2">
                    <div className="flex items-center">
                      <Label>Venue Location</Label>
                      {mapSelected ? (
                        <CheckIcon
                          strokeWidth={3}
                          className="size-5 p-1 shadow-sm text-green-600 ml-2 bg-white border rounded-full"
                        />
                      ) : (
                        <MinusIcon
                          strokeWidth={3}
                          className="size-5 p-1 shadow-sm text-neural-600 ml-2 bg-white border rounded-full"
                        />
                      )}
                    </div>
                    <Button
                      variant={`outline`}
                      className="text-start justify-start shadow-sm bg-neutral-200"
                      onClick={() => setMapOpen(true)}
                    >
                      <MapPinnedIcon className="size-4" />
                      <Separator
                        orientation="vertical"
                        className="bg-black/50"
                      />
                      <p className="truncate w-40 text-start">
                        {mapSelected ? placeName : "Select on map"}
                      </p>
                    </Button>
                  </div>{" "}
                  <div className="w-full flex flex-col gap-y-2">
                    <div className="flex items-center">
                      <Label>Venue Tag</Label>
                      {venueTag ? (
                        <CheckIcon
                          strokeWidth={3}
                          className="size-5 p-1 shadow-sm text-green-600 ml-2 bg-white border rounded-full"
                        />
                      ) : (
                        <MinusIcon
                          strokeWidth={3}
                          className="size-5 p-1 shadow-sm text-neural-600 ml-2 bg-white border rounded-full"
                        />
                      )}
                    </div>
                    <div className="relative">
                      <MapPinHouse className="absolute left-3 top-2.5 size-4" />

                      <Separator
                        orientation="vertical"
                        className="absolute left-9 bg-black/50 h-4 top-2.5"
                      />
                      <Input
                        onChange={(e) => setVenueTag(e.target.value)}
                        placeholder={`e.g. 1st floor, Nishat building`}
                        className="pl-11 shadow-sm"
                        value={venueTag}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}{" "}
            {completed === 50 && (
              <motion.div
                className="flex gap-x-4 flex-col gap-y-6 w-full py-2  items-center justify-between"
                initial={{
                  x: 20,
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
                <div className="flex w-full gap-x-6">
                  <div className="w-full flex flex-col gap-y-2">
                    <div className="flex items-center">
                      <Label>Ticket Price</Label>
                      {price ? (
                        <CheckIcon
                          strokeWidth={3}
                          className="size-5 p-1 shadow-sm text-green-600 ml-2 bg-white border rounded-full"
                        />
                      ) : (
                        <MinusIcon
                          strokeWidth={3}
                          className="size-5 p-1 shadow-sm text-neural-600 ml-2 bg-white border rounded-full"
                        />
                      )}
                    </div>
                    <div className="relative">
                      <IndianRupeeIcon className="absolute left-3 top-2.5 size-4" />

                      <Separator
                        orientation="vertical"
                        className="absolute left-9 bg-black/50 h-4 top-2.5"
                      />
                      <Input
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder={`e.g. 200, 250, `}
                        type="number"
                        value={price}
                        className="pl-11"
                      />
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-y-2">
                    <div className="flex items-center">
                      <Label>Blocks</Label>
                      {blocksList.length > 0 ? (
                        <CheckIcon
                          strokeWidth={3}
                          className="size-5 p-1 shadow-sm text-green-600 ml-2 bg-white border rounded-full"
                        />
                      ) : (
                        <MinusIcon
                          strokeWidth={3}
                          className="size-5 p-1 shadow-sm text-neural-600 ml-2 bg-white border rounded-full"
                        />
                      )}
                    </div>
                    <Button
                      variant={`outline`}
                      className="text-start justify-start bg-neutral-200"
                      onClick={() => setBlocksContainer(true)}
                    >
                      <BlocksIcon className="size-4" />
                      <Separator
                        orientation="vertical"
                        className="bg-black/50"
                      />
                      <p className="truncate w-40 text-start">
                        {blocksList.length > 0
                          ? "Manage blocks"
                          : "Create blocks"}
                      </p>
                    </Button>
                  </div>
                </div>{" "}
                <div className="flex gap-x-6 w-full">
                  <div className="w-full flex flex-col gap-y-2">
                    <div className="flex items-center">
                      <Label>Event Type</Label>
                      {eventType ? (
                        <CheckIcon
                          strokeWidth={3}
                          className="size-5 p-1 shadow-sm text-green-600 ml-2 bg-white border rounded-full"
                        />
                      ) : (
                        <MinusIcon
                          strokeWidth={3}
                          className="size-5 p-1 shadow-sm text-neural-600 ml-2 bg-white border rounded-full"
                        />
                      )}
                    </div>
                    <Select
                      required
                      onValueChange={(value) =>
                        setEventType(value as "public" | "private")
                      }
                    >
                      <SelectTrigger className="w-full focus-visible:ring-2 focus:ring-2 bg-neutral-200 font-medium">
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent className="font-medium">
                        <SelectItem value="public" className="flex">
                          Public <span className="font-normal">(everyone)</span>
                        </SelectItem>
                        <SelectItem value="private">
                          Private{" "}
                          <span className="font-normal w-[100px] truncate">
                            (close members only)
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>{" "}
                  <div className="w-full flex flex-col gap-y-2">
                    <div className="flex items-center">
                      <Label>Banners</Label>
                      {bannersList.length > 0 ? (
                        <CheckIcon
                          strokeWidth={3}
                          className="size-5 p-1 shadow-sm text-green-600 ml-2 bg-white border rounded-full"
                        />
                      ) : (
                        <MinusIcon
                          strokeWidth={3}
                          className="size-5 p-1 shadow-sm text-neural-600 ml-2 bg-white border rounded-full"
                        />
                      )}
                    </div>
                    <Button
                      variant={`outline`}
                      className="text-start justify-start bg-neutral-200"
                      onClick={() => setBannerDialog(true)}
                    >
                      <ImageIcon className="size-4" />
                      <Separator
                        orientation="vertical"
                        className="bg-black/50"
                      />
                      <p className="truncate w-40 text-start">
                        {bannersList.length > 0
                          ? "Manage banners"
                          : "Upload banners"}
                      </p>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
            {completed === 100 && (
              <motion.div
                className="flex gap-x-4 flex-col gap-y-6 w-full py-2  items-center justify-between"
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
                <div className="flex w-full  justify-center items-center gap-x-6">
                  <div className="w-1/2 flex flex-col gap-y-2">
                    <div className="flex items-center">
                      <Label>Brochure</Label>
                      {brochure ? (
                        <CheckIcon
                          strokeWidth={3}
                          className="size-5 p-1 shadow-sm text-green-600 ml-2 bg-white border rounded-full"
                        />
                      ) : (
                        <MinusIcon
                          strokeWidth={3}
                          className="size-5 p-1 shadow-sm text-neural-600 ml-2 bg-white border rounded-full"
                        />
                      )}
                    </div>
                    <Button
                      variant={`outline`}
                      className="text-start justify-start bg-neutral-200"
                      onClick={() => setBrochureDialog(true)}
                    >
                      <PaperclipIcon className="size-4" />
                      <Separator
                        orientation="vertical"
                        className="bg-black/50"
                      />
                      <p className="truncate w-40 text-start">
                        {brochure ? (
                          <span>{brochure.filename}</span>
                        ) : (
                          <span>Upload brochure</span>
                        )}
                      </p>
                    </Button>
                  </div>
                </div>{" "}
              </motion.div>
            )}
          </div>

          <div className="w-full flex justify-center items-center -mt-4">
            {completed !== 100 && (
              <div className="flex  gap-x-3">
                {completed !== 0 && (
                  <motion.div
                    initial={{
                      scale: 0,
                    }}
                    animate={{
                      scale: 1,
                    }}
                  >
                    <Button
                      variant={`outline`}
                      className="text-sm hover:scale-105 font-semibold w-[100px] transition-all duration-300 transform"
                      onClick={() => setCompleted(completed - 50)}
                    >
                      Previous
                    </Button>
                  </motion.div>
                )}
                <motion.div
                  initial={{
                    scale: 0,
                  }}
                  animate={{
                    scale: 1,
                  }}
                >
                  <Button
                    className="text-sm hover:scale-105 font-semibold w-[100px] transition-all duration-300  transform"
                    onClick={() => setCompleted(completed + 50)}
                  >
                    Next
                  </Button>
                </motion.div>
              </div>
            )}
            {completed === 100 && (
              <div className="flex gap-x-3">
                <motion.div
                  initial={{
                    scale: 0.8,
                  }}
                  animate={{
                    scale: 1,
                  }}
                >
                  <Button
                    variant={`outline`}
                    className="text-sm hover:scale-105 font-semibold w-[100px]"
                    onClick={() => setCompleted(completed - 50)}
                  >
                    Previous
                  </Button>
                </motion.div>
                <motion.div
                  initial={{
                    scale: 0,
                  }}
                  animate={{
                    scale: 1,
                  }}
                >
                  <Button
                    className="text-sm hover:scale-105 font-semibold w-[100px]"
                    onClick={handleSubmit}
                  >
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
