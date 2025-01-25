"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetEventsBySlug } from "@/features/events/api/use-get-events-by-slug";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

const EventsContainer = () => {
  const params = useParams();

  const { data: events } = useGetEventsBySlug({
    slug: params.organizationSlug as string,
  });

  if (!events) return;

  return (
    <div className="flex-grow w-full bg-white rounded-lg">
      <div className="h-14 border"></div>
      <ScrollArea className="flex justify-center items-center">
        <div className="flex flex-wrap px-5 py-8 gap-10 w-full justify-center items-center">
          {events.map((event) => {
            return (
              <Link
                href={`/organization/${params.organizationSlug}/events/${event.id}`}
                className="w-[300px] cursor-pointer shadow-md hover:shadow-xl transition-all duration-600 overflow-hidden group flex-col rounded-lg"
                key={event.id}
              >
                <div className="h-[200px] overflow-hidden">
                  {event.banners ? (
                    <Image
                      src={event.banners[0]}
                      alt="poster"
                      width={400}
                      height={400}
                      className="w-full group-hover:scale-110 transition-all duration-300"
                    />
                  ) : (
                    <Image
                      src={`/file.svg`}
                      alt="file"
                      width={400}
                      height={400}
                      className="w-full"
                    />
                  )}
                </div>
                <div className="px-2">
                  <p>{event.name}</p>
                  <p>{event.dateFrom}</p>
                  <p>{format(event.dateTo, "yyyy-MM-dd")}</p>
                  <p>{event.price}</p>
                  <p>{event.venueLocation.lat}</p>
                  <p>{event.venueLocation.lng}</p>
                  <p>{event.venueTag}</p>
                  <p>{event.brochure}</p>
                  <p>{event.eventType}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default EventsContainer;
