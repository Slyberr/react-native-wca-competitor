import { Card } from "@/components/card";
import useColorMode from "@/hooks/useColorMode";
import { useLocalSearchParams } from "expo-router";
import { FlatList, Text, useColorScheme } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function competitiorList() {
    const params = useLocalSearchParams<{list?: string }>();
    const tabPersons = params.list?.split('&').map((item) => JSON.parse(item)) ?? []
    const colorScheme = useColorScheme()
    const colors = useColorMode(colorScheme)

    for (const person of tabPersons) {
        console.log(person)
    }

    return (<SafeAreaProvider>
          <SafeAreaView style={{backgroundColor : colors.backgroundColor,flex:1}}>
            <FlatList data={tabPersons} renderItem={({item}) => <Card name={item.name} data={item}/>}/>
          </SafeAreaView>
          </SafeAreaProvider>)
}