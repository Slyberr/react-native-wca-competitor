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
        {/* <Text>Nombre de compétitions : {data?.numberOfCompetitions}</Text>
        <Text>Nationnalité : {data?.country}</Text>
        <Text>Meilleur temps réalisé : {bestTime(data?.results)}</Text>
        <Text>Meilleur rang national: {bestRank(data?.rank, Rank.NR)}</Text> */}
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

function bestTime(data: Record<any, any>): string {
  let bestTime = 999999;
  let eventId = "NULL";
  for (const [keyComp, valueComp] of Object.entries(data)) {
    for (const [keyEvent, valueEvent] of Object.entries(valueComp)) {
      for (const round of valueEvent) {
        console.log(round);
        if (
          round?.best! > 1 &&
          round?.best < bestTime &&
          keyEvent !== "333fm"
        ) {
          eventId = keyEvent;
          bestTime = round.best;
        }
      }
    }
  }

  return `${convertHHMM(bestTime)} (${eventMap.get(eventId)})`;
}

function bestRank(data: Record<any, any>, rankType: Rank): string {
  let bestRank = 999999;
  let eventId = "NULL";

  for (const [keyType, valueType] of Object.entries(data)) {
    for (const event of valueType) {
      if (rankType == "NR" && event?.rank.country < bestRank) {
        bestRank = event?.rank.country;
        eventId = event?.eventId;
      } else if (rankType == "CR" && event?.rank.continent < bestRank) {
        bestRank = event?.rank.world;
        eventId = event?.eventId;
      } else {
        if (event?.rank.world < bestRank) {
          bestRank = event?.rank.world;
          eventId = event?.eventId;
        }
      }
    }
  }
  return `${bestRank} (${eventMap.get(eventId)})`;
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
