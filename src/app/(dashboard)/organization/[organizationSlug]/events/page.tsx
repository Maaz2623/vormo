import React from "react";
import PagesHeader from "../_components/pages-header";
import CreateEventModal from "@/features/events/components/create-event-modal";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      <ScrollArea className="flex-grow w-full bg-white rounded-lg">
        
      </ScrollArea>
    </div>
  );
};

export default EventsPage;
