import { eventMap, Rank } from "@/types/rank";
import { useQuery } from "@tanstack/react-query";

export function useBestNationalRank(ID: string): string {
  return useGetRegionRank(ID, Rank.NR);
}

export function useBestContinentRank(ID: string): string {
  return useGetRegionRank(ID, Rank.CR);
}

export function useBestWorldRank(ID: string): string {
  return useGetRegionRank(ID, Rank.WR);
}

function useGetRegionRank(ID: string, typeRank: Rank): string {
  let endpoint = process.env.EXPO_PUBLIC_API_URL + "/ranks/";

  switch (typeRank) {
    case Rank.CR:
      endpoint += "continental/";
      break;
    case Rank.NR:
      endpoint += "national/";
      break;
    case Rank.WR:
      endpoint += "world/";
      break;
  }

  const { data, error } = useQuery({
    queryKey: [ID + "-rank-" + typeRank],
    queryFn: async () => {
      return await fetch(endpoint + ID).then((r) => {
        if (!r.ok) {
          throw new Error("something when wrong." + r.toString());
        } else {
          return r.json();
        }
      });
    },
  });

  if (error) {
    console.error("There is an error : " + error.message);
    return "ERROR";
  }
  if (data && data.length > 0) {
    let bestTop = 0;
    let eventID: string = "";
    let total = 0;
    let rank = 0;
    let type = "";

    for (const rang of data) {
      const currentRank = typeRank === Rank.NR ? rang.country_rank : typeRank === Rank.CR ? rang.continent_rank : rang.world_rank
      const currentTotal = typeRank === Rank.NR ? rang.total_country : typeRank === Rank.CR ? rang.total_continent : rang.total_world
      const Top =  1 - currentRank / currentTotal
      if (Top > bestTop) {
        bestTop = Top;
        eventID = rang.event_id ?? "";
        total = currentTotal;
        rank = currentRank;
        type = rang.type;
      }
    }
    //Si la personne a plusieurs NR, on prend celui qui est le "plus dur à avoir". On met le taux à 1 artificiellement
    //par la suite
    return `${eventMap.get(eventID)} ${type} \n (${rank === 1 ? "1er" : rank + "e"} /  ${total}), ${rank === 1 ? typeRank : `Top ${Math.floor(100000 - bestTop * 100000) / 1000}%`} `;
  }
  return "NO DATA";
}
