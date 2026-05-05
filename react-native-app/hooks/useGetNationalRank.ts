import { useQuery } from "@tanstack/react-query";

const endpoint = process.env.EXPO_PUBLIC_API_URL + "/ranks/national/";

export default function useGetNationalRank(ID: string) {
  console.log(endpoint + ID)
  return useQuery({
    queryKey: [ID+"rankNational"],
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
