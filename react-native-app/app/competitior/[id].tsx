import { eventMap, Rank } from "@/types/rank";
import { useLocalSearchParams } from "expo-router";
import { Image, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useBestNationalRank, useBestContinentRank, useBestWorldRank } from '@/hooks/useGetRegionRank';
import useGetBest from "@/hooks/useGetBest";


export default function competitor() {
  const params = useLocalSearchParams<{ id: string; data?: string }>();
  console.log(params.data)
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
        <Text>Meilleur rang National : {useBestNationalRank(params.id)}</Text>
        <Text>Meilleur rang Continental : {useBestContinentRank(params.id)}</Text>
        <Text>Meilleur rang Mondial : {useBestWorldRank(params.id)}</Text>
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

