import { useQuery } from "@tanstack/react-query";

const endpoint = process.env.URL + "persons/";

export default function useCheckUser(ID: string) {
  return useQuery({
    queryKey: [ID],
    queryFn: async () => {
      return await fetch(endpoint + ID).then((r) => {
        if (!r.ok) {
          return false;
        } else {
          return true;
        }
      });
    },
  });
}
