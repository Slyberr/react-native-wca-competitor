import { useQuery } from "@tanstack/react-query";

const endpoint =
  "https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/refs/heads/v1/persons/";

export default function useGetUserInfo(ID: string) {
  return useQuery({
    queryKey: [ID],
    queryFn: async () => {
      return await fetch(endpoint + ID + ".json").then((r) => {
        if (!r.ok) {
          throw new Error("something wrong");
        } else {
          return r.json();
        }
      });
    },
  });
}
