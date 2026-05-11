import { convertMMSS } from "@/utils/convertMMSS";
import {Rank } from "@/types/rank";
import { timeoutManager, useQuery } from "@tanstack/react-query";
import { Text, View } from "react-native";
import { Image } from "expo-image";
import { eventImage, eventMap } from "@/types/event";



export function useBestNationalRank(ID: string) : React.JSX.Element  {
  return useGetRegionRank(ID, Rank.NR);
}

export function useBestContinentRank(ID: string) : React.JSX.Element  {
  return useGetRegionRank(ID, Rank.CR);
}

export function useBestWorldRank(ID: string) : React.JSX.Element {
  return useGetRegionRank(ID, Rank.WR);
}

function useGetRegionRank(ID: string, typeRank: Rank) : React.JSX.Element  {
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
    return <Text>Error</Text>;
  }
  if (data && data.length > 0) {
    let bestTop = 0;
    let eventID: string = "";
    let total = 0;
    let rank = 0;
    let type = "";
    let time = 0;

    for (const rang of data) {
      const currentRank =
        typeRank === Rank.NR
          ? rang.country_rank
          : typeRank === Rank.CR
            ? rang.continent_rank
            : rang.world_rank;
      const currentTotal =
        typeRank === Rank.NR
          ? rang.total_country
          : typeRank === Rank.CR
            ? rang.total_continent
            : rang.total_world;
      const Top = 1 - currentRank / currentTotal;
      if (Top > bestTop) {
        console.log(rang);
        bestTop = Top;
        eventID = rang.event_id ?? "";
        total = currentTotal;
        rank = currentRank;
        type = rang.type;
        time = rang.best;
      }
    }
    //Si la personne a plusieurs NR, on prend celui qui est le "plus dur à avoir". On met le taux à 1 artificiellement
    //par la suite
    return displayStat(eventID,type,rank,typeRank,total,bestTop,time)
  }
  return <Text>No DATA</Text>;
}

function displayStat(eventID : string,type : string,rank : number,typerank : string,total : number,bestTop : number,time: number){
  const eventIDToString = eventMap.get(eventID);
  let displayTime : string | number = time
  //Le FMC n'est pas compris par le calcul convertMMSS
  if (eventID!='333fm') {
    displayTime = convertMMSS(time,eventID)
  }
  let place = rank + "e"
  let topShow = Math.floor(100000 - bestTop * 100000) / 1000 + '%'

  if (rank === 1 ) {
    place = '1er'
    topShow = typerank + '!'
  } else if (rank < 50 && typerank === Rank.WR) {
    topShow = 'World-Class'
  } else if (rank < 10 && typerank === Rank.WR) {
    topShow = 'Élite'
  }

  const fullString = `${displayTime} ${type} ${place}/${total}, ${topShow}`

  return (
    
    <View style={{flexDirection:'row'}}>
      <Image 
        source={eventImage[eventID]} 
        style={{ width: 20, height: 20 }}>
      </Image>
      <Text> {fullString}</Text>
    </View>
  )
}
