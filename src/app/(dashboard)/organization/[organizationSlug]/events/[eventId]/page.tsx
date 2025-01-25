"use client";
import React from "react";
import { useGetEventById } from "@/features/events/api/use-get-event-by-id";
import { useParams } from "next/navigation";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";

const EventPage = () => {
  const params = useParams();

  const { data: event } = useGetEventById({
    id: params.eventId as string,
  });

  if (!event) return;

  return (
    <div className="w-full h-full bg-white rounded-lg p-4">
      <div className="w-full flex justify-center items-center">
        <Carousel className="rounded-lg w-[700px] overflow-hidden">
          {event.banners?.map((banner) => (
            <div key={banner} className="w-full relative h-full">
              <Image
                src={banner}
                alt="banners"
                width={800}
                height={800}
                className="rounded-lg"
              />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default EventPage;
