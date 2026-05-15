import { useQuery } from "@tanstack/react-query";

const endpoint = process.env.EXPO_PUBLIC_WCA_URL


export default function useGetPPicture(ID: string) {

  return useQuery({
    queryKey: [ID+"IMG"],
    queryFn: async () => {
      return await fetch(endpoint + ID, {headers:  {"Authorization": "Bearer " + process.env.PRIVATE_TOKEN}}).then((r) => {
        if (!r.ok) {
          throw new Error("something when wrong.")
        } else {
          return r.json()
        }
      });

    },

  });
}
