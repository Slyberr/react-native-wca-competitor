import { TextThemed } from "@/components/organics/TextThemed";
import useCheckUser from "@/hooks/useCheckUser";
import useColorMode from "@/hooks/useColorMode";
import { useRouter } from "expo-router";
import React from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [myValue, setInputValue] = React.useState("");
  let Loading = null;
  const router = useRouter();
  const colorScheme = useColorScheme()
  const colors = useColorMode(colorScheme)
  const textColor = colors?.text?.color
  const backgroundColor = colors?.backgroundColor
  const inputStyle = colors?.input

  const { refetch } = useCheckUser(myValue);
  const fetchData = async () => {
    const { data } = await refetch();
    //On va directement sur le profil
    if (data && data.length == 1) {
      Loading = "Chargement...";
      console.log(data)
      router.push({
        pathname: `/competitior/[id]`,
        params: {
          id: data[0].wca_id ?? "",
          data: JSON.stringify(data[0]),
        },
      });
    //On propose un choix de personnes correspondantes 
    } else if (data && data.length > 1){
      const mappedData = data.map((item: any) => JSON.stringify(item))
      console.log(mappedData)
      router.push({
        pathname: `/competitior/list`,
        params: {
          list: mappedData.join('&')
        },
      });

    } else {
      return ToastAndroid.show(
        "Erreur: " + myValue + " ne correspond à aucun profil.",
        ToastAndroid.SHORT,
      );
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor : backgroundColor }}>
        <View style={{ alignItems: "center", gap: 10, margin: 10 }}>
          <TextThemed  content="Bienvenue sur compétitor viewer !" />
          <Image
            style={{ width: 250, height: 250 }}
            source={colorScheme === 'light' ? require("@/assets/images/WCA-logo.png") : require("@/assets/images/WCA-logo-dark.png")}
          />
        </View>

        <View style={{ alignItems: "center" }}>
          <TextThemed content="Trouvez votre compétiteur." style={{fontSize:25}}></TextThemed>
          <TextInput
            onChangeText={setInputValue}
            value={myValue}
            style={{
              borderColor: inputStyle?.borderColor,
              borderStyle: "solid",
              borderRadius: 10,
              borderWidth: 1,
              width: "80%",
              marginTop: 30,
              marginBottom: 15,
              color : inputStyle?.textColor,
            }}
            defaultValue=""
            placeholder="Entrez un nom ou un ID WCA."
            placeholderTextColor={inputStyle?.placeholderColor}
          ></TextInput>

          <Button title="Search" color="#05186b" onPress={fetchData}></Button>
          <Text>{Loading}</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  text: { fontSize: 30 },
});
