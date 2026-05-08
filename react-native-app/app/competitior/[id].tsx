import { eventMap, Rank } from "@/types/rank";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useBestNationalRank, useBestContinentRank, useBestWorldRank } from '@/hooks/useGetRegionRank';
import useGetBest from "@/hooks/useGetBest";
import { convertMMSS } from "../../utils/convertMMSS";
import useGetPPicture from "@/hooks/useGetPPicture";


export default function competitor() {
  const params = useLocalSearchParams<{ id: string; data?: string }>();
  const data = JSON.parse(params.data ?? "");
  const { data: img, error: imgError, isLoading: imgLoading } = useGetPPicture(params.id)
  const profilePicture = img?.person?.avatar?.url
  
  console.log(profilePicture)

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          margin: 10,
        }}
      >
        <Text style={{ fontSize: 30, margin: 20, textAlign: "center" }}>{data?.name}</Text>
        <View style={{ width: '100%', height: 200, alignItems: "center", justifyContent:"center" }}>
          {imgLoading  
              ? (<ActivityIndicator size="large" color="#0000ff" style={{}} />) 
              : (<Image src={profilePicture} style={{ width: '100%', height: 180, objectFit: "contain" } }></Image>)}

        </View>

        <Text>Meilleur rang National : {useBestNationalRank(params.id)}</Text>
        <Text>Meilleur rang Continental : {useBestContinentRank(params.id)}</Text>
        <Text>Meilleur rang Mondial : {useBestWorldRank(params.id)}</Text>
        <Text>Temps notables : {'\n' + bestTime(params.id)}</Text>

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

function bestTime(ID: string): string {
  const { data, error } = useGetBest(ID)
  if (error) {
    console.error("There is an error : " + error.message)
  }
  if (data && data.length > 0) {
    let stringToReturn = ""
    for (const time of data) {
      stringToReturn += `${convertMMSS(time.best, time.event_id)} (${eventMap.get(time.event_id)}) \n`
    }
    return stringToReturn
  }
  return ""
}



