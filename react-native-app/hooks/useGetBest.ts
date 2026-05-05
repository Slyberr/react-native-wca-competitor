import { useQuery } from "@tanstack/react-query";

const endpoint = process.env.EXPO_PUBLIC_API_URL + "/best/";

export default function useGetBest(ID: string) {
  console.log(endpoint + ID)
  return useQuery({
    queryKey: [ID],
    queryFn: async () => {
      return await fetch(endpoint + ID).then((r) => {
        if (!r.ok) {
          throw new Error("something when wrong.")
        } else {
         
          return r.json()
        }
      });
    
    },
  });
}
