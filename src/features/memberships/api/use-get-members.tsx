import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetMembers = (slug: string) => {
  const query = useQuery({
    enabled: !!slug,
    queryKey: ["organizations", { slug }], // Unique cache key for this query
    queryFn: async () => {
      const response = await client.api.memberships[":slug"].$get({
        param: {
          slug,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch organizations");
      }
      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
