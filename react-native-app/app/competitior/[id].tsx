import { eventMap, Rank } from "@/types/rank";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useBestNationalRank, useBestContinentRank, useBestWorldRank } from '@/hooks/useGetRegionRank';
import useGetBest from "@/hooks/useGetBest";
import { convertMMSS } from "../../utils/convertMMSS";
import useGetPPicture from "@/hooks/useGetPPicture";
import emojiFlags from "emoji-flags";


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
          margin: 10,
        }}
      >
        <View style={{ alignItems: "center"}}>

         <Text style={{ fontSize: 30, margin: 20, textAlign: "center" }}>{data?.name} {emojiFlags.countryCode(data?.code_country).emoji}</Text>
         <View style={{ width: '100%', height: 170, alignItems: "center", justifyContent:"center" }}>
          {imgLoading  
              ? (<ActivityIndicator size="large" color="#0000ff" style={{}} />) 
              : (<Image src={profilePicture} style={{ width: '100%', height: 150, objectFit: "contain" } }></Image>)}

         </View>
        </View>
       
        <View>
          <View>
              <Text style={{fontSize:20}}>Meilleur rang National: </Text> 
              <Text>{useBestNationalRank(params.id)}</Text>
          </View>
           <View>
              <Text style={{fontSize:20}}>Meilleur rang Continental: </Text> 
              <Text>{useBestContinentRank(params.id)}</Text>
          </View>
           <View>
              <Text style={{fontSize:20}}>Meilleur rang Mondial: </Text> 
              <Text>{useBestWorldRank(params.id)}</Text>
          </View>
            <Text>Temps notables : {'\n' + bestTime(params.id)}</Text>
        </View>
        

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



