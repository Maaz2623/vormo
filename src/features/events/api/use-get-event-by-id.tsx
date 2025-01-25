import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetEventById = ({ id }: { id: string }) => {
  const query = useQuery({
    queryKey: ["events", id], // Unique cache key for this query
    queryFn: async () => {
      const response = await client.api.events.event[":id"].$get({
        param: {
          id,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const { event } = await response.json();

      return event;
    },
  });

  return query;
};
