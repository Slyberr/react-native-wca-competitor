import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useBestNationalRank, useBestContinentRank, useBestWorldRank } from '@/hooks/useGetRegionRank';
import useGetBest from "@/hooks/useGetBest";
import { convertMMSS } from "../../utils/convertMMSS";
import useGetPPicture from "@/hooks/useGetPPicture";
import emojiFlags from "emoji-flags";
import { eventMap } from "@/types/event";
import { Image } from "expo-image";


export default function competitor() {
  const params = useLocalSearchParams<{ id: string; data?: string }>();
  const data = JSON.parse(params.data ?? "");
  const { data: wca_resume, error: imgError, isLoading: imgLoading } = useGetPPicture(params.id)
  console.log(wca_resume)
  const profilePicture = wca_resume?.person?.avatar?.url
  
  
  console.log(profilePicture)

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          margin: 10,
        }}
      >

         <Text style={{ fontSize: 30, margin: 20, textAlign: "center" }}>{data?.name} {emojiFlags.countryCode(data?.code_country).emoji}</Text>

        <View style={{flexDirection:'row', justifyContent:'space-around', alignItems:'flex-start'}}>
         <View style={{ width: '45%', height: 170, alignContent:'flex-start',justifyContent:'center',overflow:'hidden', borderWidth:3}}>
          {imgLoading  
              ? (<ActivityIndicator size="large" color="#0000ff" style={{}} />) 
              : (<Image source={profilePicture} contentFit="cover" contentPosition='top center' style={{ width: '100%',height:'100%'} }></Image>)}

         </View>
         <View style={{flexDirection: "column"}}>
          <Text>Nombre de compétitions : {wca_resume?.competition_count} </Text>
          <Text>Médailles : {wca_resume?.medals?.total === 0 ? 'Pas encore !' : wca_resume?.medals.total} </Text>
          <Text>Records nationaux : {wca_resume?.records?.national}</Text>
          <Text>Records continentaux : {wca_resume?.records?.continental}</Text>
          <Text>Records mondiaux : {wca_resume?.records?.world}</Text>
         </View>
        </View>
       
        <View>
          <View>
              <Text style={{fontSize:20}}>Meilleur rang National: </Text> 
              {useBestNationalRank(params.id)}
          </View>
           <View>
              <Text style={{fontSize:20}}>Meilleur rang Continental: </Text> 
              {useBestContinentRank(params.id)}
          </View>
           <View>
              <Text style={{fontSize:20}}>Meilleur rang Mondial: </Text> 
              {useBestWorldRank(params.id)}
          </View>
            <Text>Temps notables : {'\n' + bestTime(params.id)}</Text>
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



