import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetEventsBySlug = ({ slug }: { slug: string }) => {
  const query = useQuery({
    queryKey: ["events"], // Unique cache key for this query
    queryFn: async () => {
      const response = await client.api.events[":slug"].$get({
        param: {
          slug,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const { events } = await response.json();

      return events.reverse();
    },
  });

  return query;
};
