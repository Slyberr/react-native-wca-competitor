import { Card } from "@/components/card";
import { useLocalSearchParams } from "expo-router";
import { FlatList, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function competitiorList() {
    const params = useLocalSearchParams<{list?: string }>();
    const tabPersons = params.list?.split('&').map((item) => JSON.parse(item)) ?? []
    
    for (const person of tabPersons) {
        console.log(person)
    }

    return (<SafeAreaProvider>
          <SafeAreaView>
            <FlatList data={tabPersons} style={{}} renderItem={({item}) => <Card name={item.name} data={item}/>}/>
          </SafeAreaView>
          </SafeAreaProvider>)
}