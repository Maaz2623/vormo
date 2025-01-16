import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.organizations.$post>;
type RequestType = InferRequestType<
  typeof client.api.organizations.$post
>["json"];

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.organizations.$post({ json });
      return response.json();
    },
    onSuccess: (data) => {
      router.push(`/organization/${data}`);
      queryClient.invalidateQueries({
        queryKey: ["organizations"],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return mutation;
};
