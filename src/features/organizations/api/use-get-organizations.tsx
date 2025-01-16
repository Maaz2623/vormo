import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetOrganizations = (email: string) => {
  const query = useQuery({
    queryKey: ["organizations", email], // Unique cache key for this query
    queryFn: async () => {
      const response = await client.api.organizations.$get({
        email: email,
      });
      if (!response.ok) {
        throw new Error("Failed to fetch organizations");
      }
      const { result } = await response.json();

      return result;
    },
  });

  return query;
};
