import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.events.$post>;
type RequestType = InferRequestType<typeof client.api.events.$post>["json"];

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.events.$post({ json });
      return response.json();
    },
    onSuccess: () => {
      toast.success("Event Created. Redirecting...");

      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return mutation;
};
