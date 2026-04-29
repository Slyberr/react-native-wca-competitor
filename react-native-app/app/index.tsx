import useCheckUser from "@/hooks/useCheckUser";
import { useRouter } from "expo-router";
import React from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [myValue, setInputValue] = React.useState("");
  let Loading = null;
  const router = useRouter();

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
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ alignItems: "center", gap: 10, margin: 10 }}>
          <Text style={{ fontSize: 25 }}>
            Bienvenue sur competitor Viewer !
          </Text>
          <Image
            style={{ width: 350, height: 350 }}
            source={require("@/assets/images/WCA-logo.png")}
          />
        </View>

        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 18, marginTop: 30 }}>
            Trouvez votre compétiteur.
          </Text>
          <TextInput
            onChangeText={setInputValue}
            value={myValue}
            style={{
              borderColor: "#000000",
              borderStyle: "solid",
              borderRadius: 10,
              borderWidth: 1,
              width: "80%",
              marginTop: 30,
            }}
            defaultValue=""
            placeholder="Entrez l'ID WCA"
          ></TextInput>

          <Button title="Search" color="#000000" onPress={fetchData}></Button>
          <Text>{Loading}</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  text: { fontSize: 30 },
});
