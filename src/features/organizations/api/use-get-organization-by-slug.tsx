import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetOrganizationBySlug = (slug: string) => {
  const query = useQuery({
    enabled: !!slug,
    queryKey: ["organizations", { slug }], // Unique cache key for this query
    queryFn: async () => {
      const response = await client.api.organizations[":slug"].$get({
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
