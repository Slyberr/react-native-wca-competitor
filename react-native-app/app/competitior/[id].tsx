import useGetBest from "@/hooks/useGetBest";
import useGetNationalRank from "@/hooks/useGetNationalRank";
import { useLocalSearchParams } from "expo-router";
import { Image, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

let eventMap: Map<string, string> = new Map([
  ["222", "2x2"],
  ["333", "3x3"],
  ["333oh", "3x3 à une main"],
  ["333bf", "3x3 à l'aveugle"],
  ["333mbf", "3x3 multiple à l'aveugle"],
  ["333fm", "3x3 résolution optimisé"],
  ["444", "4x4"],
  ["444bf", "4x4 à l'aveugle"],
  ["555", "5x5"],
  ["555bf", "5x5 à l'aveugle"],
  ["666", "6x6"],
  ["777", "7x7"],
  ["pyram", "Pyraminx"],
  ["skewb", "Skewb"],
  ["sq1", "Square-1"],
  ["minx", "Megaminx"],
  ["clock", "Clock"],
]);
enum Rank {
  NR = "NR",
  CR = "CR",
  WR = "WR",
}



export default function competitor() {
  const params = useLocalSearchParams<{ id: string; data?: string }>();
  const data = JSON.parse(params.data ?? "");
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          margin: 10,
        }}
      >
        <Text>{data?.name}</Text>
        <Text>Meilleur temps réalisé : {bestTime(params.id)}</Text>
        <Text>Meilleur rang national  : {bestNationalRank(params.id)}</Text>
        <Text>Meilleur rang mondial : {bestNationalRank(params.id)}</Text>
        <View
          style={{
            justifyContent: "flex-start",
            height: 150,
          }}
        >
          {/* <Image
            src={data?.user?.avatar?.thumb_url}
            style={{
              width: 150,
              height: 150,
            }}
            resizeMode="contain"
          ></Image> */}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function bestTime(ID : string): string {
  const {data,error} = useGetBest(ID)
  if (error) {
    console.error("There is an error : " + error.message)
  }
  if (data && data.length > 0) {
    return `${convertHHMM(data[0].best)} (${eventMap.get(data[0].event_id)})`
  }
  return ""
}

function bestNationalRank(ID: string): string {
  const {data : test,error} = useGetNationalRank(ID)
  if (error) {
    console.error("There is an error : " + error.message)
  }
  if (test && test.length > 0) {
    console.log(test, "here")
    let bestTX = 0
    let eventID : string = ""
    let total = 0
    let rank = 0
    let type = ""

    for(const rang of test) {
      const TX =   1 - (rang.country_rank /rang.country_total)
      if (TX > bestTX ) {
        bestTX = TX
        eventID = rang.event_id ?? ""
        total = rang.country_total
        rank = rang.country_rank
        type = rang.single
      }
    }
    //Si la personne a plusieurs NR, on prend celui qui est le "plus dur à avoir". On met le taux à 1 artificiellement
    //par la suite
    return `${eventMap.get(eventID)} ${type} (${rank === 1 ? "1er" : rank + "e"} sur ${total}, Tx = ${rank === 1 ? 1 : Math.floor(bestTX*1000)/1000})`
  }
  return "NO DATA";
}

function convertHHMM(time: number): string {
  let min = null;
  let seconds = Math.floor(time / 100);
  let mill = time % 100;
  let label = null;

  if (seconds > 60) {
    min = Math.floor(seconds / 60);
    seconds = seconds - min * 60;
    if (min > 1) {
      label = "minutes";
    } else {
      label = "minute";
    }
  } else {
    if (seconds > 1) {
      label = "secondes";
    } else {
      label = "seconde";
    }
  }

  return min
    ? `${min}:${seconds}.${mill} ${label}`
    : `${seconds}.${mill} ${label}`;
}

