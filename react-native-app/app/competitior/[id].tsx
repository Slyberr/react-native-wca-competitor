import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text, useColorScheme, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import useGetBest from "@/hooks/useGetBest";
import { convertMMSS } from "../../utils/convertMMSS";
import useGetPPicture from "@/hooks/useGetPPicture";
import emojiFlags from "emoji-flags";
import { eventMap } from "@/types/event";
import { Image } from "expo-image";
import useColorMode from "@/hooks/useColorMode";
import { TextThemed } from "@/components/organics/TextThemed";
import { useGetRegionRank } from "@/hooks/useGetRegionRank";
import { Rank } from "@/types/rank";
import { ThemedText } from "@/app-example/components/themed-text";



export default function competitor() {
  const params = useLocalSearchParams<{ id: string; data?: string }>();
  const data = JSON.parse(params.data ?? "");
  const { data: wca_resume, error: imgError, isLoading: imgLoading } = useGetPPicture(params.id)
  const profilePicture = wca_resume?.person?.avatar?.url
  const colorScheme = useColorScheme()
  const color = useColorMode(colorScheme)



  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: color.backgroundColor
        }}
      >
        <View style={{ margin: 10 }}>
          <TextThemed content={`${data?.name} ${emojiFlags.countryCode(data?.code_country).emoji}`} style={{ fontSize: 30, marginBottom:10, textAlign: "center" }} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-start', gap:20 }}>
            <View style={{ width: '45%', height: 170, alignContent: 'flex-start', justifyContent: 'center', overflow: 'hidden', borderWidth: 3, borderColor:color.border.color }}>
              {imgLoading
                ? (<ActivityIndicator size="large" color="#0000ff" style={{}} />)
                : (<Image source={profilePicture} contentFit="cover" contentPosition='top center' style={{ width: '100%', height: '100%' }}></Image>)}

            </View>

            {wca_resume 
              ? 
              (<View style={{ flexDirection: "column", marginTop: 10, justifyContent:'center'}}>
                <TextThemed content={`Nombre de compétitions : ${wca_resume?.competition_count}`} />
                <TextThemed content={`Médailles : ${wca_resume?.medals?.total === 0 ? 'Pas encore !' : wca_resume?.medals.total} `} />
                <TextThemed content={`Records nationaux : ${wca_resume?.records?.national}`} />
                <TextThemed content={`Records continentaux : ${wca_resume?.records?.continental}`} />
                <TextThemed content={`Records mondiaux : ${wca_resume?.records?.world}`} /> 
                </View>) 
              : (<View>
                  <ActivityIndicator size="large" color="#0000ff" style={{alignSelf:'center'}} /> 
                  <TextThemed content={'Loading Data...'}></TextThemed>
                </View>)
              }


          </View>

          <View style={{ marginTop: 15, gap: 10 }}>
            <View>
              <TextThemed style={{ fontSize: 20 }} content={'Meilleur rang National:'} />
              {useGetRegionRank(params.id, Rank.NR)}
            </View>
            <View>
              <TextThemed style={{ fontSize: 20 }} content={'Meilleur rang Continental:'} />
              {useGetRegionRank(params.id, Rank.CR)}
            </View>
            <View>
              <TextThemed style={{ fontSize: 20 }} content={'Meilleur rang Mondial:'} />
              {useGetRegionRank(params.id, Rank.WR)}
            </View>
            <Text>Temps notables : {'\n' + bestTime(params.id)}</Text>
          </View>
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



