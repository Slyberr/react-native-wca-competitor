import { useQuery } from "@tanstack/react-query";

const endpoint =
  "https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/refs/heads/v1/persons/";

export default function useCheckUser(ID: string) {
  return useQuery({
    queryKey: [ID],
    queryFn: async () => {
      return await fetch(endpoint + ID + ".json").then((r) => {
        if (!r.ok) {
          return false;
        } else {
          return true;
        }
      });
    },
  });
}
