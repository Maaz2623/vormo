import React from "react";
import PagesHeader from "../_components/pages-header";
import CreateEventModal from "@/features/events/components/create-event-modal";
import EventsContainer from "./_components/events-container";

const EventsPage = () => {
  return (
    <div className=" h-full flex flex-col gap-y-2">
      <PagesHeader
        title="Events"
        description="Updates on events in this organization"
      >
        <div className="h-full w-40  flex justify-end px-2 items-center">
          <CreateEventModal />
        </div>
      </PagesHeader>
      <EventsContainer />
    </div>
  );
};

export default EventsPage;
