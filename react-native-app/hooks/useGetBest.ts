import { useQuery } from "@tanstack/react-query";

const endpoint = process.env.EXPO_PUBLIC_API_URL + "/best/";

export default function useGetBest(ID: string) {
  return useQuery({
    queryKey: [ID+"bestime"],
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
