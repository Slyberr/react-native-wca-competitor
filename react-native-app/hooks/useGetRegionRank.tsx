import { convertMMSS } from "@/utils/convertMMSS";
import {Rank } from "@/types/rank";
import { timeoutManager, useQuery } from "@tanstack/react-query";
import { ColorSchemeName, Text, useColorScheme, View } from "react-native";
import { Image } from "expo-image";
import { eventIconLight, eventIconDark, eventMap } from "@/types/event";
import { TextThemed } from "@/components/organics/TextThemed";


export function useGetRegionRank(ID: string, typeRank: Rank) : React.JSX.Element  {
  let endpoint = process.env.EXPO_PUBLIC_API_URL + "/ranks/";
  const colorScheme = useColorScheme()
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
    return displayStat(eventID,type,rank,typeRank,total,bestTop,time,colorScheme)
  }
  return <Text>No DATA</Text>;
}

function displayStat(eventID : string,type : string,rank : number,typerank : string,total : number,bestTop : number,time: number,colorScheme: ColorSchemeName) : React.JSX.Element {
  let displayTime : string | number = time
  //Le FMC n'est pas compris par le calcul convertMMSS
  if (eventID!='333fm') {
    displayTime = convertMMSS(time,eventID)
  }
  let place = rank + "e"
  let topShow : number | string =  ''

  if (rank === 1 ) {
    place = '1er'
    topShow = typerank + '!'
  } else if (rank < 50 && typerank === Rank.WR) {
    topShow = 'World-Class'
  } else if (rank < 10 && typerank === Rank.WR) {
    topShow = 'Élite'
  }

  if (topShow === '') {
    topShow = Math.floor(10000 - bestTop * 10000) / 100
    if (topShow >0.5) {
      topShow = Math.floor(1000 - bestTop * 1000) / 10
    }
    topShow = 'Top ' + topShow + ' %' 
  }

  const fullString = `${displayTime} ${type} ${place}/${total}, ${topShow}`
  
  let eventIcon =  eventIconLight[eventID]
  if (colorScheme === "dark") {
    eventIcon = eventIconDark[eventID]
  }

  return (
    
    <View style={{flexDirection:'row', margin: 10, gap:5}}>
      <Image 
        source={eventIcon} 
        style={{ width: 20, height: 20 }}>
      </Image>
      <TextThemed content={fullString}/> 
    </View>
  )
}
